#!/bin/bash
# SOCaiL - Start All Services Script (Bash/Linux/Mac)
# This script starts all required services for the application

echo "========================================"
echo "  SOCaiL - Starting All Services"
echo "========================================"
echo ""

# Check if .env exists
if [ ! -f "Backend/.env" ]; then
    echo "⚠️  WARNING: Backend/.env file not found!"
    echo "Please create Backend/.env file with required environment variables."
    echo "See SETUP_GUIDE.md for details."
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if node_modules exist
if [ ! -d "Backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd Backend
    npm install
    cd ..
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo ""
echo "🚀 Starting services..."
echo ""

# Get the current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Start Twitter Scraper (in new terminal)
echo "1️⃣  Starting Twitter Scraper..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    osascript -e "tell app \"Terminal\" to do script \"cd '$SCRIPT_DIR/Models' && python3 twitter_scraper.py\""
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    gnome-terminal -- bash -c "cd '$SCRIPT_DIR/Models' && python3 twitter_scraper.py; exec bash" 2>/dev/null || \
    xterm -e "cd '$SCRIPT_DIR/Models' && python3 twitter_scraper.py" 2>/dev/null || \
    x-terminal-emulator -e "cd '$SCRIPT_DIR/Models' && python3 twitter_scraper.py" 2>/dev/null || \
    echo "Please run manually: cd Models && python3 twitter_scraper.py"
fi

sleep 2

# Start Gemini API Server (in new terminal)
echo "2️⃣  Starting Gemini API Server..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    osascript -e "tell app \"Terminal\" to do script \"cd '$SCRIPT_DIR/Models' && python3 gemini.py\""
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    gnome-terminal -- bash -c "cd '$SCRIPT_DIR/Models' && python3 gemini.py; exec bash" 2>/dev/null || \
    xterm -e "cd '$SCRIPT_DIR/Models' && python3 gemini.py" 2>/dev/null || \
    x-terminal-emulator -e "cd '$SCRIPT_DIR/Models' && python3 gemini.py" 2>/dev/null || \
    echo "Please run manually: cd Models && python3 gemini.py"
fi

sleep 2

# Start Backend Server (in new terminal)
echo "3️⃣  Starting Backend Server..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    osascript -e "tell app \"Terminal\" to do script \"cd '$SCRIPT_DIR/Backend' && npm run dev\""
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    gnome-terminal -- bash -c "cd '$SCRIPT_DIR/Backend' && npm run dev; exec bash" 2>/dev/null || \
    xterm -e "cd '$SCRIPT_DIR/Backend' && npm run dev" 2>/dev/null || \
    x-terminal-emulator -e "cd '$SCRIPT_DIR/Backend' && npm run dev" 2>/dev/null || \
    echo "Please run manually: cd Backend && npm run dev"
fi

sleep 3

# Start Frontend Server (in new terminal)
echo "4️⃣  Starting Frontend Server..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    osascript -e "tell app \"Terminal\" to do script \"cd '$SCRIPT_DIR' && npm run dev\""
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    gnome-terminal -- bash -c "cd '$SCRIPT_DIR' && npm run dev; exec bash" 2>/dev/null || \
    xterm -e "cd '$SCRIPT_DIR' && npm run dev" 2>/dev/null || \
    x-terminal-emulator -e "cd '$SCRIPT_DIR' && npm run dev" 2>/dev/null || \
    echo "Please run manually: npm run dev"
fi

echo ""
echo "✅ All services started!"
echo ""
echo "Services running:"
echo "  • Twitter Scraper: Running in background (updates every hour)"
echo "  • Gemini API: http://localhost:5001"
echo "  • Backend API: http://localhost:5000"
echo "  • Frontend: http://localhost:5173"
echo ""
echo "🌐 Open your browser and go to: http://localhost:5173"
echo ""
