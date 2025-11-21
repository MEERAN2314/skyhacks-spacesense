#!/usr/bin/env bash
# Render startup script - ensures correct port binding

set -o errexit

echo "🚀 Starting SpaceSense Lite on Render..."
echo "📍 PORT environment variable: ${PORT:-NOT SET}"

# Use Render's PORT or default to 10000
export PORT=${PORT:-10000}

echo "🔌 Will bind to port: $PORT"

# Start the application
exec python start.py