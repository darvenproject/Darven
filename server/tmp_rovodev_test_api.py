"""
Quick API Test Script
Tests the /fabrics endpoint locally and remotely
"""

import requests
import json

print("=" * 60)
print("API Endpoint Testing")
print("=" * 60)
print()

# Test 1: Local server (if running)
print("1. Testing local server (http://localhost:8000/fabrics)...")
try:
    response = requests.get("http://localhost:8000/fabrics", timeout=5)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✓ Success! Found {len(data)} fabrics")
    else:
        print(f"   ✗ Error: {response.status_code}")
        print(f"   Response: {response.text[:200]}")
except requests.exceptions.ConnectionError:
    print("   ⚠ Local server not running or not accessible")
except Exception as e:
    print(f"   ✗ Error: {e}")

print()

# Test 2: Production server
print("2. Testing production server (https://api.shopdarven.pk/fabrics)...")
try:
    response = requests.get("https://api.shopdarven.pk/fabrics", timeout=10)
    print(f"   Status: {response.status_code}")
    print(f"   Headers: {dict(response.headers)}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"   ✓ Success! Found {len(data)} fabrics")
        
        # Check CORS headers
        if 'access-control-allow-origin' in response.headers:
            print(f"   ✓ CORS header present: {response.headers['access-control-allow-origin']}")
        else:
            print("   ✗ No CORS headers in response!")
    else:
        print(f"   ✗ Error: {response.status_code}")
        print(f"   Response: {response.text[:500]}")
except Exception as e:
    print(f"   ✗ Error: {e}")

print()

# Test 3: Production server with Origin header
print("3. Testing with Origin header (simulating browser request)...")
try:
    headers = {
        "Origin": "https://shopdarven.pk",
        "User-Agent": "Mozilla/5.0 (Test Script)"
    }
    response = requests.get("https://api.shopdarven.pk/fabrics", headers=headers, timeout=10)
    print(f"   Status: {response.status_code}")
    
    # Check CORS headers
    cors_origin = response.headers.get('access-control-allow-origin')
    cors_creds = response.headers.get('access-control-allow-credentials')
    
    print(f"   Access-Control-Allow-Origin: {cors_origin or 'NOT SET'}")
    print(f"   Access-Control-Allow-Credentials: {cors_creds or 'NOT SET'}")
    
    if cors_origin:
        print("   ✓ CORS headers are present!")
    else:
        print("   ✗ CORS headers are missing!")
    
    if response.status_code == 200:
        data = response.json()
        print(f"   ✓ Data received: {len(data)} fabrics")
    else:
        print(f"   ✗ Error: {response.status_code}")
        print(f"   Response: {response.text[:500]}")
        
except Exception as e:
    print(f"   ✗ Error: {e}")

print()

# Test 4: OPTIONS request (CORS preflight)
print("4. Testing OPTIONS request (CORS preflight)...")
try:
    headers = {
        "Origin": "https://shopdarven.pk",
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "content-type"
    }
    response = requests.options("https://api.shopdarven.pk/fabrics", headers=headers, timeout=10)
    print(f"   Status: {response.status_code}")
    
    cors_origin = response.headers.get('access-control-allow-origin')
    cors_methods = response.headers.get('access-control-allow-methods')
    cors_headers = response.headers.get('access-control-allow-headers')
    
    print(f"   Access-Control-Allow-Origin: {cors_origin or 'NOT SET'}")
    print(f"   Access-Control-Allow-Methods: {cors_methods or 'NOT SET'}")
    print(f"   Access-Control-Allow-Headers: {cors_headers or 'NOT SET'}")
    
    if cors_origin and cors_methods:
        print("   ✓ CORS preflight working!")
    else:
        print("   ✗ CORS preflight not configured properly!")
        
except Exception as e:
    print(f"   ✗ Error: {e}")

print()
print("=" * 60)
print("Testing complete!")
print("=" * 60)
