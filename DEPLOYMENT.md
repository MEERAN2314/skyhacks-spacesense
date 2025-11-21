# 🚀 SpaceSense Lite Deployment Guide

## Cloud Platform Deployment

### 🎯 Render.com (Recommended)

1. **Connect GitHub Repository**
   - Go to [Render.com](https://render.com)
   - Connect your GitHub account
   - Select your SpaceSense Lite repository

2. **Configure Service**
   - **Service Type**: Web Service
   - **Build Command**: `pip install -r requirements-cloud.txt`
   - **Start Command**: `python start.py`
   - **Environment**: Python 3

3. **Environment Variables**
   ```
   DEBUG=False
   HOST=0.0.0.0
   ```
   (PORT is automatically set by Render)

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy your app
   - Your app will be available at `https://your-app-name.onrender.com`

### 🟣 Heroku

1. **Install Heroku CLI**
   ```bash
   # Install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Deploy to Heroku**
   ```bash
   # Login to Heroku
   heroku login
   
   # Create new app
   heroku create your-spacesense-app
   
   # Set environment variables
   heroku config:set DEBUG=False
   heroku config:set HOST=0.0.0.0
   
   # Deploy
   git push heroku main
   ```

3. **Open Your App**
   ```bash
   heroku open
   ```

### ☁️ Railway

1. **Connect Repository**
   - Go to [Railway.app](https://railway.app)
   - Connect your GitHub repository

2. **Configure**
   - Railway will auto-detect Python
   - Set start command: `python start.py`
   - Add environment variables:
     ```
     DEBUG=False
     HOST=0.0.0.0
     ```

### 🌐 Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configure**
   - Add `vercel.json` configuration (already included)
   - Set environment variables in Vercel dashboard

## Docker Deployment

### 🐳 Docker

```bash
# Build image
docker build -t spacesense-lite .

# Run container
docker run -p 8006:8006 -e DEBUG=False spacesense-lite
```

### 🐙 Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Environment Variables

### Required
- `PORT` - Port number (automatically set by cloud platforms)
- `HOST` - Host address (default: 0.0.0.0)

### Optional
- `DEBUG` - Debug mode (default: True for local, False for production)
- `MONGODB_URL` - MongoDB Atlas connection string
- `GEMINI_API_KEY` - Google Gemini AI API key
- `SPACETRACK_USERNAME` - Space-Track.org username
- `SPACETRACK_PASSWORD` - Space-Track.org password

## Troubleshooting

### Port Issues
If you get port binding errors:
- Cloud platforms automatically set the PORT environment variable
- Don't hardcode port numbers
- Use `python start.py` instead of `python run.py` for production

### Dependency Issues
If packages fail to install:
- Use `requirements-cloud.txt` for cloud deployment
- Use `requirements-minimal.txt` for basic functionality
- Scientific packages (numpy, pandas) may fail on some platforms

### Memory Issues
If you encounter memory limits:
- Reduce the number of debris objects displayed
- Use in-memory storage instead of MongoDB
- Disable scientific calculations

### Performance Issues
For better performance:
- Set `DEBUG=False` in production
- Use MongoDB Atlas for data storage
- Enable caching for API responses

## Health Checks

The application provides health check endpoints:
- `/api/debris/live` - Returns debris data (indicates app is working)
- `/` - Main dashboard (full functionality test)

## Monitoring

### Logs
- Application logs are sent to stdout
- Cloud platforms automatically capture logs
- Use `docker-compose logs -f` for Docker deployments

### Metrics
- Monitor response times for API endpoints
- Track memory usage (especially with scientific packages)
- Monitor database connections (if using MongoDB Atlas)

## Security

### Production Settings
- Set `DEBUG=False` in production
- Use HTTPS (automatically provided by cloud platforms)
- Secure MongoDB Atlas with IP whitelisting
- Use environment variables for API keys

### API Keys
- Never commit API keys to version control
- Use cloud platform environment variable management
- Rotate keys regularly

## Scaling

### Horizontal Scaling
- Most cloud platforms support auto-scaling
- Application is stateless (except for WebSocket connections)
- Use load balancer for multiple instances

### Database Scaling
- MongoDB Atlas provides automatic scaling
- Use connection pooling for better performance
- Consider read replicas for high traffic

## Cost Optimization

### Free Tiers
- **Render**: 750 hours/month free
- **Heroku**: 1000 dyno hours/month free (with credit card)
- **Railway**: $5 credit/month
- **MongoDB Atlas**: 512MB free tier

### Cost Reduction
- Use in-memory storage to avoid database costs
- Implement caching to reduce API calls
- Use minimal requirements for smaller deployments

## Support

If you encounter deployment issues:
1. Check the logs for error messages
2. Verify environment variables are set correctly
3. Try using `requirements-cloud.txt` instead of `requirements.txt`
4. Use `python start.py` instead of `python run.py`
5. Open an issue on GitHub with deployment platform and error details