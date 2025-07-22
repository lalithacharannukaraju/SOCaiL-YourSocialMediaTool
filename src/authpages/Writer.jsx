import React, { useState } from "react";

function ContentWriterPage() {
  const [content, setContent] = useState(""); // Holds the generated content
  const [hashtags, setHashtags] = useState([]); // Holds the generated hashtags
  const [prompt, setPrompt] = useState(""); // Holds the main input prompt
  const [askAIPrompt, setAskAIPrompt] = useState("Generate more examples"); // Default state for Ask AI dropdown
  const [loading, setLoading] = useState(false); // Tracks loading state

  const askAIOptions = [
    "Make it funnier",
    "Make it sound serious",
    "Make it concise",
    "Add a call to action",
    "Make it more engaging",
    "Use slang and lingo"
  ];

  const GEMINI_URL = import.meta.env.VITE_GEMINI_URL || 'http://localhost:5001';

  // Function to send the initial input and fetch content
  const handleSubmit = async () => {
    setLoading(true); // Start loading
    try {
      console.log("Submitting prompt:", prompt); // Debug log
      const response = await fetch(`${GEMINI_URL}/generate-content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      console.log("Received data:", data); // Debug log
      setContent(data.content); // Update the editor with the generated content
      const hashtagsResponse = await fetch(`${GEMINI_URL}/generate-hashtags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const hashtagsData = await hashtagsResponse.json();
      setHashtags(hashtagsData.hashtags || []); // Update the generated tags
    } catch (error) {
      console.error("Error fetching generated content:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Function to modify the content based on "Ask AI"
  const handleAskAI = async () => {
    setLoading(true); // Start loading
    try {
      console.log("Ask AI prompt:", askAIPrompt); // Debug log
      console.log("Current content:", content); // Debug log
      const response = await fetch(`${GEMINI_URL}/askai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: askAIPrompt,
          content 
        }),
      });
      const data = await response.json();
      console.log("Received AI response:", data); // Debug log
      setContent(data.content); // Update the editor with modified content
    } catch (error) {
      console.error("Error modifying content:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">Content Writer</h1>
      </header>

      {/* Main Content */}
      <main className="flex flex-grow">
        {/* Editor Section */}
        <div className="flex-grow bg-white shadow-lg m-4 rounded-lg p-6">
          {/* Input Section */}
          <div className="w-full mb-6 flex items-center">
            <input
              id="main-input"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your trend here..."
              className="flex-grow border border-gray-300 rounded p-4 my-5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSubmit}
              className="ml-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              disabled={loading} // Disable button when loading
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </div>

          {/* Loading Animation */}
          {loading && (
            <div className="w-full text-center my-4">
              <div className="spinner border-t-4 border-purple-500 border-solid rounded-full w-8 h-8 animate-spin"></div>
            </div>
          )}

          <textarea
            className="w-full h-80 border border-gray-300 rounded p-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={content}
            readOnly
            placeholder="Your content will appear here..."
          ></textarea>
        </div>

        {/* Sidebar */}
        <aside className="w-1/4 bg-gray-50 shadow-lg m-4 rounded-lg p-6">
          {/* Floating Menu */}
          <div className="mb-6">
            <div className="w-full flex items-center text-white space-x-2">
              <select
                value={askAIPrompt}
                onChange={(e) => setAskAIPrompt(e.target.value)}
                className="w-54 px-6 py-4 my-6 rounded text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {askAIOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAskAI}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                disabled={loading} // Disable button when loading
              >
                {loading ? "Loading..." : "Ask AI"}
              </button>
            </div>
          </div>

          {/* Generated Tags */}
          <div>
            <h2 className="font-bold text-lg mb-2">Generated Tags</h2>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-purple-200 text-purple-700 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow p-4 text-center">
        <p>&copy; 2024 AI Content Writer. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default ContentWriterPage;
