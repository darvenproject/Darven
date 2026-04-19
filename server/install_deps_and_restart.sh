#!/bin/bash

echo "=== Installing Missing Dependencies and Restarting Server ==="
echo ""

# Navigate to server directory
cd /var/www/darven/server

# Activate virtual environment
echo "1. Activating virtual environment..."
source venv/bin/activate

# Install missing dependency
echo "2. Installing email-validator..."
pip install email-validator

echo "3. Installing pydantic[email]..."
pip install 'pydantic[email]'

# Start the server
echo "4. Starting server..."
nohup uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4 > server.log 2>&1 &

# Wait for server to start
echo "5. Waiting for server to start..."
sleep 5

# Check if server is running
echo "6. Testing server..."
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✓ Server is running successfully!"
    echo ""
    echo "Server details:"
    curl http://localhost:8000/health
    echo ""
    echo ""
    echo "To view logs: tail -f /var/www/darven/server/server.log"
else
    echo "✗ Server failed to start. Checking logs..."
    echo ""
    tail -30 server.log
    exit 1
fi
