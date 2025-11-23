#!/bin/bash

echo "🔄 SpaceSense Pro - Restart and Test"
echo "===================================="
echo ""

# Kill any existing server
echo "1️⃣ Stopping any running servers..."
pkill -f "uvicorn main:app" 2>/dev/null
pkill -f "python3 main.py" 2>/dev/null
sleep 2
echo "✅ Servers stopped"
echo ""

# Start server in background
echo "2️⃣ Starting server..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload > server.log 2>&1 &
SERVER_PID=$!
echo "✅ Server started (PID: $SERVER_PID)"
echo "📝 Logs: tail -f server.log"
echo ""

# Wait for server to be ready
echo "3️⃣ Waiting for server to be ready..."
for i in {1..10}; do
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo "✅ Server is ready!"
        break
    fi
    echo "   Waiting... ($i/10)"
    sleep 1
done
echo ""

# Test endpoints
echo "4️⃣ Testing download endpoints..."
echo ""

echo "   Testing JSON download..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/export/download/json)
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ JSON endpoint working (HTTP $HTTP_CODE)"
else
    echo "   ❌ JSON endpoint failed (HTTP $HTTP_CODE)"
fi

echo "   Testing CSV download..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/export/download/csv)
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ CSV endpoint working (HTTP $HTTP_CODE)"
else
    echo "   ❌ CSV endpoint failed (HTTP $HTTP_CODE)"
fi

echo ""
echo "===================================="
echo "✅ Setup complete!"
echo ""
echo "🌐 Open: http://localhost:8000"
echo "📊 Test: Click Export button and try all formats"
echo "📝 Logs: tail -f server.log"
echo "🛑 Stop: kill $SERVER_PID"
echo ""
echo "Expected behavior:"
echo "  • JSON: Downloads immediately ✅"
echo "  • CSV: Downloads immediately ✅"
echo "  • PDF: Generates and downloads ✅"
echo ""
