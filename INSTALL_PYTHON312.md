# 🐍 Python 3.12 Installation Guide for SpaceSense Lite

If you're getting installation errors with Python 3.12, here are several solutions:

## 🚀 Quick Fix (Recommended)

### Option 1: Use the Installation Fix Script
```bash
python install_fix.py
```

This will install packages one by one and handle compatibility issues.

### Option 2: Manual Installation (Step by Step)
```bash
# 1. Upgrade pip and setuptools first
pip install --upgrade pip setuptools wheel

# 2. Install core packages
pip install fastapi uvicorn jinja2 python-multipart websockets
pip install motor pymongo httpx python-dotenv aiofiles
pip install google-generativeai

# 3. Install scientific packages (optional)
pip install numpy pandas skyfield

# 4. Run the application
python run.py
```

### Option 3: Use Minimal Requirements
```bash
pip install -r requirements-minimal.txt
```

## 🔧 If You Still Get Errors

### Solution 1: Use Python 3.11 Instead
```bash
# Install Python 3.11 using conda/pyenv
conda create -n spacesense python=3.11
conda activate spacesense
pip install -r requirements.txt
```

### Solution 2: Skip Problematic Packages
The application will work even without some packages:
- ✅ **Skyfield missing**: Uses simplified orbital mechanics
- ✅ **NumPy missing**: Uses Python math
- ✅ **SciPy missing**: Basic calculations only
- ✅ **Pandas missing**: Uses Python lists/dicts

### Solution 3: Docker (Always Works)
```bash
docker build -t spacesense-lite .
docker run -p 8000:8000 spacesense-lite
```

## 🎯 What Works Without Full Installation

Even with minimal packages, you get:
- ✅ **Web interface** - Full dashboard
- ✅ **Real-time updates** - WebSocket connections
- ✅ **Celestrak data** - Real orbital data
- ✅ **MongoDB Atlas** - Cloud database
- ✅ **AI insights** - Gemini integration
- ✅ **3D visualization** - Plotly.js (frontend)

## 🚀 Quick Start (Minimal Setup)

```bash
# Install only essential packages
pip install fastapi uvicorn jinja2 httpx python-dotenv motor

# Run with basic functionality
python run.py
```

You'll see:
```
⚠️  Skyfield not available, using simplified orbital mechanics
⚠️  NumPy not available, using Python math
✅ Celestrak client initialized (no registration required)
🚀 SpaceSense Lite initialized successfully!
```

## 🎯 For Your Hackathon Demo

**The application works perfectly for demos even with missing packages!**

### What You Get:
- ✅ **Professional UI** - Full space-themed dashboard
- ✅ **Real data** - Celestrak.org orbital data
- ✅ **Live tracking** - Real-time satellite positions
- ✅ **Risk analysis** - Collision probability calculations
- ✅ **AI insights** - Gemini-powered analysis

### What's Simplified:
- 🔄 **Orbital calculations** - Uses approximations instead of precise math
- 🔄 **Position accuracy** - Good enough for demo purposes
- 🔄 **Scientific precision** - Demo-quality vs research-quality

## 🆘 Troubleshooting

### Error: "No module named 'skyfield'"
```bash
# This is fine! The app has fallbacks
python run.py  # Will work with simplified mechanics
```

### Error: "No module named 'numpy'"
```bash
# This is fine! Uses Python math instead
python run.py  # Will work with basic calculations
```

### Error: "Build failed"
```bash
# Skip the problematic package
pip install --no-deps package_name
# Or just run without it
python run.py
```

## 🎉 Success Indicators

When you run `python run.py`, you should see:
```
✅ Celestrak client initialized (no registration required)
✅ Connected to MongoDB Atlas successfully (if configured)
✅ Loaded 30 debris objects from Celestrak
✅ Loaded 20 satellites from Celestrak
🚀 SpaceSense Lite initialized successfully!
```

Then open: http://localhost:8000

## 💡 Pro Tips

1. **For Hackathons**: Minimal installation is perfect - focus on demo, not precision
2. **For Production**: Use full installation with all scientific packages
3. **For Development**: Docker ensures consistent environment
4. **For Presentation**: The UI looks identical regardless of backend precision

Your SpaceSense Lite will work beautifully for the hackathon demo even with a minimal installation! 🛰️✨