import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const GRATITUDE_PATTERNS = [/^thanks?\b/i, /^thank you\b/i, /^ok\b/i, /^cool\b/i, /^nice\b/i, /^great\b/i, /^awesome\b/i, /^got it\b/i];

function isGratitudeMessage(msg) {
  return GRATITUDE_PATTERNS.some((re) => re.test(msg.trim()));
}

function decorateBotMessage(text) {
  // Add stars and sparkles for gratitude and positive feedback
  if (/thank|welcome|great|awesome|congrats|success|done|nice|cool|amazing|perfect|good job|well done/i.test(text)) {
    return `✨🌟 ${text} 🌟✨`;
  }
  return text;
}

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const response = await axios.get(`${BACKEND_URL}/chat-history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const chatHistory = response.data
          .map((chat) => [
            { text: chat.query, sender: "user" },
            { text: chat.response, sender: "bot" },
          ])
          .flat();

        setMessages(chatHistory);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, []);

  const handleSendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((msgs) => [...msgs, { sender: "user", text: trimmed }]);
    setInput("");

    if (isGratitudeMessage(trimmed)) {
      setMessages((msgs) => [...msgs, { sender: "bot", text: "You're welcome! 😊" }]);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await axios.post(
        `${BACKEND_URL}/query`,
        { query: trimmed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((msgs) => [...msgs, { sender: "bot", text: res.data.response }]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { sender: "bot", text: "Sorry, something went wrong. Please try again." }]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50 p-0">
      <div className="w-full max-w-4xl flex flex-col gap-2 bg-white rounded-3xl shadow-2xl border border-blue-100 p-10 h-[85vh] justify-between">
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto mb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={
                msg.sender === "user"
                  ? "self-end bg-blue-500 text-white rounded-2xl px-4 py-2 mb-2 max-w-[70%] shadow-md animate-fade-in"
                  : "self-start bg-gradient-to-r from-yellow-200 via-pink-200 to-blue-200 text-gray-900 rounded-2xl px-4 py-2 mb-2 max-w-[70%] shadow-md animate-fade-in border border-yellow-300"
              }
              style={{ wordBreak: "break-word", fontSize: "1.1rem" }}
            >
              {msg.sender === "bot" ? decorateBotMessage(msg.text) : msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex mt-2">
          <input
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-r-lg font-semibold text-lg transition-colors"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
