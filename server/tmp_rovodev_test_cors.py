"""
Quick test script to verify CORS configuration
Run this to check if CORS headers are properly set
"""

import requests

# Test production API
print("=" * 60)
print("Testing CORS Configuration")
print("=" * 60)
print()

api_url = "https://api.shopdarven.pk/fabrics"
origin = "https://shopdarven.pk"

print(f"Testing: {api_url}")
print(f"Origin: {origin}")
print()

# Test OPTIONS (preflight) request
print("1. Testing OPTIONS (preflight) request...")
try:
    response = requests.options(
        api_url,
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "content-type"
        }
    )
    print(f"   Status: {response.status_code}")
    print(f"   Access-Control-Allow-Origin: {response.headers.get('Access-Control-Allow-Origin', 'NOT SET')}")
    print(f"   Access-Control-Allow-Methods: {response.headers.get('Access-Control-Allow-Methods', 'NOT SET')}")
    print(f"   Access-Control-Allow-Credentials: {response.headers.get('Access-Control-Allow-Credentials', 'NOT SET')}")
except Exception as e:
    print(f"   ERROR: {e}")

print()

# Test GET request
print("2. Testing GET request...")
try:
    response = requests.get(
        api_url,
        headers={"Origin": origin}
    )
    print(f"   Status: {response.status_code}")
    print(f"   Access-Control-Allow-Origin: {response.headers.get('Access-Control-Allow-Origin', 'NOT SET')}")
    print(f"   Access-Control-Allow-Credentials: {response.headers.get('Access-Control-Allow-Credentials', 'NOT SET')}")
    if response.status_code == 200:
        print(f"   Data received: {len(response.json())} items")
except Exception as e:
    print(f"   ERROR: {e}")

print()
print("=" * 60)
print("If CORS headers are 'NOT SET', the server needs to be restarted")
print("=" * 60)
