# 🚀 Quick Start Guide

## Prerequisites Check
- [ ] Node.js installed (`node --version`)
- [ ] Python 3 installed (`python --version`)
- [ ] MongoDB running (local or Atlas)
- [ ] Gemini API Key ready

## ⚡ Fastest Way to Start (Windows)

1. **Create Backend/.env file** with:
```env
MONGODB_URI=mongodb://localhost:27017/socail
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

2. **Run the start script:**
```powershell
.\start-all.ps1
```

That's it! The script will:
- Install dependencies if needed
- Start Twitter scraper
- Start Gemini API server
- Start Backend server
- Start Frontend server

## 📝 Manual Start (Step by Step)

### Terminal 1: Twitter Scraper
```bash
cd Models
python twitter_scraper.py
```

### Terminal 2: Gemini API
```bash
cd Models
python gemini.py
```

### Terminal 3: Backend
```bash
cd Backend
npm install  # First time only
npm run dev
```

### Terminal 4: Frontend
```bash
npm install  # First time only
npm run dev
```

## 🌐 Access
Open browser: **http://localhost:5173**

## ⚠️ Common Issues

**Port already in use?**
- Change PORT in Backend/.env
- Or kill process: `netstat -ano | findstr :5000`

**MongoDB not connecting?**
- Check if MongoDB is running
- Verify MONGODB_URI in .env

**Missing dependencies?**
- Backend: `cd Backend && npm install`
- Frontend: `npm install`
- Python: `pip install flask flask-cors google-genai python-dotenv pandas beautifulsoup4 requests`

## 📚 Full Guide
See `SETUP_GUIDE.md` for detailed instructions.
