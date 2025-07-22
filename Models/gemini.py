from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import os
import pandas as pd

# Path to the .env file in the Backend directory
backend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'Backend')
env_path = os.path.join(backend_dir, '.env')
print("Looking for .env at:", env_path)
print("File exists:", os.path.exists(env_path))
if os.path.exists(env_path):
    with open(env_path) as f:
        print("File contents:\n", f.read())

load_dotenv(dotenv_path=env_path)

gemini_api_key = os.getenv("GEMINI_API_KEY")
print("Loaded GEMINI_API_KEY:", repr(gemini_api_key))  # Debug print
if not gemini_api_key:
    print("ERROR: GEMINI_API_KEY is not set or not loaded from .env! Check your .env file in the Backend directory.")
    exit(1)

genai.configure(api_key=gemini_api_key)

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests


def load_all_csv_context():
    context = []
    csv_files = [
        'twitter_scraper.csv',
        'Models/instagram_trending_songs.csv',
        'Models/latest_insta_trends.csv',
        'Models/archived_insta_trends.csv',
    ]
    for file in csv_files:
        try:
            df = pd.read_csv(file)
            context.append(f"Data from {file}:")
            context.append(df.to_string(index=False))
        except Exception as e:
            context.append(f"Could not load {file}: {e}")
    return '\n\n'.join(context)

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
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return jsonify({"hashtags": response.text.split()})  # Split response into a list of hashtags
    except Exception as e:
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
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return jsonify({"content": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/askai', methods=['POST'])
def ask_ai():
    data = request.json
    additional_prompt = data.get("prompt", "").strip()
    existing_content = data.get("content", "").strip()

    if not additional_prompt:
        return jsonify({"error": "Prompt is required"}), 400

    # Style-changing options
    style_map = {
        "Make it funnier": "Rewrite the following content to be much funnier, using jokes, puns, and a lighthearted tone. If possible, add a witty punchline.",
        "Make it sound serious": "Rewrite the following content to sound very serious, formal, and professional.",
        "Make it concise": "Rewrite the following content to be as concise and brief as possible, without losing the main message.",
        "Add a call to action": "Rewrite the following content and add a strong, clear call to action at the end.",
        "Make it more engaging": "Rewrite the following content to be more engaging and interactive, asking questions or encouraging responses.",
        "Use slang and lingo": "Rewrite the following content using modern slang, internet lingo, and a casual, playful tone."
    }

    # Load latest CSV context
    csv_context = load_all_csv_context()

    if additional_prompt in style_map:
        prompt = (
            f"{style_map[additional_prompt]}\n\nContent: '''{existing_content}'''.\nRespond with only the rewritten content."
        )
    else:
        prompt = (
            f"Based on the following scraped data (from Twitter, Instagram, etc.), answer the user's question. "
            f"Scraped Data:\n{csv_context}\n\n"
            f"Existing Content: '{existing_content}'\n"
            f"User Question: {additional_prompt}"
        )

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return jsonify({"content": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
