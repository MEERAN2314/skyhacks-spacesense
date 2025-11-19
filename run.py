#!/usr/bin/env python3
"""
SpaceSense Lite - Orbital Debris Intelligence System
Run script for easy startup
"""

import os
import sys
import subprocess
from pathlib import Path

def check_requirements():
    """Check if required packages are installed"""
    try:
        import fastapi
        import uvicorn
        import motor
        print("✅ Core dependencies found")
        return True
    except ImportError as e:
        print(f"❌ Missing dependencies: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def check_environment():
    """Check environment configuration"""
    env_file = Path(".env")
    if not env_file.exists():
        print("⚠️  .env file not found, using defaults")
        print("💡 Copy .env.example to .env and configure for production")
    else:
        print("✅ Environment configuration found")

def main():
    """Main startup function"""
    print("🚀 Starting SpaceSense Lite...")
    print("=" * 50)
    
    # Check requirements
    if not check_requirements():
        sys.exit(1)
    
    # Check environment
    check_environment()
    
    # Set default environment variables
    os.environ.setdefault("HOST", "0.0.0.0")
    os.environ.setdefault("PORT", "8006")
    os.environ.setdefault("DEBUG", "True")
    
    # Get configuration
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8006))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    print(f"🌐 Server: http://{host}:{port}")
    print(f"🔧 Debug mode: {debug}")
    print("=" * 50)
    
    try:
        # Import and run the application
        import uvicorn
        uvicorn.run(
            "main:app",
            host=host,
            port=port,
            reload=debug,
            log_level="info" if debug else "warning"
        )
    except KeyboardInterrupt:
        print("\n👋 SpaceSense Lite stopped")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()