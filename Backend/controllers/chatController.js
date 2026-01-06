/* eslint-disable no-undef */
import axios from "axios";
import { Chat } from "../models/Chat.js";

export const processQuery = async (req, res) => {
  const { query } = req.body;

  if (!query || !query.trim()) {
    return res.status(400).json({
      message: "Query is required",
      error: "Empty query provided"
    });
  }

  try {
    console.log(`[ChatController] Processing query: ${query.substring(0, 50)}...`);
    
    // Call Gemini RAG service
    const response = await axios.post(
      "http://localhost:5001/askai",
      { prompt: query },
      {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`[ChatController] Gemini response status: ${response.status}`);
    
    let chatResponse = response.data.content || response.data.error || "No response from Gemini.";
    
    if (!chatResponse || chatResponse.trim() === "") {
      chatResponse = "I'm sorry, I couldn't generate a response. Please try again.";
    }
    
    // Save to MongoDB
    try {
      const chatLog = new Chat({
        userId: req.user.userId,
        query,
        response: chatResponse,
        timestamp: new Date(),
      });
      await chatLog.save();
      console.log(`[ChatController] Chat saved to MongoDB for user: ${req.user.userId}`);
    } catch (dbError) {
      console.error("[ChatController] Error saving to MongoDB:", dbError);
      // Continue even if DB save fails - still return the response
    }

    res.json({
      response: chatResponse
    });
  } catch (error) {
    console.error("[ChatController] Error in processQuery:", error);
    
    // Check if it's a connection error
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.error("[ChatController] Cannot connect to Gemini service on port 5001");
      return res.status(503).json({
        message: "AI service is unavailable",
        error: "Cannot connect to Gemini service. Please ensure the Gemini service is running on port 5001.",
        details: error.message
      });
    }
    
    // Check if it's an axios error with response
    if (error.response) {
      console.error("[ChatController] Gemini service error response:", error.response.status, error.response.data);
      return res.status(500).json({
        message: "Error from AI service",
        error: error.response.data?.error || error.message,
        details: `Gemini service returned ${error.response.status}`
      });
    }
    
    // Generic error
    res.status(500).json({
      message: "Error processing query",
      error: error.message || "Unknown error occurred",
      details: error.stack
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const chatHistory = await Chat.find({ userId: req.user.userId }).sort({
      timestamp: 1,
    });
    res.json(chatHistory);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({
      message: "Error fetching chat history",
      error: error.message,
    });
  }
};
