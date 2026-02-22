#!/bin/bash

echo "=== Checking Darven Backend Server Status ==="
echo ""

# Check if server is running
echo "1. Checking for running Python processes..."
ps aux | grep "python.*main:app" | grep -v grep

echo ""
echo "2. Testing server endpoint..."
curl -I http://localhost:8000/health 2>&1

echo ""
echo "3. Checking server logs (last 20 lines)..."
if [ -f "server.log" ]; then
    tail -20 server.log
else
    echo "No server.log found"
fi

echo ""
echo "=== To restart the server, run one of these commands: ==="
echo ""
echo "If using systemd service:"
echo "  sudo systemctl restart darven-backend"
echo "  sudo systemctl status darven-backend"
echo ""
echo "If using screen:"
echo "  screen -ls  # List screens"
echo "  screen -r <session_name>  # Attach to session"
echo "  # Then Ctrl+C and run: source ../.venv/bin/activate && python run.py"
echo ""
echo "If using PM2:"
echo "  pm2 restart darven-backend"
echo "  pm2 logs darven-backend"
echo ""
echo "If running manually:"
echo "  source ../.venv/bin/activate"
echo "  python run.py > server.log 2>&1 &"
echo ""
