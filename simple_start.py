#!/usr/bin/env python3
"""
Minimal startup script for cloud deployment
This should work on any cloud platform
"""

import os
import uvicorn
from main import app

if __name__ == "__main__":
    # Get port from environment (cloud platforms set this)
    port = int(os.getenv("PORT", 10000))
    
    print(f"Starting on port {port}")
    
    # Minimal configuration - should work everywhere
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )