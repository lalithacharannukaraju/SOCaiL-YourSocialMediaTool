SOCaiL - YourSocialMediaTool

============================
How to Run This Application
============================

1. Backend Setup
----------------
- Open a terminal and navigate to the Backend directory:

    cd Backend

- Install backend dependencies:

    npm install

- Create a .env file in the Backend directory with your environment variables (e.g., MONGODB_URI, GEMINI_API_KEY, etc.).

- Start the backend server:

    npm run dev

  (The backend will run on http://localhost:5000 by default)


2. Frontend Setup
-----------------
- Open a new terminal and navigate to the project root (where package.json is located):

    cd <project-root>

- Install frontend dependencies:

    npm install

- Start the frontend development server:

    npm run dev

  (The frontend will run on http://localhost:5173 by default)


3. Access the Application
-------------------------
- Open your browser and go to:

    http://localhost:5173

- The frontend will communicate with the backend at http://localhost:5000


4. Python Models & Scrapers
--------------------------------------
- If you want to run the Gemini model or scrapers, run the relevant Python scripts in the Models directory (e.g., gemini.py, scrape.py) using Python 3.

- Go to /Backend/Models/ and execute 'python gemini.py' for model and 'python scrape.py' for scrapper

============================
