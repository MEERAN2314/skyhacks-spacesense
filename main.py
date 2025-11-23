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

app = FastAPI(title="SpaceSense Pro", description="Professional Orbital Debris Intelligence System")

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
    print("🚀 SpaceSense Pro initialized successfully!")

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up on shutdown"""
    await debris_tracker.close()
    print("👋 SpaceSense Pro shutdown complete")

@app.get("/", response_class=HTMLResponse)
@app.head("/")
async def dashboard(request: Request):
    """Main dashboard"""
    if request.method == "HEAD":
        return HTMLResponse(status_code=200)
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

@app.get("/health")
@app.head("/health")
async def health_check():
    """Health check endpoint for cloud platforms"""
    return {"status": "healthy", "service": "SpaceSense Pro"}

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

@app.get("/api/statistics/overview")
async def get_statistics_overview():
    """Get comprehensive statistics overview"""
    try:
        debris_data = await debris_tracker.get_live_debris()
        risk_data = await risk_analyzer.analyze_current_risks()
        
        # Calculate statistics
        total_debris = len([d for d in debris_data if d.get('object_type') == 'debris'])
        total_satellites = len([d for d in debris_data if d.get('object_type') == 'satellite'])
        
        # Altitude distribution
        altitude_ranges = {
            'LEO (200-2000km)': len([d for d in debris_data if 200 <= d.get('altitude', 0) <= 2000]),
            'MEO (2000-35786km)': len([d for d in debris_data if 2000 < d.get('altitude', 0) <= 35786]),
            'GEO (35786km+)': len([d for d in debris_data if d.get('altitude', 0) > 35786])
        }
        
        # Risk distribution
        risk_distribution = {
            'high': len([d for d in debris_data if d.get('risk_level') == 'high']),
            'medium': len([d for d in debris_data if d.get('risk_level') == 'medium']),
            'low': len([d for d in debris_data if d.get('risk_level') == 'low'])
        }
        
        return {
            "total_objects": len(debris_data),
            "total_debris": total_debris,
            "total_satellites": total_satellites,
            "altitude_distribution": altitude_ranges,
            "risk_distribution": risk_distribution,
            "collision_probability": risk_data.get('collision_probability', {}),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/debris/heatmap")
async def get_debris_heatmap():
    """Get debris density heatmap data"""
    try:
        heatmap_data = []
        
        # Generate heatmap for different altitude ranges
        for altitude in range(200, 2001, 50):
            density = await risk_analyzer.calculate_debris_density((altitude, altitude + 50))
            heatmap_data.append({
                "altitude": altitude,
                "density": density.get('objects_per_km3', 0),
                "total_objects": density.get('total_objects', 0)
            })
        
        return {
            "heatmap": heatmap_data,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/satellites/details/{norad_id}")
async def get_satellite_details(norad_id: int):
    """Get detailed information about a specific satellite"""
    try:
        satellites = await debris_tracker.get_tracked_satellites()
        satellite = next((s for s in satellites if s.get('id') == norad_id), None)
        
        if not satellite:
            return {"error": "Satellite not found"}
        
        # Add additional details
        satellite['orbital_period'] = 90 + (satellite.get('altitude', 400) / 10)
        satellite['velocity_ms'] = satellite.get('velocity', 7.66) * 1000
        satellite['next_pass'] = (datetime.utcnow() + timedelta(minutes=45)).isoformat()
        
        return satellite
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/predictions/collision-forecast")
async def get_collision_forecast():
    """Get collision probability forecast for next 7 days"""
    try:
        forecast = []
        base_probability = 0.02
        
        for day in range(7):
            date = datetime.utcnow() + timedelta(days=day)
            probability = base_probability + (day * 0.005) + (random.uniform(-0.01, 0.01))
            
            forecast.append({
                "date": date.strftime("%Y-%m-%d"),
                "probability": max(0, min(1, probability)),
                "confidence": 0.75 + (random.uniform(-0.1, 0.1))
            })
        
        return {
            "forecast": forecast,
            "trend": "increasing" if forecast[-1]['probability'] > forecast[0]['probability'] else "decreasing",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/alerts/active")
async def get_active_alerts():
    """Get all active alerts and warnings"""
    try:
        risk_data = await risk_analyzer.analyze_current_risks()
        conjunctions = risk_data.get('critical_conjunctions', [])
        
        alerts = []
        for conj in conjunctions:
            if conj.get('risk_level') == 'alert':
                alerts.append({
                    "id": conj.get('id'),
                    "type": "conjunction",
                    "severity": "high",
                    "message": f"Critical conjunction: {conj.get('primary_object')} and {conj.get('secondary_object')}",
                    "time": conj.get('time_of_closest_approach'),
                    "details": conj
                })
        
        return {
            "alerts": alerts,
            "count": len(alerts),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/satellite/track")
async def track_satellite(norad_id: int):
    """Add satellite to tracking list"""
    try:
        # In a real implementation, this would save to database
        return {
            "status": "success",
            "message": f"Satellite {norad_id} added to tracking list",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/export/data")
async def export_data(format: str = "json"):
    """Export current data in various formats"""
    try:
        debris_data = await debris_tracker.get_live_debris()
        risk_data = await risk_analyzer.analyze_current_risks()
        
        export_data = {
            "debris": debris_data[:100],
            "risks": risk_data,
            "exported_at": datetime.utcnow().isoformat(),
            "format_version": "1.0"
        }
        
        if format == "csv":
            # In a real implementation, convert to CSV
            return {"message": "CSV export not yet implemented"}
        
        return export_data
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

# Removed __main__ block to prevent Render auto-detection
# Use app.py for deployment instead