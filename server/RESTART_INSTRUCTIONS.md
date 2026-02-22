# Backend Server Restart Instructions

## Quick Fix (Run this now)

On your Hetzner VPS, run these commands:

```bash
cd /var/www/darven/server
chmod +x fix_and_restart.sh
sudo ./fix_and_restart.sh
```

This will:
1. Kill all processes using port 8000
2. Stop all uvicorn/python server processes
3. Verify port 8000 is free
4. Start the server with 4 workers
5. Test if it's running properly

## After Restart

1. **Check if server is running:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **View live logs:**
   ```bash
   tail -f /var/www/darven/server/server.log
   ```

3. **Test from browser:**
   - https://api.shopdarven.pk/health
   - https://api.shopdarven.pk/docs

4. **Try portrait upload again:**
   - Go to https://shopdarven.pk/admin/landing
   - Login if needed
   - Upload a portrait image

## If Still Having Issues

Check what's using port 8000:
```bash
sudo lsof -i:8000
```

Check running processes:
```bash
ps aux | grep uvicorn
```

Kill specific process:
```bash
sudo kill -9 <PID>
```

## Manual Restart (if script doesn't work)

```bash
# Stop everything
sudo pkill -9 -f "uvicorn main:app"
sudo lsof -ti:8000 | xargs -r sudo kill -9

# Start fresh
cd /var/www/darven/server
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4 > server.log 2>&1 &
```
