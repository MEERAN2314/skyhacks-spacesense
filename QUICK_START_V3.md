# 🚀 SpaceSense Pro v3.0 - Quick Start Guide

## ⚡ Instant Setup (2 Minutes)

```bash
# 1. Install dependencies (if not already done)
pip install -r requirements.txt

# 2. Run the application
python run.py

# 3. Open browser
# http://localhost:8006
```

That's it! All new features work immediately with zero configuration! 🎉

---

## 🆕 New Features Demo

### 1. ML Collision Prediction

**Try it in your browser console:**
```javascript
// Predict collision probability
const response = await fetch('/api/ml/predict-collision?miss_distance=8.5&relative_velocity=12.3&altitude=550&object_size=0.8');
const prediction = await response.json();

console.log('Collision Probability:', (prediction.probability * 100).toFixed(4) + '%');
console.log('Confidence:', (prediction.confidence * 100).toFixed(2) + '%');
console.log('Risk Level:', prediction.risk_level);
console.log('Contributing Factors:', prediction.contributing_factors);
```

**Expected Output:**
```json
{
    "probability": 0.0234,
    "confidence": 0.87,
    "risk_level": "medium",
    "contributing_factors": [
        "Close approach distance",
        "High relative velocity"
    ],
    "model_version": "v2.1.0"
}
```

---

### 2. Notification System

**Get active notifications:**
```javascript
const response = await fetch('/api/notifications/active');
const data = await response.json();

console.log('Active Alerts:', data.count);
data.alerts.forEach(alert => {
    console.log(`[${alert.priority}] ${alert.title}: ${alert.message}`);
});
```

**Acknowledge an alert:**
```javascript
await fetch('/api/notifications/acknowledge/ALERT-00001', {
    method: 'POST'
});
console.log('Alert acknowledged!');
```

**Get notification statistics:**
```javascript
const response = await fetch('/api/notifications/statistics');
const stats = await response.json();

console.log('Total Alerts:', stats.total_alerts);
console.log('Active Alerts:', stats.active_alerts);
console.log('Priority Distribution:', stats.priority_distribution);
console.log('Average Response Time:', stats.average_response_time_seconds + 's');
```

---

### 3. Trajectory Planning

**Plan a collision avoidance maneuver:**
```javascript
const response = await fetch('/api/trajectory/plan-maneuver', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        satellite_id: 25544,  // ISS
        threat_id: 34454,     // Debris
        miss_distance: 3.2,   // km
        time_to_conjunction: 6.5  // hours
    })
});

const maneuver = await response.json();

console.log('Maneuver ID:', maneuver.maneuver_id);
console.log('Type:', maneuver.maneuver_type);
console.log('Delta-V Required:', maneuver.delta_v + ' m/s');
console.log('Fuel Required:', maneuver.fuel_required.fuel_mass_kg + ' kg');
console.log('Execution Time:', maneuver.execution_time);
console.log('Safety Margin:', maneuver.safety_margin + ' km');
console.log('Confidence:', (maneuver.confidence * 100).toFixed(2) + '%');
console.log('Risk Reduction:', maneuver.risk_reduction + '%');
```

**Expected Output:**
```json
{
    "maneuver_id": "MAN-00001",
    "maneuver_type": "radial_boost",
    "delta_v": 5.23,
    "fuel_required": {
        "fuel_mass_kg": 2.45,
        "percentage_of_total": 0.25,
        "propellant_type": "hydrazine"
    },
    "execution_time": "2025-11-24T10:30:00",
    "safety_margin": 3.5,
    "confidence": 0.92,
    "risk_reduction": 78.5
}
```

---

### 4. Comprehensive Analytics

**Get complete system analytics:**
```javascript
const response = await fetch('/api/analytics/comprehensive');
const analytics = await response.json();

console.log('=== SYSTEM OVERVIEW ===');
console.log('Status:', analytics.system_health.status);
console.log('Uptime:', analytics.system_health.uptime_hours.toFixed(1) + ' hours');
console.log('API Response Time:', analytics.system_health.api_response_time_ms.toFixed(1) + ' ms');

console.log('\n=== DEBRIS TRACKING ===');
console.log('Total Objects:', analytics.debris_tracking.total_objects);
console.log('High Risk:', analytics.debris_tracking.high_risk);
console.log('Medium Risk:', analytics.debris_tracking.medium_risk);
console.log('Low Risk:', analytics.debris_tracking.low_risk);

console.log('\n=== ML PREDICTIONS ===');
console.log('Model Accuracy:', (analytics.ml_predictions.accuracy * 100).toFixed(1) + '%');
console.log('Training Samples:', analytics.ml_predictions.training_samples);
console.log('Model Version:', analytics.ml_predictions.model_version);

console.log('\n=== NOTIFICATIONS ===');
console.log('Total Alerts:', analytics.notifications.total_alerts);
console.log('Active Alerts:', analytics.notifications.active_alerts);
console.log('Acknowledgement Rate:', (analytics.notifications.acknowledgement_rate * 100).toFixed(1) + '%');

console.log('\n=== TRAJECTORY PLANNING ===');
console.log('Total Maneuvers:', analytics.trajectory_planning.total_maneuvers);
console.log('Average Delta-V:', analytics.trajectory_planning.average_delta_v + ' m/s');
console.log('Total Fuel Used:', analytics.trajectory_planning.total_fuel_used_kg + ' kg');
```

---

## 🎯 Complete Workflow Example

**Scenario: Detect threat, predict collision, plan maneuver**

```javascript
async function handleSpaceThreat() {
    // 1. Get comprehensive analytics
    const analyticsRes = await fetch('/api/analytics/comprehensive');
    const analytics = await analyticsRes.json();
    
    console.log('System Status:', analytics.system_health.status);
    
    // 2. Check for critical alerts
    const alertsRes = await fetch('/api/notifications/active?priority=critical');
    const alerts = await alertsRes.json();
    
    if (alerts.count > 0) {
        console.log(`⚠️  ${alerts.count} critical alerts detected!`);
        
        for (const alert of alerts.alerts) {
            console.log(`\n🚨 Alert: ${alert.title}`);
            console.log(`   Message: ${alert.message}`);
            
            // 3. Get ML prediction for the threat
            const predictionRes = await fetch(
                `/api/ml/predict-collision?miss_distance=3.2&relative_velocity=12.5&altitude=400&object_size=0.5`
            );
            const prediction = await predictionRes.json();
            
            console.log(`\n🤖 ML Prediction:`);
            console.log(`   Probability: ${(prediction.probability * 100).toFixed(4)}%`);
            console.log(`   Risk Level: ${prediction.risk_level}`);
            console.log(`   Confidence: ${(prediction.confidence * 100).toFixed(2)}%`);
            
            // 4. If high risk, plan avoidance maneuver
            if (prediction.risk_level === 'high' || prediction.risk_level === 'critical') {
                console.log(`\n🛰️  Planning collision avoidance maneuver...`);
                
                const maneuverRes = await fetch('/api/trajectory/plan-maneuver', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        satellite_id: 25544,
                        threat_id: 34454,
                        miss_distance: 3.2,
                        time_to_conjunction: 6.5
                    })
                });
                
                const maneuver = await maneuverRes.json();
                
                console.log(`\n✅ Maneuver Planned:`);
                console.log(`   ID: ${maneuver.maneuver_id}`);
                console.log(`   Type: ${maneuver.maneuver_type}`);
                console.log(`   Delta-V: ${maneuver.delta_v} m/s`);
                console.log(`   Fuel: ${maneuver.fuel_required.fuel_mass_kg} kg`);
                console.log(`   Execute at: ${maneuver.execution_time}`);
                console.log(`   Safety Margin: ${maneuver.safety_margin} km`);
                console.log(`   Risk Reduction: ${maneuver.risk_reduction}%`);
                
                // 5. Acknowledge the alert
                await fetch(`/api/notifications/acknowledge/${alert.id}`, {
                    method: 'POST'
                });
                
                console.log(`\n✓ Alert acknowledged`);
            }
        }
    } else {
        console.log('✅ No critical alerts - All systems nominal');
    }
}

// Run the workflow
handleSpaceThreat();
```

---

## 🎨 Frontend Integration

**Add to your HTML:**
```html
<!-- In <head> -->
<link rel="stylesheet" href="/static/css/advanced-features.css">

<!-- Before </body> -->
<script src="/static/js/advanced-analytics.js"></script>

<!-- Add containers -->
<div id="systemHealth"></div>
<div id="mlStatsContainer"></div>
<div id="notificationsContainer"></div>
<div id="trajectoryStatsContainer"></div>
<div id="collisionPredictionResult"></div>
```

**The JavaScript will automatically:**
- Load all analytics on page load
- Display ML model statistics
- Show active notifications
- Update trajectory statistics
- Auto-refresh every 30 seconds

---

## 📊 Monitoring Dashboard

**Create a simple monitoring page:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>SpaceSense Monitoring</title>
    <link rel="stylesheet" href="/static/css/advanced-features.css">
</head>
<body>
    <h1>SpaceSense Pro Monitoring</h1>
    
    <section>
        <h2>System Health</h2>
        <div id="systemHealth"></div>
    </section>
    
    <section>
        <h2>ML Model Performance</h2>
        <div id="mlStatsContainer"></div>
    </section>
    
    <section>
        <h2>Active Notifications</h2>
        <div id="notificationsContainer"></div>
    </section>
    
    <section>
        <h2>Trajectory Planning</h2>
        <div id="trajectoryStatsContainer"></div>
    </section>
    
    <script src="/static/js/advanced-analytics.js"></script>
</body>
</html>
```

---

## 🔧 Configuration (Optional)

All features work out of the box with zero configuration! But you can customize:

**Adjust update intervals:**
```javascript
// In advanced-analytics.js
setupAutoRefresh() {
    // Change from 30 seconds to 60 seconds
    this.updateInterval = setInterval(() => {
        this.loadAllAnalytics();
    }, 60000);  // 60 seconds
}
```

**Customize notification priorities:**
```python
# In src/notification_system.py
def _initialize_alert_rules(self):
    return {
        "critical_conjunction": {
            "threshold": 3.0,  # Change from 5.0 to 3.0 km
            "priority": "critical",
            "channels": ["websocket", "email", "sms"]
        }
    }
```

---

## 🎯 Testing the Features

**1. Test ML Predictor:**
```bash
curl "http://localhost:8006/api/ml/predict-collision?miss_distance=5&relative_velocity=10&altitude=500&object_size=1"
```

**2. Test Notifications:**
```bash
curl "http://localhost:8006/api/notifications/active"
curl "http://localhost:8006/api/notifications/statistics"
```

**3. Test Trajectory Planning:**
```bash
curl -X POST "http://localhost:8006/api/trajectory/plan-maneuver" \
  -H "Content-Type: application/json" \
  -d '{"satellite_id":25544,"threat_id":34454,"miss_distance":3.2,"time_to_conjunction":6.5}'
```

**4. Test Comprehensive Analytics:**
```bash
curl "http://localhost:8006/api/analytics/comprehensive"
```

---

## 🚀 Performance Tips

1. **Use batch predictions** for multiple objects
2. **Cache notification history** to reduce API calls
3. **Adjust auto-refresh interval** based on needs
4. **Filter notifications by priority** for better performance
5. **Use WebSocket** for real-time updates instead of polling

---

## 🐛 Troubleshooting

**ML predictions returning errors?**
- Check input parameters are valid numbers
- Ensure miss_distance > 0
- Verify altitude is between 200-50000 km

**Notifications not showing?**
- Check WebSocket connection
- Verify alerts are being generated
- Look for JavaScript console errors

**Trajectory planning fails?**
- Ensure satellite_id and threat_id are valid
- Check time_to_conjunction > 0
- Verify miss_distance is reasonable

---

## 📚 Next Steps

1. **Read**: [ADVANCED_FEATURES.md](ADVANCED_FEATURES.md) for complete documentation
2. **Explore**: Try all API endpoints in your browser console
3. **Customize**: Modify thresholds and parameters
4. **Integrate**: Add features to your dashboard
5. **Deploy**: Use the same deployment process as before

---

## 🎉 You're Ready!

SpaceSense Pro v3.0 is now running with:
- ✅ ML collision prediction
- ✅ Advanced notifications
- ✅ Trajectory planning
- ✅ Comprehensive analytics
- ✅ Real-time monitoring

**Start exploring the new features!** 🚀

---

**Questions?** Check the [ADVANCED_FEATURES.md](ADVANCED_FEATURES.md) documentation.

**Version**: 3.0.0-advanced  
**Status**: Production Ready 🚀
