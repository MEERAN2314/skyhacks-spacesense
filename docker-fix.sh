#!/bin/bash
# Docker Fix Script for SpaceSense Lite
# Handles common Docker build and deployment issues

echo "🐳 SpaceSense Lite Docker Fix Script"
echo "===================================="

# Clean up any existing containers and images
echo "🧹 Cleaning up existing Docker resources..."
docker-compose down --remove-orphans 2>/dev/null || true
docker system prune -f 2>/dev/null || true

# Check Docker version
echo "🔍 Checking Docker version..."
docker --version
docker-compose --version

# Try simple build first
echo "🚀 Attempting simple Docker build..."
if docker build -f Dockerfile.simple -t spacesense-lite-simple .; then
    echo "✅ Simple build successful!"
    echo "🏃 Running container..."
    docker run -d -p 8006:8006 --name spacesense-lite spacesense-lite-simple
    echo "🌐 SpaceSense Lite should be available at http://localhost:8006"
    echo "📊 Check status with: docker ps"
    echo "📝 View logs with: docker logs spacesense-lite"
else
    echo "❌ Simple build failed. Trying minimal approach..."
    
    # Create minimal Dockerfile on the fly
    cat > Dockerfile.minimal << 'EOF'
FROM python:3.11-slim
WORKDIR /app
RUN pip install fastapi uvicorn jinja2 httpx python-dotenv motor pymongo aiofiles google-generativeai
COPY . .
EXPOSE 8006
CMD ["python", "run.py"]
EOF
    
    if docker build -f Dockerfile.minimal -t spacesense-lite-minimal .; then
        echo "✅ Minimal build successful!"
        docker run -d -p 8006:8006 --name spacesense-lite spacesense-lite-minimal
        echo "🌐 SpaceSense Lite available at http://localhost:8006"
    else
        echo "❌ All Docker builds failed. Please check the error messages above."
        echo "💡 Try running: pip install -r requirements-minimal.txt && python run.py"
        exit 1
    fi
fi

echo ""
echo "🎉 Docker deployment complete!"
echo "📋 Useful commands:"
echo "   docker ps                    # Check running containers"
echo "   docker logs spacesense-lite  # View application logs"
echo "   docker stop spacesense-lite  # Stop the container"
echo "   docker rm spacesense-lite    # Remove the container"