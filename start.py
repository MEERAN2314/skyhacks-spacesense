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
    
    # Get port from environment (Render sets this automatically)
    port = int(os.getenv("PORT", 10000))  # Render typically uses port 10000
    host = "0.0.0.0"  # Always bind to all interfaces for cloud deployment
    debug = os.getenv("DEBUG", "False").lower() == "true"
    
    print(f"🚀 Starting SpaceSense Lite...")
    print(f"🌐 Host: {host}")
    print(f"🔌 Port: {port}")
    print(f"🔧 Debug: {debug}")
    print(f"📊 Environment: {'Development' if debug else 'Production'}")
    
    try:
        # Simple uvicorn configuration for cloud deployment
        uvicorn.run(
            "main:app",
            host=host,
            port=port,
            reload=False,  # Never reload in cloud deployment
            log_level="info",
            access_log=True,
            # Ensure single worker for cloud platforms
            workers=1
        )
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        print(f"🔍 Port attempted: {port}")
        print(f"🔍 Host attempted: {host}")
        sys.exit(1)

if __name__ == "__main__":
    main()