# 📡 SpaceSense Pro v3.0 - Complete API Reference

## Base URL
```
http://localhost:8006
```

---

## 🤖 Machine Learning Endpoints

### Predict Collision Probability
Predict collision probability using ML model.

**Endpoint**: `GET /api/ml/predict-collision`

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| miss_distance | float | Yes | Distance between objects (km) |
| relative_velocity | float | Yes | Relative velocity (km/s) |
| altitude | float | Yes | Orbital altitude (km) |
| object_size | float | Yes | Object size (meters) |

**Example Request**:
```bash
curl "http://localhost:8006/api/ml/predict-collision?miss_distance=8.5&relative_velocity=12.3&altitude=550&object_size=0.8"
```

**Example Response**:
```json
{
    "probability": 0.0234,
    "confidence": 0.87,
    "risk_level": "medium",
    "contributing_factors": [
        "Close approach distance",
        "High relative velocity"
    ],
    "model_version": "v2.1.0",
    "prediction_timestamp": "2025-11-23T10:30:00"
}
```

---

### Get ML Model Statistics
Get ML model performance metrics.

**Endpoint**: `GET /api/ml/model-stats`

**Parameters**: None

**Example Request**:
```bash
curl "http://localhost:8006/api/ml/model-stats"
```

**Example Response**:
```json
{
    "model_trained": true,
    "training_samples": 100,
    "accuracy": 0.87,
    "precision": 0.89,
    "recall": 0.84,
    "f1_score": 0.86,
    "last_trained": "2025-11-23T10:00:00",
    "model_version": "v2.1.0",
    "features_used": [
        "miss_distance",
        "relative_velocity",
        "altitude",
        "object_size",
        "kinetic_energy"
    ]
}
```

---

## 🔔 Notification Endpoints

### Get Active Notifications
Get all active notifications, optionally filtered by priority.

**Endpoint**: `GET /api/notifications/active`

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| priority | string | No | Filter by priority (critical/high/medium/low) |

**Example Request**:
```bash
curl "http://localhost:8006/api/notifications/active?priority=critical"
```

**Example Response**:
```json
{
    "alerts": [
        {
            "id": "ALERT-00001",
            "type": "critical_conjunction",
            "title": "Critical Conjunction Alert",
            "message": "Objects SAT-1234 and DEB-5678 approaching within 3.2 km",
            "priority": "critical",
            "data": {
                "primary_object": "SAT-1234",
                "secondary_object": "DEB-5678",
                "miss_distance": 3.2
            },
            "created_at": "2025-11-23T10:30:00",
            "status": "active",
            "acknowledged": false,
            "channels": ["websocket", "email", "sms"]
        }
    ],
    "count": 1,
    "timestamp": "2025-11-23T10:35:00"
}
```

---

### Acknowledge Notification
Acknowledge a notification.

**Endpoint**: `POST /api/notifications/acknowledge/{alert_id}`

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| alert_id | string | Yes | Alert ID (path parameter) |

**Example Request**:
```bash
curl -X POST "http://localhost:8006/api/notifications/acknowledge/ALERT-00001"
```

**Example Response**:
```json
{
    "success": true,
    "alert_id": "ALERT-00001",
    "timestamp": "2025-11-23T10:35:00"
}
```

---

### Dismiss Notification
Dismiss a notification.

**Endpoint**: `POST /api/notifications/dismiss/{alert_id}`

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| alert_id | string | Yes | Alert ID (path parameter) |

**Example Request**:
```bash
curl -X POST "http://localhost:8006/api/notifications/dismiss/ALERT-00001"
```

**Example Response**:
```json
{
    "success": true,
    "alert_id": "ALERT-00001",
    "timestamp": "2025-11-23T10:35:00"
}
```

---

### Get Notification History
Get notification history for specified time period.

**Endpoint**: `GET /api/notifications/history`

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| hours | int | No | Time period in hours (default: 24) |

**Example Request**:
```bash
curl "http://localhost:8006/api/notifications/history?hours=48"
```

**Example Response**:
```json
{
    "history": [
        {
            "id": "ALERT-00001",
            "type": "critical_conjunction",
            "title": "Critical Conjunction Alert",
            "priority": "critical",
            "created_at": "2025-11-23T08:30:00",
            "acknowledged": true,
            "acknowledged_at": "2025-11-23T08:35:00"
        }
    ],
    "count": 1,
    "period_hours": 48,
    "timestamp": "2025-11-23T10:35:00"
}
```

---

### Get Notification Statistics
Get notification statistics and metrics.

**Endpoint**: `GET /api/notifications/statistics`

**Parameters**: None

**Example Request**:
```bash
curl "http://localhost:8006/api/notifications/statistics"
```

**Example Response**:
```json
{
    "total_alerts": 45,
    "active_alerts": 3,
    "priority_distribution": {
        "critical": 5,
        "high": 12,
        "medium": 20,
        "low": 8
    },
    "type_distribution": {
        "critical_conjunction": 15,
        "high_collision_probability": 10,
        "high_risk_debris": 12,
        "satellite_maneuver": 5,
        "new_debris_detected": 3
    },
    "average_response_time_seconds": 125.5,
    "acknowledgement_rate": 0.87
}
```

---

## 🛰️ Trajectory Planning Endpoints

### Plan Collision Avoidance Maneuver
Calculate optimal collision avoidance maneuver.

**Endpoint**: `POST /api/trajectory/plan-maneuver`

**Request Body**:
```json
{
    "satellite_id": 25544,
    "threat_id": 34454,
    "miss_distance": 3.2,
    "time_to_conjunction": 6.5
}
```

**Example Request**:
```bash
curl -X POST "http://localhost:8006/api/trajectory/plan-maneuver" \
  -H "Content-Type: application/json" \
  -d '{"satellite_id":25544,"threat_id":34454,"miss_distance":3.2,"time_to_conjunction":6.5}'
```

**Example Response**:
```json
{
    "maneuver_id": "MAN-00001",
    "satellite_id": 25544,
    "threat_id": 34454,
    "maneuver_type": "radial_boost",
    "delta_v": 5.23,
    "delta_v_components": {
        "radial": 5.23,
        "tangential": 0.0,
        "normal": 0.0
    },
    "fuel_required": {
        "fuel_mass_kg": 2.45,
        "percentage_of_total": 0.25,
        "propellant_type": "hydrazine"
    },
    "execution_time": "2025-11-24T10:30:00",
    "duration": 523.0,
    "new_orbit": {
        "altitude_km": 405.23,
        "velocity_km_s": 7.6589,
        "period_minutes": 92.5,
        "altitude_change_km": 5.23
    },
    "safety_margin": 3.5,
    "confidence": 0.92,
    "risk_reduction": 78.5,
    "created_at": "2025-11-23T10:35:00"
}
```

---

### Plan Multi-Threat Avoidance
Plan maneuvers for multiple threats.

**Endpoint**: `POST /api/trajectory/multi-threat`

**Request Body**:
```json
{
    "satellite_id": 25544
}
```

**Example Request**:
```bash
curl -X POST "http://localhost:8006/api/trajectory/multi-threat" \
  -H "Content-Type: application/json" \
  -d '{"satellite_id":25544}'
```

**Example Response**:
```json
{
    "strategy": "sequential_maneuvers",
    "threat_count": 3,
    "planned_maneuvers": [
        {
            "maneuver_id": "MAN-00001",
            "maneuver_type": "radial_boost",
            "delta_v": 5.23
        },
        {
            "maneuver_id": "MAN-00002",
            "maneuver_type": "tangential_boost",
            "delta_v": 3.45
        }
    ],
    "total_delta_v": 8.68,
    "total_fuel_kg": 4.12,
    "execution_timeline": [
        {
            "sequence": 1,
            "maneuver_id": "MAN-00001",
            "execution_time": "2025-11-24T10:30:00",
            "duration_seconds": 523.0,
            "delta_v": 5.23
        }
    ],
    "overall_confidence": 0.89,
    "created_at": "2025-11-23T10:35:00"
}
```

---

### Get Maneuver History
Get maneuver planning history.

**Endpoint**: `GET /api/trajectory/maneuver-history`

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| satellite_id | int | No | Filter by satellite ID |
| hours | int | No | Time period in hours (default: 24) |

**Example Request**:
```bash
curl "http://localhost:8006/api/trajectory/maneuver-history?satellite_id=25544&hours=48"
```

**Example Response**:
```json
{
    "history": [
        {
            "maneuver_id": "MAN-00001",
            "satellite_id": 25544,
            "maneuver_type": "radial_boost",
            "delta_v": 5.23,
            "created_at": "2025-11-23T08:30:00"
        }
    ],
    "count": 1,
    "timestamp": "2025-11-23T10:35:00"
}
```

---

### Get Trajectory Statistics
Get trajectory planning statistics.

**Endpoint**: `GET /api/trajectory/statistics`

**Parameters**: None

**Example Request**:
```bash
curl "http://localhost:8006/api/trajectory/statistics"
```

**Example Response**:
```json
{
    "total_maneuvers": 12,
    "average_delta_v": 5.8,
    "total_fuel_used_kg": 45.2,
    "maneuver_types": {
        "radial_boost": 5,
        "tangential_boost": 3,
        "combined_maneuver": 2,
        "emergency_radial": 1,
        "orbit_change": 1
    },
    "average_confidence": 0.89,
    "average_risk_reduction": 75.3
}
```

---

## 📊 Analytics Endpoints

### Get Comprehensive Analytics
Get complete system analytics in one call.

**Endpoint**: `GET /api/analytics/comprehensive`

**Parameters**: None

**Example Request**:
```bash
curl "http://localhost:8006/api/analytics/comprehensive"
```

**Example Response**:
```json
{
    "debris_tracking": {
        "total_objects": 150,
        "high_risk": 12,
        "medium_risk": 35,
        "low_risk": 103
    },
    "risk_analysis": {
        "total_objects": 150,
        "high_risk_objects": 12,
        "collision_probability": {
            "next_24h": 0.023,
            "next_week": 0.089,
            "next_month": 0.156
        },
        "critical_conjunctions": []
    },
    "ml_predictions": {
        "model_trained": true,
        "training_samples": 100,
        "accuracy": 0.87,
        "model_version": "v2.1.0"
    },
    "notifications": {
        "total_alerts": 45,
        "active_alerts": 3,
        "priority_distribution": {
            "critical": 5,
            "high": 12,
            "medium": 20,
            "low": 8
        }
    },
    "trajectory_planning": {
        "total_maneuvers": 12,
        "average_delta_v": 5.8,
        "total_fuel_used_kg": 45.2
    },
    "system_health": {
        "status": "operational",
        "uptime_hours": 245.3,
        "api_response_time_ms": 23.5,
        "data_freshness_minutes": 2.1
    },
    "timestamp": "2025-11-23T10:35:00"
}
```

---

## 🌍 Original Endpoints (Still Available)

### Get Live Debris Data
**Endpoint**: `GET /api/debris/live`

### Get Risk Analysis
**Endpoint**: `GET /api/risk/analysis`

### Get Tracked Satellites
**Endpoint**: `GET /api/satellites/tracked`

### Get AI Insights
**Endpoint**: `GET /api/ai/insights`

### Get Statistics Overview
**Endpoint**: `GET /api/statistics/overview`

### Get Debris Heatmap
**Endpoint**: `GET /api/debris/heatmap`

### Get Satellite Details
**Endpoint**: `GET /api/satellites/details/{norad_id}`

### Get Collision Forecast
**Endpoint**: `GET /api/predictions/collision-forecast`

### Get Active Alerts
**Endpoint**: `GET /api/alerts/active`

### Export Data
**Endpoint**: `GET /api/export/data?format={format}`

### Health Check
**Endpoint**: `GET /health`

### WebSocket Connection
**Endpoint**: `WS /ws`

---

## 🔐 Authentication

Currently, no authentication is required. All endpoints are publicly accessible.

**Future**: JWT-based authentication will be added in v4.0.

---

## ⚠️ Error Handling

All endpoints return errors in this format:

```json
{
    "error": "Error message description"
}
```

**HTTP Status Codes**:
- `200`: Success
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

---

## 📊 Rate Limiting

Currently, no rate limiting is implemented.

**Future**: Rate limiting will be added in v4.0:
- Free tier: 100 requests/minute
- Pro tier: 1000 requests/minute
- Enterprise: Unlimited

---

## 🔄 WebSocket Events

### Connection
```javascript
const ws = new WebSocket('ws://localhost:8006/ws');
```

### Events Received
- `initial_data`: Initial data load
- `live_update`: Real-time updates
- `status_update`: Connection status
- `alert`: Critical alerts

---

## 📝 Request Examples

### JavaScript (Fetch API)
```javascript
// ML Prediction
const response = await fetch('/api/ml/predict-collision?miss_distance=8.5&relative_velocity=12.3&altitude=550&object_size=0.8');
const prediction = await response.json();

// Plan Maneuver
const response = await fetch('/api/trajectory/plan-maneuver', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        satellite_id: 25544,
        threat_id: 34454,
        miss_distance: 3.2,
        time_to_conjunction: 6.5
    })
});
const maneuver = await response.json();
```

### Python (requests)
```python
import requests

# ML Prediction
response = requests.get(
    'http://localhost:8006/api/ml/predict-collision',
    params={
        'miss_distance': 8.5,
        'relative_velocity': 12.3,
        'altitude': 550,
        'object_size': 0.8
    }
)
prediction = response.json()

# Plan Maneuver
response = requests.post(
    'http://localhost:8006/api/trajectory/plan-maneuver',
    json={
        'satellite_id': 25544,
        'threat_id': 34454,
        'miss_distance': 3.2,
        'time_to_conjunction': 6.5
    }
)
maneuver = response.json()
```

### cURL
```bash
# ML Prediction
curl "http://localhost:8006/api/ml/predict-collision?miss_distance=8.5&relative_velocity=12.3&altitude=550&object_size=0.8"

# Plan Maneuver
curl -X POST "http://localhost:8006/api/trajectory/plan-maneuver" \
  -H "Content-Type: application/json" \
  -d '{"satellite_id":25544,"threat_id":34454,"miss_distance":3.2,"time_to_conjunction":6.5}'
```

---

## 📚 Additional Resources

- [ADVANCED_FEATURES.md](ADVANCED_FEATURES.md) - Feature documentation
- [QUICK_START_V3.md](QUICK_START_V3.md) - Quick start guide
- [IMPROVEMENTS_SUMMARY.md](IMPROVEMENTS_SUMMARY.md) - What's new
- [README.md](README.md) - Main documentation

---

**Version**: 3.0.0-advanced  
**Total Endpoints**: 27  
**New Endpoints**: 12  
**Status**: Production Ready 🚀
