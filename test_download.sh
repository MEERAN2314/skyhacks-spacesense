#!/bin/bash

echo "🧪 Testing SpaceSense Pro Download Endpoints"
echo "============================================"
echo ""

# Test 1: Health check
echo "1️⃣ Testing health endpoint..."
curl -s http://localhost:8000/health | python3 -m json.tool
echo ""

# Test 2: Export data endpoint
echo "2️⃣ Testing export data endpoint..."
curl -s "http://localhost:8000/api/export/data?format=json" | python3 -m json.tool | head -20
echo ""

# Test 3: Download JSON
echo "3️⃣ Testing JSON download endpoint..."
curl -I http://localhost:8000/api/export/download/json 2>&1 | grep -E "(HTTP|Content-Type|Content-Disposition)"
echo ""

# Test 4: Download CSV
echo "4️⃣ Testing CSV download endpoint..."
curl -I http://localhost:8000/api/export/download/csv 2>&1 | grep -E "(HTTP|Content-Type|Content-Disposition)"
echo ""

# Test 5: Actually download a file
echo "5️⃣ Downloading sample JSON file..."
curl -s -o test-download.json http://localhost:8000/api/export/download/json
if [ -f test-download.json ]; then
    SIZE=$(wc -c < test-download.json)
    echo "✅ File downloaded successfully! Size: $SIZE bytes"
    echo "First few lines:"
    head -5 test-download.json
    rm test-download.json
else
    echo "❌ Download failed"
fi
echo ""

echo "============================================"
echo "✅ Tests complete!"
echo ""
echo "If all tests passed, your download endpoints are working."
echo "Now test in the browser by clicking Export button."
