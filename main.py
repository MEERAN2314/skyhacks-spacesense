from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse, FileResponse
import json
import asyncio
import random
from datetime import datetime, timedelta
from typing import List
import uvicorn
import io
import csv

from src.debris_tracker import DebrisTracker
from src.risk_analyzer import RiskAnalyzer
from src.ai_insights import AIInsights
from src.websocket_manager import ConnectionManager
from src.ml_predictor import ml_predictor
from src.notification_system import notification_system
from src.trajectory_planner import trajectory_planner

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
    await ml_predictor.initialize()
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
async def export_data_endpoint(format: str = "json"):
    """Export current data in various formats with proper download headers"""
    try:
        print(f"📤 Export endpoint called with format: {format}")
        
        debris_data = await debris_tracker.get_live_debris()
        risk_data = await risk_analyzer.analyze_current_risks()
        ai_data = await ai_insights.generate_insights()
        
        response_data = {
            "debris": debris_data[:100],
            "risks": risk_data,
            "ai_insights": ai_data,
            "exported_at": datetime.utcnow().isoformat(),
            "format_version": "1.0",
            "total_objects": len(debris_data)
        }
        
        print(f"✅ Export data prepared: {len(debris_data)} debris objects")
        
        # Return JSON with proper CORS headers to allow frontend download
        return JSONResponse(
            content=response_data,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Cache-Control": "no-cache"
            }
        )
        
    except Exception as e:
        print(f"❌ Export error: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(
            content={"error": str(e), "details": "Check server logs for more information"},
            status_code=500
        )

@app.get("/api/export/download/{format}")
async def download_export(format: str):
    """Direct download endpoint for exports with proper file response"""
    try:
        print(f"📥 Download endpoint called with format: {format}")
        
        debris_data = await debris_tracker.get_live_debris()
        risk_data = await risk_analyzer.analyze_current_risks()
        ai_data = await ai_insights.generate_insights()
        
        timestamp = datetime.utcnow().strftime("%Y-%m-%d")
        
        if format == "json":
            response_data = {
                "debris": debris_data[:100],
                "risks": risk_data,
                "ai_insights": ai_data,
                "exported_at": datetime.utcnow().isoformat(),
                "format_version": "1.0",
                "total_objects": len(debris_data)
            }
            
            content = json.dumps(response_data, indent=2)
            filename = f"spacesense-pro-data-{timestamp}.json"
            media_type = "application/json"
            
        elif format == "csv":
            # Create CSV content
            output = io.StringIO()
            writer = csv.writer(output)
            
            # Write header
            writer.writerow(['Name', 'Type', 'Latitude', 'Longitude', 'Altitude', 'Risk Level'])
            
            # Write data
            for item in debris_data[:100]:
                writer.writerow([
                    item.get('name', 'Unknown'),
                    item.get('object_type', 'N/A'),
                    item.get('latitude', 0),
                    item.get('longitude', 0),
                    item.get('altitude', 0),
                    item.get('risk_level', 'unknown')
                ])
            
            content = output.getvalue()
            filename = f"spacesense-pro-data-{timestamp}.csv"
            media_type = "text/csv"
            
        else:
            return JSONResponse(
                content={"error": f"Unsupported format: {format}"},
                status_code=400
            )
        
        print(f"✅ Download prepared: {filename} ({len(content)} bytes)")
        
        return StreamingResponse(
            io.BytesIO(content.encode('utf-8')),
            media_type=media_type,
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-cache"
            }
        )
        
    except Exception as e:
        print(f"❌ Download error: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )

@app.get("/api/ml/predict-collision")
async def predict_collision(
    miss_distance: float = 10.0,
    relative_velocity: float = 7.5,
    altitude: float = 500.0,
    object_size: float = 0.5
):
    """ML-based collision probability prediction"""
    try:
        prediction = await ml_predictor.predict_collision_probability(
            miss_distance, relative_velocity, altitude, object_size
        )
        return prediction
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/ml/model-stats")
async def get_ml_model_stats():
    """Get ML model statistics"""
    try:
        stats = await ml_predictor.get_model_stats()
        return stats
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/notifications/active")
async def get_active_notifications(priority: str = None):
    """Get active notifications"""
    try:
        alerts = await notification_system.get_active_alerts(priority)
        return {
            "alerts": alerts,
            "count": len(alerts),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/notifications/acknowledge/{alert_id}")
async def acknowledge_notification(alert_id: str):
    """Acknowledge a notification"""
    try:
        success = await notification_system.acknowledge_alert(alert_id)
        return {
            "success": success,
            "alert_id": alert_id,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/notifications/dismiss/{alert_id}")
async def dismiss_notification(alert_id: str):
    """Dismiss a notification"""
    try:
        success = await notification_system.dismiss_alert(alert_id)
        return {
            "success": success,
            "alert_id": alert_id,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/notifications/history")
async def get_notification_history(hours: int = 24):
    """Get notification history"""
    try:
        history = await notification_system.get_alert_history(hours)
        return {
            "history": history,
            "count": len(history),
            "period_hours": hours,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/notifications/statistics")
async def get_notification_statistics():
    """Get notification statistics"""
    try:
        stats = await notification_system.get_alert_statistics()
        return stats
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/trajectory/plan-maneuver")
async def plan_collision_avoidance(
    satellite_id: int,
    threat_id: int,
    miss_distance: float,
    time_to_conjunction: float
):
    """Plan collision avoidance maneuver"""
    try:
        satellite = {"id": satellite_id, "altitude": 400, "velocity": 7.66, "mass": 1000}
        threat = {"id": threat_id, "altitude": 420, "miss_distance": miss_distance}
        
        maneuver = await trajectory_planner.calculate_avoidance_maneuver(
            satellite, threat, time_to_conjunction
        )
        return maneuver
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/trajectory/maneuver-history")
async def get_maneuver_history(satellite_id: int = None, hours: int = 24):
    """Get maneuver planning history"""
    try:
        history = await trajectory_planner.get_maneuver_history(
            str(satellite_id) if satellite_id else None, hours
        )
        return {
            "history": history,
            "count": len(history),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/trajectory/statistics")
async def get_trajectory_statistics():
    """Get trajectory planning statistics"""
    try:
        stats = await trajectory_planner.get_maneuver_statistics()
        return stats
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/trajectory/multi-threat")
async def plan_multi_threat_avoidance(satellite_id: int):
    """Plan maneuvers for multiple threats"""
    try:
        # Get current threats for satellite
        risk_data = await risk_analyzer.analyze_current_risks()
        threats = risk_data.get("critical_conjunctions", [])[:3]
        
        satellite = {"id": satellite_id, "altitude": 400, "velocity": 7.66, "mass": 1000}
        
        # Add time_to_closest_approach to threats
        for threat in threats:
            threat["time_to_closest_approach"] = random.uniform(2, 48)
        
        strategy = await trajectory_planner.plan_multi_threat_avoidance(satellite, threats)
        return strategy
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/analytics/comprehensive")
async def get_comprehensive_analytics():
    """Get comprehensive analytics dashboard"""
    try:
        debris_data = await debris_tracker.get_live_debris()
        risk_data = await risk_analyzer.analyze_current_risks()
        ml_stats = await ml_predictor.get_model_stats()
        notification_stats = await notification_system.get_alert_statistics()
        trajectory_stats = await trajectory_planner.get_maneuver_statistics()
        
        return {
            "debris_tracking": {
                "total_objects": len(debris_data),
                "high_risk": len([d for d in debris_data if d.get("risk_level") == "high"]),
                "medium_risk": len([d for d in debris_data if d.get("risk_level") == "medium"]),
                "low_risk": len([d for d in debris_data if d.get("risk_level") == "low"])
            },
            "risk_analysis": risk_data,
            "ml_predictions": ml_stats,
            "notifications": notification_stats,
            "trajectory_planning": trajectory_stats,
            "system_health": {
                "status": "operational",
                "uptime_hours": random.uniform(100, 1000),
                "api_response_time_ms": random.uniform(10, 50),
                "data_freshness_minutes": random.uniform(1, 5)
            },
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

# Removed __main__ block to prevent Render auto-detection
# Use app.py for deployment instead