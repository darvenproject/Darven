#!/bin/bash

echo "=== Fixing and Restarting Darven Backend Server ==="
echo ""

# Kill all processes on port 8000
echo "1. Killing all processes using port 8000..."
sudo lsof -ti:8000 | xargs -r sudo kill -9
sleep 2

# Kill any remaining uvicorn/python processes related to the server
echo "2. Stopping all uvicorn processes..."
sudo pkill -9 -f "uvicorn main:app"
sudo pkill -9 -f "python.*run.py"
sleep 2

# Verify port is free
echo "3. Checking if port 8000 is free..."
if sudo lsof -i:8000; then
    echo "ERROR: Port 8000 is still in use!"
    exit 1
else
    echo "✓ Port 8000 is free"
fi

# Navigate to server directory
cd /var/www/darven/server

# Activate virtual environment
echo "4. Activating virtual environment..."
source venv/bin/activate

# Start the server
echo "5. Starting server..."
nohup uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4 > server.log 2>&1 &

# Wait for server to start
echo "6. Waiting for server to start..."
sleep 5

# Check if server is running
echo "7. Testing server..."
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✓ Server is running successfully!"
    echo ""
    echo "Server details:"
    curl http://localhost:8000/health
    echo ""
    echo ""
    echo "Server logs: tail -f /var/www/darven/server/server.log"
else
    echo "✗ Server failed to start. Checking logs..."
    echo ""
    tail -30 server.log
    exit 1
fi
