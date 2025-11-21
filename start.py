#!/usr/bin/env python3
"""
SpaceSense Lite - Cloud Deployment Startup Script
Fixed for Render.com and other cloud platforms
"""

import os
import sys
import uvicorn

def main():
    """Main startup function for cloud deployment"""
    
    # Get port from environment - Render sets this automatically
    port = int(os.getenv("PORT", 10000))
    host = "0.0.0.0"
    
    print(f"🚀 SpaceSense Lite starting...")
    print(f"🔌 Binding to {host}:{port}")
    print(f"🌍 Environment PORT: {os.getenv('PORT', 'Not set')}")
    
    # Import the app here to avoid import issues
    try:
        from main import app
        print("✅ FastAPI app imported successfully")
    except Exception as e:
        print(f"❌ Failed to import app: {e}")
        sys.exit(1)
    
    try:
        # Start the server
        uvicorn.run(
            app,  # Use the imported app directly
            host=host,
            port=port,
            log_level="info",
            access_log=False,  # Reduce log noise
            workers=1
        )
    except Exception as e:
        print(f"❌ Server failed to start: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()