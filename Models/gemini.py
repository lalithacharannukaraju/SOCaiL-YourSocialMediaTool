from flask import Flask, request, jsonify
from flask_cors import CORS
from google.genai import Client
from dotenv import load_dotenv
import os
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
print("FILE EXECUTION STARTED")

# Path to the .env file in the Backend directory
backend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'Backend')
env_path = os.path.join(backend_dir, '.env')
print("Looking for .env at:", env_path)
print("File exists:", os.path.exists(env_path))
if os.path.exists(env_path):
    with open(env_path) as f:
        print("File contents:\n", f.read())
print("before load")

load_dotenv(dotenv_path=env_path)

gemini_api_key = os.getenv("GEMINI_API_KEY")
print("Loaded GEMINI_API_KEY:", repr(gemini_api_key))  # Debug print
if not gemini_api_key:
    print("ERROR: GEMINI_API_KEY is not set or not loaded from .env! Check your .env file in the Backend directory.")
    exit(1)

# Initialize the new Google GenAI client
genai_client = Client(api_key=gemini_api_key)

# Use a valid model name with models/ prefix
# Available models: "models/gemini-2.5-pro", "models/gemini-2.5-flash", "models/gemini-2.0-flash-exp"
MODEL_NAME = "models/gemini-2.5-flash"  # Fast and efficient model

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

def generate_text(prompt: str) -> str:
    """
    Generate text using the Gemini model.
    
    Args:
        prompt: The input prompt for the model
        
    Returns:
        Generated text response
    """
    try:
        print(f"[generate_text] Generating content with model: {MODEL_NAME}")
        print(f"[generate_text] Prompt length: {len(prompt)}")
        
        # Use the correct API: client.models.generate_content() directly with model name
        response = genai_client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )
        
        print(f"[generate_text] Response received, type: {type(response)}")
        
        # The new SDK returns GenerateContentResponse with .text attribute
        if hasattr(response, 'text'):
            result = response.text
            print(f"[generate_text] Using response.text, length: {len(result)}")
            return result
        elif hasattr(response, 'candidates') and response.candidates:
            # Fallback for different response structures
            if hasattr(response.candidates[0], 'content'):
                result = response.candidates[0].content.parts[0].text
                print(f"[generate_text] Using candidates path, length: {len(result)}")
                return result
        elif isinstance(response, str):
            print(f"[generate_text] Response is string, length: {len(response)}")
            return response
        else:
            # Try to convert to string as last resort
            result = str(response)
            print(f"[generate_text] Converted to string, length: {len(result)}")
            return result
    except Exception as e:
        print(f"[generate_text] Error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        raise

# Initialize RAG system
print("Initializing RAG system...")
twitter_df = None
trend_embeddings = None
trend_texts = None
encoder = None

def initialize_rag():
    """Initialize the RAG system with Twitter trends data"""
    global twitter_df, trend_embeddings, trend_texts, encoder
    
    try:
        # Load Twitter data - try Models/twitter_scraper.csv first, then current directory
        csv_path = os.path.join(os.path.dirname(__file__), 'twitter_scraper.csv')
        if not os.path.exists(csv_path):
            csv_path = 'twitter_scraper.csv'
        if not os.path.exists(csv_path):
            csv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'twitter_scraper.csv')
        
        print(f"Loading Twitter data from: {csv_path}")
        if not os.path.exists(csv_path):
            raise FileNotFoundError(f"Twitter CSV file not found. Tried: {csv_path}")
        
        twitter_df = pd.read_csv(csv_path)
        print(f"Loaded {len(twitter_df)} Twitter trends")
        
        # Initialize sentence transformer
        print("Loading sentence transformer model...")
        encoder = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Create embeddings
        print("Creating embeddings for Twitter trends...")
        trend_texts = []
        for _, row in twitter_df.iterrows():
            trend = str(row['Trend']) if pd.notna(row['Trend']) else ""
            count = str(row['Count']) if pd.notna(row['Count']) else "0"
            trend_text = f"Twitter Trend: {trend} | Tweet Count: {count}"
            trend_texts.append(trend_text)
        
        trend_embeddings = encoder.encode(trend_texts, convert_to_tensor=True)
        print("RAG system initialized successfully!")
        
    except Exception as e:
        print(f"Error initializing RAG: {e}")
        twitter_df = None

def retrieve_relevant_trends(query: str, top_k: int = 5):
    """Retrieve top-k most relevant Twitter trends using semantic search"""
    global twitter_df, trend_embeddings, trend_texts, encoder
    
    if twitter_df is None or encoder is None:
        return []
    
    try:
        # Encode the query
        query_embedding = encoder.encode(query, convert_to_tensor=True)
        
        # Calculate cosine similarities
        similarities = cosine_similarity(
            query_embedding.cpu().numpy().reshape(1, -1),
            trend_embeddings.cpu().numpy()
        )[0]
        
        # Get top-k indices
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        
        # Retrieve relevant trends
        relevant_trends = []
        for idx in top_indices:
            trend_info = {
                'trend': twitter_df.iloc[idx]['Trend'],
                'count': twitter_df.iloc[idx]['Count'],
                'similarity': float(similarities[idx])
            }
            relevant_trends.append(trend_info)
        
        return relevant_trends
    except Exception as e:
        print(f"Error retrieving trends: {e}")
        return []

# Initialize RAG on startup
initialize_rag()

@app.route('/generate-hashtags', methods=['POST'])
def generate_hashtags():
    data = request.json
    topic = data.get("prompt", "").strip()

    if not topic or len(topic) < 3:  # Check for empty or too-short input
        topic = "an engaging and trending topic"

    prompt = (
        f"Generate hashtags for the topic/trend: '{topic}'. Ensure the hashtags are prevalent and popular. make sure you only 5 of them and make sure they start with hashtags, dont give any description just the hashtags"
    )

    try:
        response_text = generate_text(prompt)
        
        # Extract hashtags from response
        hashtags = [tag.strip() for tag in response_text.split() if tag.strip().startswith('#')]
        
        # If no hashtags found, try splitting by lines or other delimiters
        if not hashtags:
            hashtags = [tag.strip() for tag in response_text.replace(',', ' ').split() if '#' in tag]
        
        # Ensure we have exactly 5 hashtags or less
        hashtags = hashtags[:5] if len(hashtags) > 5 else hashtags
        
        # If still no hashtags, return empty list (frontend can handle this)
        if not hashtags:
            hashtags = []
        
        return jsonify({"hashtags": hashtags})
    except Exception as e:
        print(f"Error generating hashtags: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/generate-content', methods=['POST'])
def generate_content():
    data = request.json
    topic = data.get("prompt", "").strip()

    if not topic or len(topic) < 3:  # Check for empty or too-short input
        topic = "an engaging and trending topic"

    prompt = (
        f"Generate a professional and detailed content script for social media. The script should focus on the topic: '{topic}'. Ensure the content is creative and suitable for a general audience and dont include hashtags in the generated content."
    )

    try:
        response_text = generate_text(prompt)
        return jsonify({"content": response_text})
    except Exception as e:
        print(f"Error generating content: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/askai', methods=['POST'])
def ask_ai():
    try:
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 400
        
        data = request.json
        if not data:
            return jsonify({"error": "Request body is required"}), 400
        
        additional_prompt = data.get("prompt", "").strip()
        existing_content = data.get("content", "").strip()

        if not additional_prompt:
            return jsonify({"error": "Prompt is required"}), 400
        
        print(f"[askai] Received prompt: {additional_prompt[:100]}...")

        # Style-changing options
        style_map = {
            "Make it funnier": "Rewrite the following content to be much funnier, using jokes, puns, and a lighthearted tone. If possible, add a witty punchline.",
            "Make it sound serious": "Rewrite the following content to sound very serious, formal, and professional.",
            "Make it concise": "Rewrite the following content to be as concise and brief as possible, without losing the main message.",
            "Add a call to action": "Rewrite the following content and add a strong, clear call to action at the end.",
            "Make it more engaging": "Rewrite the following content to be more engaging and interactive, asking questions or encouraging responses.",
            "Use slang and lingo": "Rewrite the following content using modern slang, internet lingo, and a casual, playful tone."
        }

        # Check if it's a style change request
        if additional_prompt in style_map:
            prompt = (
                f"{style_map[additional_prompt]}\n\nContent: '''{existing_content}'''.\nRespond with only the rewritten content."
            )
        else:
            # Use RAG to retrieve relevant trends
            relevant_trends = retrieve_relevant_trends(additional_prompt, top_k=5)
            
            if relevant_trends:
                # Build context from retrieved trends
                context_str = "\n".join([
                    f"- {trend_info['trend']} (Tweet Count: {trend_info['count']})"
                    for trend_info in relevant_trends
                ])
                
                prompt = f"""You are a social media expert analyzing Twitter trends. Based on the following current Twitter trends data:

{context_str}

User Question: {additional_prompt}

Existing Content: '{existing_content}'

Provide a helpful, accurate, and insightful answer based on the Twitter trends data above. If the question relates to the trends, use the specific trend information. If the question is general or not directly related to the trends, provide a generative answer that's relevant and helpful.

Answer:"""
            else:
                # Fallback if RAG not available
                prompt = (
                    f"Based on current Twitter trends, answer the user's question. "
                    f"User Question: {additional_prompt}\n"
                    f"Existing Content: '{existing_content}'\n"
                    f"Provide a helpful and insightful answer."
                )

        try:
            response_text = generate_text(prompt)
            if not response_text or not response_text.strip():
                return jsonify({"error": "Empty response from model"}), 500
            print(f"[askai] Generated response length: {len(response_text)}")
            return jsonify({"content": response_text})
        except Exception as e:
            print(f"[askai] Error generating text: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({"error": str(e), "type": type(e).__name__}), 500
    except Exception as e:
        print(f"[askai] Error in ask_ai endpoint: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e), "type": type(e).__name__}), 500

@app.route('/reload-data', methods=['POST'])
def reload_data():
    """Reload Twitter data and rebuild embeddings"""
    try:
        initialize_rag()
        return jsonify({"message": "Data reloaded successfully", "trends_count": len(twitter_df) if twitter_df is not None else 0})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "rag_initialized": twitter_df is not None,
        "trends_count": len(twitter_df) if twitter_df is not None else 0,
        "model": MODEL_NAME
    })

if __name__ == '__main__':
    # Run on port 5001 so it matches the frontend/backends that call GEMINI_URL/http://localhost:5001
    print(f"\n{'='*60}")
    print(f"Starting Gemini RAG Service on port 5001")
    print(f"Model: {MODEL_NAME}")
    print(f"RAG System: {'Initialized' if twitter_df is not None else 'Not initialized'}")
    print(f"{'='*60}\n")
    app.run(debug=True, host='0.0.0.0', port=5001)
