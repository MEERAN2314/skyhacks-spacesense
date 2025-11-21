#!/usr/bin/env python3
"""
Minimal test app to verify Render deployment works
"""

import os
import uvicorn
from fastapi import FastAPI

# Create minimal FastAPI app
app = FastAPI(title="SpaceSense Lite Test")

@app.get("/")
async def root():
    return {
        "message": "SpaceSense Lite is running!",
        "port": os.getenv("PORT", "unknown"),
        "status": "healthy"
    }

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 10000))
    print(f"🚀 Test app starting on port {port}")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )