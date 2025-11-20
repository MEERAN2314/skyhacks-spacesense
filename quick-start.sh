#!/bin/bash
# Quick Start Script for SpaceSense Lite
# Handles port conflicts and gets you running fast

echo "🚀 SpaceSense Lite Quick Start"
echo "=============================="

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Check if Redis is running on host
if lsof -Pi :6379 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Redis is running on port 6379, using alternative port..."
else
    echo "✅ Port 6379 is available"
fi

# Start just the main application (without Redis for now)
echo "🏃 Starting SpaceSense Lite..."
docker run -d \
    --name spacesense-lite \
    -p 8006:8006 \
    -e DEBUG=False \
    -e HOST=0.0.0.0 \
    -e PORT=8006 \
    skyhacks-spacesense_spacesense-lite:latest

# Check if it started successfully
sleep 3
if docker ps | grep spacesense-lite > /dev/null; then
    echo "✅ SpaceSense Lite is running!"
    echo "🌐 Access your application at: http://localhost:8006"
    echo ""
    echo "📊 Useful commands:"
    echo "   docker logs spacesense-lite     # View logs"
    echo "   docker stop spacesense-lite     # Stop container"
    echo "   docker rm spacesense-lite       # Remove container"
    echo ""
    echo "🎉 Your orbital debris management system is ready!"
else
    echo "❌ Failed to start. Check logs with: docker logs spacesense-lite"
fi