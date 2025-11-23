"""
Advanced Notification and Alert System
Multi-channel notifications for critical events
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional
import asyncio
import json

class NotificationSystem:
    """Advanced notification and alert management"""
    
    def __init__(self):
        self.active_alerts = []
        self.alert_history = []
        self.subscribers = []
        self.alert_rules = self._initialize_alert_rules()
        
    def _initialize_alert_rules(self) -> Dict:
        """Initialize alert rules and thresholds"""
        return {
            "critical_conjunction": {
                "threshold": 5.0,  # km
                "priority": "critical",
                "channels": ["websocket", "email", "sms"]
            },
            "high_risk_debris": {
                "threshold": 10.0,  # km
                "priority": "high",
                "channels": ["websocket", "email"]
            },
            "collision_probability": {
                "threshold": 0.01,  # 1%
                "priority": "high",
                "channels": ["websocket", "email"]
            },
            "satellite_maneuver": {
                "priority": "medium",
                "channels": ["websocket"]
            },
            "new_debris_detected": {
                "priority": "medium",
                "channels": ["websocket"]
            }
        }
    
    async def check_and_create_alerts(self, debris_data: List[Dict], 
                                     risk_data: Dict) -> List[Dict]:
        """Check conditions and create alerts"""
        new_alerts = []
        
        # Check critical conjunctions
        if "critical_conjunctions" in risk_data:
            for conj in risk_data["critical_conjunctions"]:
                if conj.get("miss_distance", 999) < 5.0:
                    alert = await self.create_alert(
                        alert_type="critical_conjunction",
                        title="Critical Conjunction Alert",
                        message=f"Objects {conj.get('primary_object')} and {conj.get('secondary_object')} approaching within {conj.get('miss_distance'):.2f} km",
                        data=conj,
                        priority="critical"
                    )
                    new_alerts.append(alert)
        
        # Check collision probability
        if risk_data.get("collision_probability", {}).get("next_24h", 0) > 0.01:
            alert = await self.create_alert(
                alert_type="high_collision_probability",
                title="Elevated Collision Risk",
                message=f"Collision probability elevated to {risk_data['collision_probability']['next_24h']*100:.2f}% in next 24 hours",
                data=risk_data["collision_probability"],
                priority="high"
            )
            new_alerts.append(alert)
        
        # Check high-risk debris count
        if risk_data.get("high_risk_objects", 0) > 15:
            alert = await self.create_alert(
                alert_type="high_risk_debris",
                title="High Risk Debris Alert",
                message=f"{risk_data['high_risk_objects']} high-risk objects detected",
                data={"count": risk_data["high_risk_objects"]},
                priority="medium"
            )
            new_alerts.append(alert)
        
        return new_alerts
    
    async def create_alert(self, alert_type: str, title: str, 
                          message: str, data: Dict, 
                          priority: str = "medium") -> Dict:
        """Create a new alert"""
        alert = {
            "id": f"ALERT-{len(self.alert_history) + 1:05d}",
            "type": alert_type,
            "title": title,
            "message": message,
            "priority": priority,
            "data": data,
            "created_at": datetime.utcnow().isoformat(),
            "status": "active",
            "acknowledged": False,
            "channels": self.alert_rules.get(alert_type, {}).get("channels", ["websocket"])
        }
        
        self.active_alerts.append(alert)
        self.alert_history.append(alert)
        
        # Trigger notifications
        await self.send_notifications(alert)
        
        return alert
    
    async def send_notifications(self, alert: Dict):
        """Send notifications through configured channels"""
        channels = alert.get("channels", ["websocket"])
        
        for channel in channels:
            if channel == "websocket":
                await self._send_websocket_notification(alert)
            elif channel == "email":
                await self._send_email_notification(alert)
            elif channel == "sms":
                await self._send_sms_notification(alert)
    
    async def _send_websocket_notification(self, alert: Dict):
        """Send WebSocket notification"""
        # This will be handled by the WebSocket manager
        print(f"📡 WebSocket notification: {alert['title']}")
    
    async def _send_email_notification(self, alert: Dict):
        """Send email notification (simulated)"""
        print(f"📧 Email notification: {alert['title']}")
        # In production, integrate with SendGrid, AWS SES, etc.
    
    async def _send_sms_notification(self, alert: Dict):
        """Send SMS notification (simulated)"""
        print(f"📱 SMS notification: {alert['title']}")
        # In production, integrate with Twilio, AWS SNS, etc.
    
    async def acknowledge_alert(self, alert_id: str, user_id: str = "system") -> bool:
        """Acknowledge an alert"""
        for alert in self.active_alerts:
            if alert["id"] == alert_id:
                alert["acknowledged"] = True
                alert["acknowledged_by"] = user_id
                alert["acknowledged_at"] = datetime.utcnow().isoformat()
                return True
        return False
    
    async def dismiss_alert(self, alert_id: str) -> bool:
        """Dismiss an alert"""
        for i, alert in enumerate(self.active_alerts):
            if alert["id"] == alert_id:
                alert["status"] = "dismissed"
                alert["dismissed_at"] = datetime.utcnow().isoformat()
                self.active_alerts.pop(i)
                return True
        return False
    
    async def get_active_alerts(self, priority: Optional[str] = None) -> List[Dict]:
        """Get active alerts, optionally filtered by priority"""
        if priority:
            return [a for a in self.active_alerts if a["priority"] == priority]
        return self.active_alerts
    
    async def get_alert_history(self, hours: int = 24) -> List[Dict]:
        """Get alert history for specified time period"""
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)
        
        return [
            alert for alert in self.alert_history
            if datetime.fromisoformat(alert["created_at"]) > cutoff_time
        ]
    
    async def get_alert_statistics(self) -> Dict:
        """Get alert statistics"""
        total_alerts = len(self.alert_history)
        active_count = len(self.active_alerts)
        
        # Count by priority
        priority_counts = {
            "critical": len([a for a in self.alert_history if a["priority"] == "critical"]),
            "high": len([a for a in self.alert_history if a["priority"] == "high"]),
            "medium": len([a for a in self.alert_history if a["priority"] == "medium"]),
            "low": len([a for a in self.alert_history if a["priority"] == "low"])
        }
        
        # Count by type
        type_counts = {}
        for alert in self.alert_history:
            alert_type = alert["type"]
            type_counts[alert_type] = type_counts.get(alert_type, 0) + 1
        
        # Calculate response times
        acknowledged_alerts = [a for a in self.alert_history if a.get("acknowledged")]
        avg_response_time = 0
        if acknowledged_alerts:
            response_times = []
            for alert in acknowledged_alerts:
                created = datetime.fromisoformat(alert["created_at"])
                acked = datetime.fromisoformat(alert["acknowledged_at"])
                response_times.append((acked - created).total_seconds())
            avg_response_time = sum(response_times) / len(response_times)
        
        return {
            "total_alerts": total_alerts,
            "active_alerts": active_count,
            "priority_distribution": priority_counts,
            "type_distribution": type_counts,
            "average_response_time_seconds": round(avg_response_time, 2),
            "acknowledgement_rate": len(acknowledged_alerts) / total_alerts if total_alerts > 0 else 0
        }
    
    async def subscribe(self, subscriber_id: str, channels: List[str], 
                       filters: Optional[Dict] = None):
        """Subscribe to notifications"""
        subscription = {
            "subscriber_id": subscriber_id,
            "channels": channels,
            "filters": filters or {},
            "subscribed_at": datetime.utcnow().isoformat(),
            "active": True
        }
        self.subscribers.append(subscription)
        return subscription
    
    async def unsubscribe(self, subscriber_id: str) -> bool:
        """Unsubscribe from notifications"""
        for i, sub in enumerate(self.subscribers):
            if sub["subscriber_id"] == subscriber_id:
                self.subscribers.pop(i)
                return True
        return False

# Global instance
notification_system = NotificationSystem()
