# 🐳 Docker Deployment Guide for SpaceSense Lite

This guide covers all Docker deployment options for SpaceSense Lite, from development to production.

## 🚀 Quick Start (Recommended)

### Simple Docker Run
```bash
# Build and run in one command
docker build -t spacesense-lite .
docker run -p 8006:8006 spacesense-lite

# Access at http://localhost:8006
```

### Docker Compose (Recommended)
```bash
# Start with Redis caching
docker-compose up -d

# Access at http://localhost:8006
```

## 🔧 Development Setup

### Development with Hot Reload
```bash
# Start development environment
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# With local MongoDB for testing
docker-compose -f docker-compose.yml -f docker-compose.dev.yml --profile dev-db up
```

### Development Features
- ✅ **Hot reload** - Code changes reflected immediately
- ✅ **Debug mode** - Detailed error messages
- ✅ **Local MongoDB** - Optional local database
- ✅ **Volume mounting** - Live code editing

## 🏭 Production Deployment

### Production with Nginx
```bash
# Full production stack
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --profile production up -d
```

### Production Features
- ✅ **Nginx reverse proxy** - Load balancing and SSL termination
- ✅ **Resource limits** - CPU and memory constraints
- ✅ **Health checks** - Automatic container restart
- ✅ **Optimized builds** - Multi-stage Docker builds

## 🌐 Cloud Deployment

### Heroku Deployment
```bash
# Install Heroku CLI and login
heroku create spacesense-lite-app
heroku container:push web
heroku container:release web
heroku open
```

### AWS ECS Deployment
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker build -t spacesense-lite .
docker tag spacesense-lite:latest <account>.dkr.ecr.us-east-1.amazonaws.com/spacesense-lite:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/spacesense-lite:latest
```

### Google Cloud Run
```bash
# Build and deploy to Cloud Run
gcloud builds submit --tag gcr.io/PROJECT-ID/spacesense-lite
gcloud run deploy --image gcr.io/PROJECT-ID/spacesense-lite --platform managed
```

## 🔐 Environment Configuration

### Required Environment Variables
```bash
# Core configuration
HOST=0.0.0.0
PORT=8006
DEBUG=False

# Optional: MongoDB Atlas
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/spacesense_lite

# Optional: AI Integration
GEMINI_API_KEY=your_gemini_api_key

# Optional: Space-Track.org
SPACETRACK_USERNAME=your_username
SPACETRACK_PASSWORD=your_password
```

### Docker Environment File
Create `.env` file:
```env
# Copy from .env.example and customize
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/spacesense_lite
GEMINI_API_KEY=your_api_key
DEBUG=False
```

## 📊 Container Monitoring

### Health Checks
```bash
# Check container health
docker ps
docker logs spacesense-lite

# Manual health check
curl http://localhost:8006/api/debris/live
```

### Resource Monitoring
```bash
# Monitor resource usage
docker stats spacesense-lite

# View logs
docker-compose logs -f spacesense-lite
```

## 🔧 Troubleshooting

### Common Issues

#### **Port Already in Use**
```bash
# Change port in docker-compose.yml
ports:
  - "8007:8006"  # Use different external port
```

#### **Build Failures**
```bash
# Clean build
docker system prune -a
docker-compose build --no-cache
```

#### **Memory Issues**
```bash
# Increase Docker memory limit
# Docker Desktop: Settings > Resources > Memory > 4GB+
```

#### **Permission Issues**
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

### Debug Mode
```bash
# Run with debug output
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Access container shell
docker exec -it spacesense-lite bash
```

## 🚀 Performance Optimization

### Production Optimizations
- ✅ **Multi-stage builds** - Smaller final images
- ✅ **Non-root user** - Security best practices
- ✅ **Health checks** - Automatic recovery
- ✅ **Resource limits** - Prevent resource exhaustion
- ✅ **Caching layers** - Faster rebuilds

### Scaling Options
```bash
# Scale horizontally
docker-compose up --scale spacesense-lite=3

# Load balancer configuration needed for multiple instances
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] MongoDB Atlas connection tested
- [ ] API keys added to environment
- [ ] SSL certificates ready (for production)
- [ ] Domain name configured

### Post-Deployment
- [ ] Health check endpoints responding
- [ ] Real data loading from Celestrak
- [ ] WebSocket connections working
- [ ] 3D visualization rendering
- [ ] Mobile responsiveness tested

## 🎯 Deployment Strategies

### Development
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```
- Fast iteration
- Debug mode enabled
- Hot reload active

### Staging
```bash
docker-compose up -d
```
- Production-like environment
- Real data sources
- Performance testing

### Production
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --profile production up -d
```
- Full security hardening
- Resource optimization
- Monitoring enabled

## 📞 Support

### Getting Help
- **Docker Issues**: Check Docker Desktop settings and logs
- **Application Issues**: Review application logs with `docker-compose logs`
- **Performance Issues**: Monitor with `docker stats`

### Useful Commands
```bash
# View all containers
docker ps -a

# Clean up
docker system prune -a

# Restart services
docker-compose restart

# Update images
docker-compose pull && docker-compose up -d
```

---

**SpaceSense Lite** is now ready for professional Docker deployment! 🛰️🐳