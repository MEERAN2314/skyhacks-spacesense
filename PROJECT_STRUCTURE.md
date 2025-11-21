# 📁 SpaceSense Lite Project Structure

## 🗂️ Root Directory

```
spacesense-lite/
├── src/                          # Source code
│   ├── __init__.py
│   ├── ai_insights.py           # AI-powered risk analysis
│   ├── celestrak_client.py      # Celestrak.org API client
│   ├── database.py              # MongoDB Atlas connection
│   ├── debris_tracker.py        # Debris tracking logic
│   ├── orbital_simple.py        # Simplified orbital mechanics
│   ├── risk_analyzer.py         # Risk analysis engine
│   ├── spacetrack_client.py     # Space-Track.org API client
│   └── websocket_manager.py     # WebSocket connection manager
│
├── static/                       # Frontend assets
│   ├── css/
│   │   ├── style.css            # Main styles
│   │   └── animations.css       # Animation styles
│   └── js/
│       ├── dashboard.js         # Dashboard logic
│       ├── earth-visualization.js # 3D Earth visualization
│       └── websocket-client.js  # WebSocket client
│
├── templates/                    # HTML templates
│   └── dashboard.html           # Main dashboard template
│
├── main.py                       # FastAPI application
├── run.py                        # Local development startup
├── start.py                      # Production/cloud startup
│
├── requirements.txt              # Full dependencies
├── requirements-minimal.txt      # Minimal dependencies
├── requirements-cloud.txt        # Cloud deployment dependencies
│
├── Dockerfile                    # Docker configuration
├── docker-compose.yml            # Docker Compose configuration
├── Procfile                      # Heroku configuration
├── render.yaml                   # Render.com configuration
│
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
│
├── README.md                     # Main documentation
├── DEPLOYMENT.md                 # Deployment guide
├── INSTALL_PYTHON312.md          # Python 3.12 installation guide
├── PROJECT_STRUCTURE.md          # This file
│
└── setup_*.md                    # API setup guides
    ├── setup_celestrak_api.md
    ├── setup_mongodb_atlas.md
    └── setup_spacetrack_api.md
```

## 📝 File Descriptions

### Core Application Files

- **`main.py`** - FastAPI application with all routes and endpoints
- **`run.py`** - Development startup script with debugging
- **`start.py`** - Production startup script for cloud deployment

### Source Code (`src/`)

- **`debris_tracker.py`** - Tracks orbital debris and satellites
- **`risk_analyzer.py`** - Analyzes collision risks and probabilities
- **`ai_insights.py`** - Generates AI-powered insights using Gemini
- **`celestrak_client.py`** - Fetches real orbital data from Celestrak.org
- **`spacetrack_client.py`** - Fetches data from Space-Track.org (optional)
- **`database.py`** - MongoDB Atlas connection and operations
- **`orbital_simple.py`** - Simplified orbital mechanics calculations
- **`websocket_manager.py`** - Manages WebSocket connections

### Frontend (`static/` & `templates/`)

- **`dashboard.html`** - Main dashboard interface
- **`style.css`** - Space-themed styling
- **`animations.css`** - Smooth animations and transitions
- **`earth-visualization.js`** - 3D Earth with Plotly.js
- **`dashboard.js`** - Dashboard logic and data management
- **`websocket-client.js`** - Real-time data updates

### Configuration Files

- **`requirements.txt`** - All Python dependencies
- **`requirements-minimal.txt`** - Minimal dependencies for basic functionality
- **`requirements-cloud.txt`** - Optimized for cloud deployment
- **`.env.example`** - Template for environment variables
- **`Dockerfile`** - Docker container configuration
- **`docker-compose.yml`** - Multi-container Docker setup
- **`Procfile`** - Heroku deployment configuration
- **`render.yaml`** - Render.com deployment configuration

### Documentation

- **`README.md`** - Main project documentation
- **`DEPLOYMENT.md`** - Cloud deployment guide
- **`INSTALL_PYTHON312.md`** - Python 3.12 compatibility guide
- **`setup_celestrak_api.md`** - Celestrak.org setup guide
- **`setup_mongodb_atlas.md`** - MongoDB Atlas setup guide
- **`setup_spacetrack_api.md`** - Space-Track.org setup guide

## 🚀 Quick Start

### Local Development
```bash
python run.py
```

### Production/Cloud
```bash
python start.py
```

### Docker
```bash
docker-compose up
```

## 📦 Dependencies

### Core (Required)
- FastAPI - Web framework
- Uvicorn - ASGI server
- Jinja2 - Templating
- Motor - MongoDB async driver
- HTTPX - HTTP client

### Optional
- Skyfield - Orbital mechanics
- NumPy/Pandas - Scientific computing
- Google Generative AI - AI insights

## 🔧 Environment Variables

See `.env.example` for all available configuration options.

### Essential
- `PORT` - Server port (auto-set by cloud platforms)
- `HOST` - Server host (default: 0.0.0.0)
- `DEBUG` - Debug mode (True/False)

### Optional
- `MONGODB_URL` - MongoDB Atlas connection string
- `GEMINI_API_KEY` - Google Gemini AI API key
- `SPACETRACK_USERNAME` - Space-Track.org username
- `SPACETRACK_PASSWORD` - Space-Track.org password

## 📊 Data Flow

```
Celestrak.org → debris_tracker.py → main.py → WebSocket → Frontend
                      ↓
                 database.py (MongoDB Atlas)
                      ↓
              risk_analyzer.py → ai_insights.py
```

## 🎯 Key Features

- **Real-time Tracking** - Live debris and satellite positions
- **3D Visualization** - Interactive Earth with zoom controls
- **Risk Analysis** - Collision probability calculations
- **AI Insights** - Gemini-powered predictions
- **Multi-source Data** - Celestrak + Space-Track integration
- **Cloud Ready** - Deploy to Render, Heroku, Railway, etc.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details