#!/usr/bin/env python3
"""
SpaceSense Lite - Cloud Deployment Startup Script
Fixed for Render.com and other cloud platforms
"""

import os
import sys

def main():
    """Main startup function for cloud deployment"""
    
    # CRITICAL: Get port from environment - Render sets this automatically
    # Render will fail if we don't bind to the PORT it provides
    port = int(os.getenv("PORT", 10000))
    host = "0.0.0.0"
    
    print("=" * 60)
    print("🚀 SpaceSense Lite Cloud Startup")
    print("=" * 60)
    print(f"🔌 Port from environment: {os.getenv('PORT', 'NOT SET - USING DEFAULT')}")
    print(f"🌐 Binding to: {host}:{port}")
    print(f"🔧 Debug mode: {os.getenv('DEBUG', 'False')}")
    print("=" * 60)
    
    # Import uvicorn here
    try:
        import uvicorn
        print("✅ Uvicorn imported")
    except ImportError as e:
        print(f"❌ Failed to import uvicorn: {e}")
        sys.exit(1)
    
    # Import the app
    try:
        from main import app
        print("✅ FastAPI app imported")
    except Exception as e:
        print(f"❌ Failed to import app: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    
    print(f"🎯 Starting server on {host}:{port}...")
    print("=" * 60)
    
    try:
        # Start the server - MUST use the PORT from environment
        uvicorn.run(
            app,
            host=host,
            port=port,
            log_level="info",
            access_log=True,
            workers=1,
            reload=False  # Never reload in production
        )
    except Exception as e:
        print(f"❌ Server failed to start: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()