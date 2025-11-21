from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import json
import asyncio
from datetime import datetime
from typing import List
import uvicorn

from src.debris_tracker import DebrisTracker
from src.risk_analyzer import RiskAnalyzer
from src.ai_insights import AIInsights
from src.websocket_manager import ConnectionManager

app = FastAPI(title="SpaceSense Lite", description="Intelligent Orbital Debris Risk Intelligence System")

# Static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Initialize components
debris_tracker = DebrisTracker()
risk_analyzer = RiskAnalyzer()
ai_insights = AIInsights()
manager = ConnectionManager()

@app.on_event("startup")
async def startup_event():
    """Initialize the system on startup"""
    await debris_tracker.initialize()
    await risk_analyzer.initialize()
    print("🚀 SpaceSense Lite initialized successfully!")

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up on shutdown"""
    await debris_tracker.close()
    print("👋 SpaceSense Lite shutdown complete")

@app.get("/", response_class=HTMLResponse)
async def dashboard(request: Request):
    """Main dashboard"""
    return templates.TemplateResponse("dashboard.html", {"request": request})

@app.get("/api/debris/live")
async def get_live_debris():
    """Get live debris data"""
    debris_data = await debris_tracker.get_live_debris()
    return {"debris": debris_data, "timestamp": datetime.utcnow().isoformat()}

@app.get("/api/risk/analysis")
async def get_risk_analysis():
    """Get current risk analysis"""
    risk_data = await risk_analyzer.analyze_current_risks()
    return risk_data

@app.get("/api/satellites/tracked")
async def get_tracked_satellites():
    """Get tracked satellites"""
    satellites = await debris_tracker.get_tracked_satellites()
    return {"satellites": satellites}

@app.get("/api/ai/insights")
async def get_ai_insights():
    """Get AI-powered insights"""
    insights = await ai_insights.generate_insights()
    return insights

@app.post("/api/data/refresh")
async def refresh_data():
    """Manually refresh data from external sources"""
    try:
        await debris_tracker.refresh_data()
        return {"status": "success", "message": "Data refreshed successfully"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/data/live-update")
async def get_live_update():
    """Get fresh data for manual refresh"""
    try:
        debris_data = await debris_tracker.get_live_debris()
        risk_data = await risk_analyzer.analyze_current_risks()
        
        return {
            "debris": debris_data[:50],
            "risks": risk_data,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {"error": str(e)}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket for real-time updates"""
    await manager.connect(websocket)
    try:
        # Send initial data immediately
        debris_data = await debris_tracker.get_live_debris()
        risk_data = await risk_analyzer.analyze_current_risks()
        
        initial_update = {
            "type": "initial_data",
            "debris": debris_data[:50],  # Limit for performance
            "risks": risk_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        await manager.send_personal_message(json.dumps(initial_update), websocket)
        
        # Then send updates every 30 seconds (much slower)
        while True:
            await asyncio.sleep(30)  # Update every 30 seconds instead of 2
            
            # Only send small status updates, not full data refresh
            status_update = {
                "type": "status_update",
                "timestamp": datetime.utcnow().isoformat(),
                "connection_status": "active"
            }
            
            await manager.send_personal_message(json.dumps(status_update), websocket)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import os
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8006))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    uvicorn.run("main:app", host=host, port=port, reload=debug)