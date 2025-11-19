# 🛰️ SpaceSense Lite - Orbital Debris Intelligence System

**"Safeguarding Space... One Orbit at a Time."**

SpaceSense Lite is an intelligent orbital debris risk assessment and visualization system designed for the modern space age. Built for universities, small missions, and newspace startups, it transforms complex orbital data into actionable intelligence through stunning visualizations and AI-powered insights.

## 🌟 Features

### 🎯 Core Capabilities
- **Real-time Debris Tracking**: Live orbital debris monitoring with interactive 3D Earth visualization
- **Risk Intelligence**: Smart risk zoning (Safe/Watch/Alert) with collision probability analysis
- **AI-Powered Insights**: Gemini AI integration for predictive analysis and recommendations
- **Critical Conjunctions**: Real-time tracking of close approach events with countdown timers
- **Interactive Dashboard**: Responsive, space-themed UI with stunning animations and smooth controls

### 🚀 Advanced Visualization
- **3D Earth Model**: Interactive globe with realistic orbital mechanics
- **Zoom Controls**: Multi-level zoom (0.5x to 5.0x) with mouse wheel, keyboard, and button support
- **Real-time Animation**: Smooth Earth rotation with pause/play controls
- **Object Tracking**: Color-coded debris (risk-based) and satellites (mission-based)
- **Orbital Paths**: Dynamic orbital trajectory visualization
- **User Controls**: Manual refresh, auto-refresh toggle, and view reset options

### 🔧 Technical Excellence
- **FastAPI Backend**: High-performance async API with WebSocket support
- **Multi-Source Data**: Celestrak.org (instant access) + Space-Track.org (optional) integration
- **MongoDB Atlas**: Cloud database with automatic fallback to in-memory storage
- **Real-time Updates**: User-controlled refresh system (manual + auto-refresh options)
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **AI Integration**: Google Gemini API for intelligent risk assessment and predictions

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework with async support
- **Python 3.8+** - Core language with orbital mechanics libraries
- **MongoDB Atlas** - Cloud document database with local fallback
- **WebSockets** - Real-time bidirectional communication
- **Skyfield** - Professional orbital mechanics calculations (with simplified fallback)
- **Google Gemini AI** - AI-powered insights and predictions
- **Celestrak.org API** - Instant access to real orbital data (no registration required)
- **Space-Track.org API** - Optional official U.S. government orbital data

### Frontend
- **HTML5/CSS3/JavaScript** - Modern web technologies
- **Plotly.js** - Interactive 3D visualizations with zoom and rotation
- **Jinja2** - Server-side templating
- **CSS Animations** - Smooth, space-themed animations with particle effects
- **Responsive Design** - Mobile-first approach with adaptive layouts
- **Real-time Controls** - User-controlled refresh system and interactive zoom

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+** (Python 3.12 supported with compatibility fixes)
- **Internet connection** (for real orbital data from Celestrak.org)
- **MongoDB Atlas** (optional - uses in-memory fallback)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### ⚡ Instant Setup (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/your-username/spacesense-lite.git
cd spacesense-lite
```

2. **Install dependencies**
```bash
# Option 1: Standard installation
pip install -r requirements.txt

# Option 2: If you encounter Python 3.12 issues
python install_fix.py

# Option 3: Minimal installation (fastest)
pip install -r requirements-minimal.txt
```

3. **Run immediately (no configuration needed!)**
```bash
python run.py
```

4. **Open your browser**
```
http://localhost:8006
```

**🎉 That's it!** SpaceSense Lite will automatically:
- ✅ Load real orbital data from Celestrak.org (no registration required)
- ✅ Display live debris and satellite tracking
- ✅ Provide interactive 3D Earth visualization
- ✅ Work with in-memory storage (no database setup needed)

### 🔧 Optional Configuration

For enhanced features, create a `.env` file:
```bash
cp .env.example .env
# Edit .env with your API keys and database settings
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

## 🛰️ Data Sources

### 🌐 Real Orbital Data (Multiple Sources)

#### **Celestrak.org** (Primary - Instant Access) ⚡
- ✅ **No registration required** - works immediately
- ✅ **Real NORAD data** - same quality as government sources  
- ✅ **Already integrated** - automatic data loading
- ✅ **Perfect for hackathons** - zero setup time
- 📊 **Data includes**: ISS, Starlink, GPS satellites, collision debris
- 🔄 **Update frequency**: Multiple times per day
- 📖 **Setup guide**: `setup_celestrak_api.md`

#### **Space-Track.org** (Secondary - Official Source) 🏛️
- 🔐 **Registration required** - 1-2 days approval process
- 🏆 **Official U.S. government source** - highest authority
- 📈 **Comprehensive data** - complete orbital catalog
- 🎯 **Production ready** - for professional applications
- 📖 **Setup guide**: `setup_spacetrack_api.md`

### 🤖 AI & Analytics

#### **Google Gemini AI** (Recommended)
- 🧠 **Advanced risk analysis** - AI-powered insights
- 📊 **Predictive modeling** - future collision probabilities
- 💡 **Optimization suggestions** - actionable recommendations
- 🎯 **Confidence scoring** - reliability indicators
- 📖 **Setup**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 🗄️ Database Options

#### **MongoDB Atlas** (Recommended - Cloud)
- ☁️ **Cloud database** - professional, scalable storage
- 🆓 **Free tier available** - M0 Sandbox (512MB)
- 🌍 **Global access** - works from anywhere
- 🔒 **Built-in security** - encryption and authentication
- 📖 **Setup guide**: `setup_mongodb_atlas.md`

#### **In-Memory Storage** (Automatic Fallback)
- 🚀 **Zero configuration** - works out of the box
- ⚡ **Instant startup** - no database setup needed
- 🎯 **Perfect for demos** - reliable and fast
- 💾 **Temporary storage** - data resets on restart

### Setup Instructions

1. **MongoDB Atlas Setup** (Optional but Recommended)
   - Follow the detailed guide in `setup_mongodb_atlas.md`
   - Create a free M0 cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Get your connection string and add to `.env`

2. **Gemini AI API Key** (Optional but Recommended)
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add to your `.env` file

3. **Space-Track.org Account** (Optional)
   - Register at [Space-Track.org](https://www.space-track.org/)
   - Wait for approval (1-2 business days)
   - Add credentials to `.env` file

## 📊 Dashboard Features

### 🌍 Live Orbital View
- **Interactive 3D Earth Model**: Realistic globe with smooth rotation animation
- **Multi-Level Zoom**: 0.5x to 5.0x zoom with mouse wheel, keyboard shortcuts, and buttons
- **Real-time Object Tracking**: Live debris and satellite positions with orbital paths
- **Smart Color Coding**: Risk-based debris colors (red=high, orange=medium, yellow=low)
- **Mission-Based Satellites**: Green markers with mission type identification
- **User Controls**: Play/pause animation, reset view, manual refresh options
- **Zoom Indicator**: Live zoom level display with visual feedback

### 📈 Risk Analysis Panel
- **Risk Zone Distribution**: Safe/Watch/Alert zone counts with real-time updates
- **Collision Probability**: 24-hour and weekly collision risk percentages
- **Visual Risk Bars**: Color-coded probability indicators with smooth animations
- **Trend Analysis**: Risk level changes and predictions over time

### ⚠️ Critical Conjunctions
- **Close Approach Tracking**: Real-time monitoring of potential collisions
- **Countdown Timers**: Time-to-closest-approach with precise calculations
- **Miss Distance**: Accurate separation distances in kilometers
- **Risk Classification**: Alert/Watch/Safe categorization with color coding
- **Object Details**: Primary and secondary object identification
- **Collision Probability**: Precise percentage calculations for each event

### 🧠 AI Insights
- **Gemini AI Analysis**: Advanced risk assessment using Google's AI
- **Predictive Modeling**: Future risk trends and collision probabilities
- **Optimization Suggestions**: Actionable recommendations for risk mitigation
- **Confidence Scoring**: AI prediction reliability indicators
- **Threat Assessment**: Overall space environment risk evaluation

## 🎨 User Interface & Experience

### 🌌 Space Theme Design
- **Animated Starfield**: Dynamic background with twinkling stars and particle effects
- **Smooth Animations**: CSS keyframe animations with easing and stagger effects
- **Responsive Layout**: Adaptive grid system for desktop, tablet, and mobile
- **Accessibility**: WCAG-compliant design with proper contrast and navigation
- **Professional Aesthetics**: Space agency-inspired design with modern touches

### 🎮 Interactive Controls
- **Manual Refresh**: Click to update data when you want fresh information
- **Auto-Refresh Toggle**: Enable/disable 60-second automatic updates
- **Zoom Controls**: Multiple zoom methods (buttons, keyboard, mouse wheel)
- **Animation Controls**: Play/pause Earth rotation and reset view options
- **Keyboard Shortcuts**: 
  - `+/-` for zoom in/out
  - `Ctrl+R` for refresh
  - `Space` for pause/play (when focused)

### 📱 Multi-Device Support
- **Desktop Optimized**: Full-featured experience with all controls
- **Tablet Friendly**: Touch-optimized interface with gesture support
- **Mobile Responsive**: Streamlined layout for smartphones
- **Cross-Browser**: Works on Chrome, Firefox, Safari, and Edge
- **Performance Optimized**: Smooth 60fps animations on all devices

### 🔄 User-Controlled Updates
- **No Constant Refreshing**: Data stays stable until you refresh it
- **Smooth User Experience**: No jarring updates during exploration
- **Professional Presentation**: Perfect for demos and presentations
- **Loading Indicators**: Clear feedback when data is being updated
- **Error Handling**: Graceful fallbacks and user-friendly error messages

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

## 🔧 Installation & Troubleshooting

### 🐍 Python 3.12 Compatibility

If you encounter installation issues with Python 3.12:

```bash
# Option 1: Use the automated fix script
python install_fix.py

# Option 2: Manual step-by-step installation
pip install --upgrade pip setuptools wheel
pip install fastapi uvicorn jinja2 httpx python-dotenv motor
pip install numpy pandas skyfield  # Optional scientific packages

# Option 3: Minimal installation (fastest)
pip install -r requirements-minimal.txt
```

### 🚀 Development Mode

```bash
# Install development dependencies
pip install -r requirements.txt

# Run with auto-reload and debugging
python run.py

# Or use uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8006

# Enable debug logging
DEBUG=True python run.py
```

### 🐳 Docker Deployment

```bash
# Build and run with Docker
docker build -t spacesense-lite .
docker run -p 8006:8006 spacesense-lite

# Or use Docker Compose
docker-compose up -d
```

### ⚠️ Common Issues & Solutions

#### **Port Already in Use**
```bash
# SpaceSense Lite uses port 8006 by default
# If port is busy, change in .env file:
PORT=8007
```

#### **Missing Dependencies**
```bash
# The app works even with missing packages!
# Core features work with minimal installation
pip install fastapi uvicorn jinja2 httpx
```

#### **MongoDB Connection Issues**
```bash
# App automatically falls back to in-memory storage
# No MongoDB setup required for basic functionality
```

#### **Python Version Issues**
```bash
# Use Python 3.8-3.11 for best compatibility
# Python 3.12 supported with install_fix.py
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
## 🎯 Pe
rfect for Hackathons & Demos

### 🏆 What Makes This Special

#### **Instant Impact**
- ✅ **Zero setup time** - works immediately after `python run.py`
- ✅ **Real data** - actual orbital information from Celestrak.org
- ✅ **Professional UI** - space agency quality visualization
- ✅ **Interactive demo** - engaging 3D Earth with zoom controls

#### **Technical Excellence**
- ✅ **Production architecture** - FastAPI + MongoDB Atlas + AI integration
- ✅ **Real orbital mechanics** - accurate satellite tracking calculations
- ✅ **Scalable design** - handles thousands of debris objects
- ✅ **Error resilience** - graceful fallbacks and robust error handling

#### **Demo-Ready Features**
- ✅ **Live satellite tracking** - "This is the actual ISS position right now"
- ✅ **Real collision debris** - "These are fragments from the 2009 collision"
- ✅ **AI risk analysis** - "Our AI predicts collision probabilities"
- ✅ **Interactive controls** - "Let me zoom in to show you the details"

### 🎬 Demo Script Ideas

#### **Opening Hook** (30 seconds)
*"Space is becoming dangerously crowded. Over 34,000 tracked objects threaten active satellites. Let me show you SpaceSense Lite - our solution for orbital debris intelligence."*

#### **Live Demo** (2 minutes)
1. **Show the dashboard** - "Here's our real-time view of space"
2. **Zoom into Earth** - "Let me zoom in to show individual satellites"
3. **Point out ISS** - "This green dot is the International Space Station right now"
4. **Show debris** - "These red dots are actual collision fragments"
5. **Demonstrate AI** - "Our AI analyzes collision risks and provides recommendations"

#### **Technical Deep-dive** (1 minute)
*"Built with FastAPI and MongoDB Atlas, integrating real NORAD data from Celestrak.org, powered by Google's Gemini AI for risk analysis."*

#### **Impact Statement** (30 seconds)
*"SpaceSense Lite democratizes space situational awareness - making professional-grade orbital intelligence accessible to universities, small missions, and newspace startups."*

### 🚀 Deployment Options

#### **Instant Demo** (Recommended)
```bash
git clone [repo] && cd spacesense-lite && pip install -r requirements.txt && python run.py
```
*Ready in under 2 minutes!*

#### **Cloud Deployment**
- **Heroku**: One-click deployment
- **Vercel**: Automatic GitHub integration  
- **AWS/GCP**: Production-scale hosting
- **Docker**: Containerized deployment

## 🎮 User Controls & Shortcuts

### 🖱️ Mouse Controls
- **Left Click + Drag**: Rotate Earth view
- **Mouse Wheel**: Zoom in/out on orbital view
- **Right Click**: Context menu (browser dependent)

### ⌨️ Keyboard Shortcuts
- **+ or =**: Zoom in
- **- (minus)**: Zoom out
- **Ctrl + R**: Refresh data
- **Space**: Pause/play animation (when focused)
- **Ctrl + +/-**: Alternative zoom controls

### 🎛️ Dashboard Controls
- **🔄 Refresh**: Manual data update
- **⏯️ Auto**: Toggle 60-second auto-refresh
- **🔍+ Zoom In**: Closer Earth view
- **🔍- Zoom Out**: Wider orbital view
- **⏸️ Pause**: Stop Earth rotation
- **🔄 Reset**: Return to default view

## 📊 Data & Metrics

### 🛰️ Real-Time Tracking
- **150+ Debris Objects**: Live collision fragments
- **50+ Active Satellites**: ISS, Starlink, GPS, weather satellites
- **Orbital Paths**: Dynamic trajectory visualization
- **Risk Zones**: Safe (green), Watch (orange), Alert (red)

### 📈 Risk Analysis
- **Collision Probability**: 24-hour and weekly forecasts
- **Miss Distance**: Precise separation calculations
- **Time to Closest Approach**: Countdown timers
- **AI Confidence**: Prediction reliability scores

### 🌍 Coverage Areas
- **Low Earth Orbit (LEO)**: 200-2000 km altitude
- **Medium Earth Orbit (MEO)**: 2000-35,786 km altitude  
- **Geostationary Orbit (GEO)**: 35,786 km altitude
- **Global Coverage**: All orbital inclinations

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### 🔧 Development Setup
```bash
git clone https://github.com/your-username/spacesense-lite.git
cd spacesense-lite
pip install -r requirements.txt
python run.py
```

### 📝 Contribution Areas
- **New Data Sources**: Additional orbital data APIs
- **Enhanced Visualizations**: New chart types and 3D models
- **AI Improvements**: Better risk prediction algorithms
- **Mobile Optimization**: Enhanced mobile experience
- **Performance**: Optimization and caching improvements

### 🐛 Bug Reports
- Use GitHub Issues for bug reports
- Include Python version, OS, and error messages
- Provide steps to reproduce the issue

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### 🛰️ Data Sources
- **Celestrak.org** - Dr. T.S. Kelso for free orbital data access
- **Space-Track.org** - U.S. Space Force for official orbital catalog
- **NASA** - Orbital mechanics research and guidelines
- **ESA** - Space debris mitigation standards

### 🤖 Technology Partners
- **Google** - Gemini AI API for intelligent analysis
- **MongoDB** - Atlas cloud database platform
- **Plotly** - Interactive visualization library
- **FastAPI** - Modern Python web framework

### 🎓 Inspiration
- **Space agencies worldwide** - For space situational awareness leadership
- **NewSpace community** - For democratizing space access
- **Open source contributors** - For making this project possible

---

## 📞 Support & Contact

### 📚 Documentation
- **Setup Guides**: `setup_*.md` files in repository
- **API Documentation**: Available at `/docs` when running
- **Troubleshooting**: `INSTALL_PYTHON312.md` for common issues

### 🆘 Getting Help
- **GitHub Issues**: [Report bugs and request features](https://github.com/your-username/spacesense-lite/issues)
- **Discussions**: [Community Q&A and ideas](https://github.com/your-username/spacesense-lite/discussions)
- **Email**: [Contact the team](mailto:team@spacesense-lite.com)

### 🌟 Stay Updated
- **⭐ Star this repo** to stay notified of updates
- **👀 Watch releases** for new features
- **🍴 Fork** to create your own version

---

**Built with ❤️ for the space community by Team CRESHACKERZ**

*Making space safer, one orbit at a time.* 🛰️✨

**SpaceSense Lite** - Transforming orbital debris management through intelligent visualization and AI-powered insights.