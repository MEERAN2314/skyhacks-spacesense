#!/usr/bin/env bash
# Render build script

set -o errexit

echo "🔨 Building SpaceSense Lite for Render..."
pip install --upgrade pip
pip install -r requirements-cloud.txt
echo "✅ Build complete!"