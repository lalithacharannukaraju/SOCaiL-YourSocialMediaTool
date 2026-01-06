# SOCaiL - Complete Setup & Run Guide

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** (v16 or higher) installed
- **Python 3** (v3.8 or higher) installed
- **MongoDB** database (local or Atlas)
- **Gemini API Key** from Google AI Studio
- **Git** (optional, for cloning)

---

## 🚀 Step-by-Step Setup Instructions

### **Step 1: Environment Variables Setup**

Create a `.env` file in the `Backend` directory with the following variables:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/socail
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER_URL>/<DATABASE_NAME>

# JWT Secret Key (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_this

# Gemini API Key (get from https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port (optional, defaults to 5000)
PORT=5000
```

**How to get Gemini API Key:**
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in your `.env` file

---

### **Step 2: Install Backend Dependencies**

Open a terminal in the project root and run:

```bash
cd Backend
npm install
```

This will install all required Node.js packages for the backend.

---

### **Step 3: Install Frontend Dependencies**

Open a **new terminal** in the project root and run:

```bash
npm install
```

This will install all required packages for the React frontend.

---

### **Step 4: Install Python Dependencies**

Open a **new terminal** and run:

```bash
pip install flask flask-cors google-genai python-dotenv pandas beautifulsoup4 requests
```

Or if you're using `pip3`:

```bash
pip3 install flask flask-cors google-genai python-dotenv pandas beautifulsoup4 requests
```

---

### **Step 5: Start MongoDB**

**Option A: Local MongoDB**
- Make sure MongoDB is installed and running
- Start MongoDB service:
  - **Windows**: MongoDB should start automatically, or run `net start MongoDB`
  - **Mac/Linux**: `sudo systemctl start mongod` or `brew services start mongodb-community`

**Option B: MongoDB Atlas (Cloud)**
- No local setup needed, just use your Atlas connection string in `.env`

---

### **Step 6: Start Twitter Scraper (Optional but Recommended)**

Open a **new terminal** and run:

```bash
cd Models
python twitter_scraper.py
```

This will:
- Scrape Twitter trends every hour
- Save data to `twitter_scraper.csv`
- Run continuously until you stop it (Ctrl+C)

**Note:** Let this run in the background. It will update your trends data automatically.

---

### **Step 7: Start Gemini API Server**

Open a **new terminal** and run:

```bash
cd Models
python gemini.py
```

This will:
- Start the Flask server on port 5001
- Provide API endpoints for content generation
- Keep running until you stop it (Ctrl+C)

**Expected output:**
```
✅ Gemini API configured successfully!
 * Running on http://0.0.0.0:5001
```

---

### **Step 8: Start Backend Server**

Open a **new terminal** and run:

```bash
cd Backend
npm run dev
```

This will:
- Connect to MongoDB
- Start Express server on port 5000
- Enable API endpoints for authentication and chat

**Expected output:**
```
MongoDB connected
Server is running on port 5000
```

---

### **Step 9: Start Frontend Development Server**

Open a **new terminal** and run:

```bash
npm run dev
```

This will:
- Start Vite dev server on port 5173
- Open your browser automatically (or go to http://localhost:5173)

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🎯 Quick Start (All Commands)

If you want to start everything quickly, here's the order:

### **Terminal 1: Twitter Scraper**
```bash
cd Models
python twitter_scraper.py
```

### **Terminal 2: Gemini API Server**
```bash
cd Models
python gemini.py
```

### **Terminal 3: Backend Server**
```bash
cd Backend
npm run dev
```

### **Terminal 4: Frontend Server**
```bash
npm run dev
```

---

## ✅ Verification Checklist

After starting all services, verify:

- [ ] MongoDB is running and connected
- [ ] Backend server is running on http://localhost:5000
- [ ] Gemini API server is running on http://localhost:5001
- [ ] Frontend is running on http://localhost:5173
- [ ] Twitter scraper is running and updating `twitter_scraper.csv`

---

## 🌐 Access the Application

1. Open your browser
2. Navigate to: **http://localhost:5173**
3. You should see the SOCaiL homepage
4. Register/Login to access features

---

## 🔧 Troubleshooting

### **Backend won't start:**
- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Check if port 5000 is already in use

### **Frontend won't connect to backend:**
- Verify backend is running on port 5000
- Check browser console for CORS errors
- Ensure `VITE_BACKEND_URL` in frontend matches backend URL

### **Gemini API errors:**
- Verify `GEMINI_API_KEY` is correct in Backend/.env
- Check if API key has proper permissions
- Ensure Python dependencies are installed

### **Twitter scraper not working:**
- Check internet connection
- Verify Python dependencies are installed
- Check if `twitter_scraper.csv` is being created

### **Port already in use:**
- Change PORT in `.env` for backend
- Or kill the process using the port:
  - **Windows**: `netstat -ano | findstr :5000` then `taskkill /PID <pid> /F`
  - **Mac/Linux**: `lsof -ti:5000 | xargs kill`

---

## 📝 Notes

- The Twitter scraper runs continuously and updates data every hour
- You can stop any service with `Ctrl+C`
- Keep all terminals open while using the application
- For production, use process managers like PM2 for Node.js services

---

## 🎉 You're All Set!

Your SOCaiL application should now be running. Enjoy exploring Twitter trends and creating content!
