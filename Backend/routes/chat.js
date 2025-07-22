import express from "express";
import { processQuery, getChatHistory } from "../controllers/chatController.js";
import { authenticateToken } from "../middleware/auth.js";
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.post("/query", authenticateToken, processQuery);
router.get("/chat-history", authenticateToken, getChatHistory);
// Twitter Trends Endpoint
router.get('/twitter-trends', (req, res) => {
  const results = [];
  const filePath = path.join(__dirname, '../../twitter_scraper.csv');
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json(results);
    })
    .on('error', (err) => {
      res.status(500).json({ error: 'Failed to read CSV', details: err.message });
    });
});

// Instagram Trends Endpoint
router.get('/instagram-trends', (req, res) => {
  const results = [];
  const filePath = path.join(__dirname, '../../Models/instagram_trending_songs.csv');
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json(results);
    })
    .on('error', (err) => {
      res.status(500).json({ error: 'Failed to read CSV', details: err.message });
    });
});

// TikTok Trends Endpoint
router.get('/tiktok-trends', (req, res) => {
  const filePath = path.join(__dirname, '../../public/tiktokdata_trimmed.json');
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read JSON', details: err.message });
  }
});

export default router;
