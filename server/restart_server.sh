#!/bin/bash

echo "=== Restarting Darven Backend Server ==="
echo ""

# Kill existing Python processes running the server
echo "Stopping existing server processes..."
pkill -f "python.*run.py" || echo "No existing process found"
pkill -f "uvicorn.*main:app" || echo "No uvicorn process found"

sleep 2

# Activate virtual environment and start server
echo "Starting server..."
cd "$(dirname "$0")"

# Check if virtual environment exists
if [ -d "../.venv" ]; then
    source ../.venv/bin/activate
elif [ -d ".venv" ]; then
    source .venv/bin/activate
else
    echo "ERROR: Virtual environment not found!"
    exit 1
fi

# Start the server in the background
nohup python run.py > server.log 2>&1 &

SERVER_PID=$!
echo "Server started with PID: $SERVER_PID"

# Wait a moment for server to start
sleep 3

# Check if server is running
if ps -p $SERVER_PID > /dev/null; then
    echo "✓ Server is running!"
    echo ""
    echo "Testing health endpoint..."
    curl http://localhost:8000/health
    echo ""
    echo ""
    echo "To view logs: tail -f server/server.log"
else
    echo "✗ Server failed to start. Check server.log for errors:"
    tail -20 server.log
    exit 1
fi
