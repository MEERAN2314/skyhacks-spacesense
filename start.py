#!/usr/bin/env python3
"""
SpaceSense Lite - Cloud Deployment Startup Script
Optimized for Render, Heroku, and other cloud platforms
"""

import os
import sys
import uvicorn

def main():
    """Main startup function for cloud deployment"""
    
    # Cloud platform configuration
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8006))
    debug = os.getenv("DEBUG", "False").lower() == "true"
    
    # Production settings for cloud deployment
    if not debug:
        # Disable reload in production
        reload = False
        log_level = "warning"
        access_log = False
    else:
        # Development settings
        reload = True
        log_level = "info"
        access_log = True
    
    print(f"🚀 Starting SpaceSense Lite on {host}:{port}")
    print(f"🔧 Debug mode: {debug}")
    
    try:
        uvicorn.run(
            "main:app",
            host=host,
            port=port,
            reload=reload,
            log_level=log_level,
            access_log=access_log,
            # Production optimizations
            workers=1 if debug else 2,
            loop="auto",
            http="auto"
        )
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()