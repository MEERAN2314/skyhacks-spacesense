# 🛰️ SpaceSense Lite - Orbital Debris Intelligence System

**"Safeguarding Space... One Orbit at a Time."**

SpaceSense Lite is an intelligent orbital debris risk assessment and visualization system designed for the modern space age. Built for universities, small missions, and newspace startups, it transforms complex orbital data into actionable intelligence through stunning visualizations and AI-powered insights.

## 🌟 Features

### 🎯 Core Capabilities
- **Real-time Debris Tracking**: Live orbital debris monitoring with 3D Earth visualization
- **Risk Intelligence**: Smart risk zoning (Safe/Watch/Alert) with collision probability analysis
- **AI-Powered Insights**: Gemini AI integration for predictive analysis and recommendations
- **Critical Conjunctions**: Real-time tracking of close approach events
- **Interactive Dashboard**: Responsive, space-themed UI with stunning animations

### 🚀 Technical Highlights
- **FastAPI Backend**: High-performance async API with WebSocket support
- **Real-time Updates**: Live data streaming with WebSocket connections
- **3D Visualization**: Interactive Earth model with orbital mechanics
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile
- **AI Integration**: Google Gemini API for intelligent risk assessment
- **MongoDB Storage**: Scalable data storage for debris and satellite tracking

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework
- **Python** - Core language with orbital mechanics libraries
- **MongoDB** - Document database for flexible data storage
- **WebSockets** - Real-time bidirectional communication
- **Skyfield/Poliastro** - Orbital mechanics and satellite tracking
- **Google Gemini AI** - AI-powered insights and predictions

### Frontend
- **HTML5/CSS3/JavaScript** - Modern web technologies
- **Plotly.js** - Interactive 3D visualizations
- **Jinja2** - Server-side templating
- **CSS Animations** - Smooth, space-themed animations
- **Responsive Design** - Mobile-first approach

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- MongoDB (optional - uses in-memory fallback)
- Redis (optional - for background tasks)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/spacesense-lite.git
cd spacesense-lite
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Configure environment (Optional)**
```bash
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string and API keys
# Note: Celestrak.org works immediately with no configuration!
```

4. **Run the application**
```bash
python run.py
```

5. **Open your browser**
```
http://localhost:8006
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following configuration:

```env
# MongoDB Atlas (recommended for production)
MONGODB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/spacesense_lite?retryWrites=true&w=majority

# Gemini AI API Key (recommended)
GEMINI_API_KEY=your_gemini_api_key_here

# Application Settings
DEBUG=True
HOST=0.0.0.0
PORT=8006
```

### Setup Instructions

1. **MongoDB Atlas Setup** (Recommended)
   - Follow the detailed guide in `setup_mongodb_atlas.md`
   - Create a free M0 cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Get your connection string and add to `.env`

2. **Gemini AI API Key** (Recommended)
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add to your `.env` file

3. **Real Orbital Data** (Multiple sources available)
   - **Celestrak.org** (Recommended for hackathons) - See `setup_celestrak_api.md`
     - ✅ **No registration required** - instant access!
     - ✅ **Real NORAD data** - same quality as government sources
     - ✅ **Already integrated** - works out of the box
   - **Space-Track.org** (Optional) - See `setup_spacetrack_api.md`  
     - Requires registration (1-2 days approval)
     - Official U.S. government source

## 📊 Dashboard Features

### Live Orbital View
- Interactive 3D Earth visualization
- Real-time debris and satellite tracking
- Orbital path visualization
- Risk-based color coding

### Risk Analysis Panel
- Risk zone distribution (Safe/Watch/Alert)
- Collision probability metrics
- Trend analysis and predictions

### Critical Conjunctions
- Close approach event tracking
- Miss distance calculations
- Time-to-closest-approach countdown
- Risk level classification

### AI Insights
- Gemini AI-powered analysis
- Risk predictions and trends
- Optimization suggestions
- Confidence scoring

## 🎨 UI/UX Features

### Space Theme Design
- Stunning space background with animated stars
- Smooth CSS animations and transitions
- Responsive layout for all devices
- Accessibility-compliant design

### Real-time Animations
- Live data update indicators
- Smooth number counting animations
- Particle effects and glowing elements
- Interactive hover effects

### Mobile Responsive
- Optimized for mobile devices
- Touch-friendly interface
- Adaptive layouts
- Performance optimized

## 🔌 API Endpoints

### Core Endpoints
- `GET /` - Main dashboard
- `GET /api/debris/live` - Live debris data
- `GET /api/risk/analysis` - Risk analysis
- `GET /api/satellites/tracked` - Tracked satellites
- `GET /api/ai/insights` - AI-powered insights
- `WebSocket /ws` - Real-time updates

### WebSocket Events
- `live_update` - Real-time data updates
- `alert` - Critical alerts and notifications
- `system_status` - System health updates

## 🧪 Development

### Project Structure
```
spacesense-lite/
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── .env.example           # Environment template
├── src/                   # Source code
│   ├── debris_tracker.py  # Debris tracking logic
│   ├── risk_analyzer.py   # Risk analysis engine
│   ├── ai_insights.py     # AI integration
│   ├── websocket_manager.py # WebSocket handling
│   └── database.py        # Database connection
├── templates/             # HTML templates
│   └── dashboard.html     # Main dashboard
└── static/               # Static assets
    ├── css/              # Stylesheets
    ├── js/               # JavaScript files
    └── images/           # Images and icons
```

### Running in Development
```bash
# Install development dependencies
pip install -r requirements.txt

# Run with auto-reload
python main.py

# Or use uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8006
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build image
docker build -t spacesense-lite .

# Run container
docker run -p 8006:8006 spacesense-lite
```

### Production Considerations
- Use environment variables for configuration
- Set up MongoDB and Redis for production
- Configure reverse proxy (nginx)
- Enable HTTPS/SSL
- Set up monitoring and logging

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA** - For orbital mechanics data and inspiration
- **ESA** - For space debris research and guidelines
- **Space-Track.org** - For TLE data access
- **Google** - For Gemini AI API
- **Plotly** - For amazing visualization capabilities

## 📞 Support

- **Documentation**: [Wiki](https://github.com/your-username/spacesense-lite/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/spacesense-lite/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/spacesense-lite/discussions)

---

**Built with ❤️ for the space community by Team CRESHACKERZ**

*Making space safer, one orbit at a time.* 🛰️✨
*
*That's it!** The system will automatically load real orbital data from Celestrak.org (no registration required).