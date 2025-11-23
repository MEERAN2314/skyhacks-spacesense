"""
Satellite Trajectory Planning and Collision Avoidance
Calculates optimal maneuvers to avoid collisions
"""

import math
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
import random

class TrajectoryPlanner:
    """Advanced trajectory planning for collision avoidance"""
    
    def __init__(self):
        self.earth_radius = 6371.0  # km
        self.mu = 398600.4418  # Earth's gravitational parameter (km³/s²)
        self.maneuver_history = []
        
    async def calculate_avoidance_maneuver(self, 
                                          satellite: Dict,
                                          threat: Dict,
                                          time_to_conjunction: float) -> Dict:
        """Calculate optimal collision avoidance maneuver"""
        
        # Extract orbital parameters
        sat_altitude = satellite.get("altitude", 400)
        sat_velocity = satellite.get("velocity", 7.66)
        
        threat_altitude = threat.get("altitude", 400)
        miss_distance = threat.get("miss_distance", 10.0)
        
        # Calculate required delta-v
        delta_v = self._calculate_delta_v(miss_distance, time_to_conjunction)
        
        # Determine maneuver type
        maneuver_type = self._select_maneuver_type(delta_v, time_to_conjunction)
        
        # Calculate maneuver parameters
        maneuver = {
            "maneuver_id": f"MAN-{len(self.maneuver_history) + 1:05d}",
            "satellite_id": satellite.get("id"),
            "threat_id": threat.get("id"),
            "maneuver_type": maneuver_type,
            "delta_v": round(delta_v, 4),  # m/s
            "delta_v_components": self._calculate_delta_v_components(delta_v, maneuver_type),
            "fuel_required": self._calculate_fuel_requirement(delta_v, satellite.get("mass", 1000)),
            "execution_time": self._calculate_execution_time(time_to_conjunction),
            "duration": self._calculate_maneuver_duration(delta_v),
            "new_orbit": self._calculate_new_orbit(sat_altitude, delta_v, maneuver_type),
            "safety_margin": self._calculate_safety_margin(miss_distance, delta_v),
            "confidence": self._calculate_maneuver_confidence(time_to_conjunction, delta_v),
            "risk_reduction": self._calculate_risk_reduction(miss_distance, delta_v),
            "created_at": datetime.utcnow().isoformat()
        }
        
        self.maneuver_history.append(maneuver)
        return maneuver
    
    def _calculate_delta_v(self, miss_distance: float, time_to_conjunction: float) -> float:
        """Calculate required delta-v for safe separation"""
        # Minimum safe distance (km)
        safe_distance = 5.0
        
        # Required separation increase
        required_separation = max(0, safe_distance - miss_distance)
        
        # Time available (convert hours to seconds)
        time_available = time_to_conjunction * 3600
        
        # Calculate delta-v (m/s)
        if time_available > 0:
            delta_v = (required_separation * 1000) / time_available
        else:
            delta_v = 10.0  # Emergency maneuver
        
        # Add safety factor
        delta_v *= 1.2
        
        return min(delta_v, 50.0)  # Cap at 50 m/s
    
    def _select_maneuver_type(self, delta_v: float, time_to_conjunction: float) -> str:
        """Select optimal maneuver type"""
        if time_to_conjunction < 2:  # Less than 2 hours
            return "emergency_radial"
        elif delta_v < 1.0:
            return "tangential_boost"
        elif delta_v < 5.0:
            return "radial_boost"
        elif delta_v < 15.0:
            return "combined_maneuver"
        else:
            return "orbit_change"
    
    def _calculate_delta_v_components(self, delta_v: float, maneuver_type: str) -> Dict:
        """Calculate delta-v components in different directions"""
        if maneuver_type == "tangential_boost":
            return {
                "radial": 0.0,
                "tangential": delta_v,
                "normal": 0.0
            }
        elif maneuver_type == "radial_boost":
            return {
                "radial": delta_v,
                "tangential": 0.0,
                "normal": 0.0
            }
        elif maneuver_type == "combined_maneuver":
            return {
                "radial": delta_v * 0.6,
                "tangential": delta_v * 0.4,
                "normal": 0.0
            }
        elif maneuver_type == "emergency_radial":
            return {
                "radial": delta_v * 0.8,
                "tangential": delta_v * 0.2,
                "normal": 0.0
            }
        else:  # orbit_change
            return {
                "radial": delta_v * 0.5,
                "tangential": delta_v * 0.4,
                "normal": delta_v * 0.1
            }
    
    def _calculate_fuel_requirement(self, delta_v: float, satellite_mass: float) -> Dict:
        """Calculate fuel requirement for maneuver"""
        # Specific impulse (typical for hydrazine thrusters)
        isp = 220  # seconds
        g0 = 9.81  # m/s²
        
        # Rocket equation: Δv = Isp * g0 * ln(m0/m1)
        mass_ratio = math.exp(delta_v / (isp * g0))
        fuel_mass = satellite_mass * (mass_ratio - 1)
        
        return {
            "fuel_mass_kg": round(fuel_mass, 2),
            "percentage_of_total": round((fuel_mass / satellite_mass) * 100, 2),
            "propellant_type": "hydrazine"
        }
    
    def _calculate_execution_time(self, time_to_conjunction: float) -> str:
        """Calculate optimal execution time"""
        # Execute maneuver at 50% of time to conjunction
        execution_delay = time_to_conjunction * 0.5
        execution_time = datetime.utcnow() + timedelta(hours=execution_delay)
        return execution_time.isoformat()
    
    def _calculate_maneuver_duration(self, delta_v: float) -> float:
        """Calculate maneuver duration in seconds"""
        # Typical thrust acceleration: 0.01 m/s²
        thrust_acceleration = 0.01
        duration = delta_v / thrust_acceleration
        return round(duration, 2)
    
    def _calculate_new_orbit(self, current_altitude: float, 
                            delta_v: float, maneuver_type: str) -> Dict:
        """Calculate new orbital parameters after maneuver"""
        # Simplified orbital mechanics
        altitude_change = 0
        
        if "radial" in maneuver_type:
            # Radial maneuvers change altitude
            altitude_change = delta_v * 0.1  # Simplified
        elif "tangential" in maneuver_type:
            # Tangential maneuvers change velocity/period
            altitude_change = delta_v * 0.05
        
        new_altitude = current_altitude + altitude_change
        new_velocity = math.sqrt(self.mu / (self.earth_radius + new_altitude))
        
        # Calculate orbital period
        semi_major_axis = self.earth_radius + new_altitude
        period = 2 * math.pi * math.sqrt(semi_major_axis ** 3 / self.mu)
        
        return {
            "altitude_km": round(new_altitude, 2),
            "velocity_km_s": round(new_velocity, 4),
            "period_minutes": round(period / 60, 2),
            "altitude_change_km": round(altitude_change, 2)
        }
    
    def _calculate_safety_margin(self, original_miss_distance: float, delta_v: float) -> float:
        """Calculate safety margin after maneuver"""
        # Estimate new miss distance
        separation_increase = delta_v * 0.5  # Simplified
        new_miss_distance = original_miss_distance + separation_increase
        
        # Safety margin is distance above minimum safe distance
        safe_distance = 5.0
        margin = new_miss_distance - safe_distance
        
        return round(max(0, margin), 2)
    
    def _calculate_maneuver_confidence(self, time_to_conjunction: float, delta_v: float) -> float:
        """Calculate confidence in maneuver success"""
        base_confidence = 0.95
        
        # Reduce confidence for urgent maneuvers
        if time_to_conjunction < 2:
            base_confidence -= 0.15
        elif time_to_conjunction < 6:
            base_confidence -= 0.05
        
        # Reduce confidence for large delta-v
        if delta_v > 20:
            base_confidence -= 0.1
        elif delta_v > 10:
            base_confidence -= 0.05
        
        return round(max(0.5, base_confidence), 4)
    
    def _calculate_risk_reduction(self, original_miss_distance: float, delta_v: float) -> float:
        """Calculate percentage risk reduction"""
        # Simplified risk calculation
        original_risk = 1.0 / (original_miss_distance + 1)
        
        # Estimate new miss distance
        new_miss_distance = original_miss_distance + (delta_v * 0.5)
        new_risk = 1.0 / (new_miss_distance + 1)
        
        risk_reduction = ((original_risk - new_risk) / original_risk) * 100
        
        return round(max(0, risk_reduction), 2)
    
    async def plan_multi_threat_avoidance(self, satellite: Dict, 
                                         threats: List[Dict]) -> Dict:
        """Plan maneuvers for multiple threats"""
        maneuvers = []
        
        # Sort threats by urgency
        sorted_threats = sorted(threats, 
                               key=lambda t: t.get("time_to_closest_approach", 999))
        
        for threat in sorted_threats[:3]:  # Handle top 3 threats
            maneuver = await self.calculate_avoidance_maneuver(
                satellite, threat, 
                threat.get("time_to_closest_approach", 24)
            )
            maneuvers.append(maneuver)
        
        # Calculate combined strategy
        total_delta_v = sum(m["delta_v"] for m in maneuvers)
        total_fuel = sum(m["fuel_required"]["fuel_mass_kg"] for m in maneuvers)
        
        return {
            "strategy": "sequential_maneuvers",
            "threat_count": len(threats),
            "planned_maneuvers": maneuvers,
            "total_delta_v": round(total_delta_v, 2),
            "total_fuel_kg": round(total_fuel, 2),
            "execution_timeline": self._create_execution_timeline(maneuvers),
            "overall_confidence": round(sum(m["confidence"] for m in maneuvers) / len(maneuvers), 4),
            "created_at": datetime.utcnow().isoformat()
        }
    
    def _create_execution_timeline(self, maneuvers: List[Dict]) -> List[Dict]:
        """Create execution timeline for multiple maneuvers"""
        timeline = []
        
        for i, maneuver in enumerate(maneuvers):
            timeline.append({
                "sequence": i + 1,
                "maneuver_id": maneuver["maneuver_id"],
                "execution_time": maneuver["execution_time"],
                "duration_seconds": maneuver["duration"],
                "delta_v": maneuver["delta_v"]
            })
        
        return timeline
    
    async def get_maneuver_history(self, satellite_id: Optional[str] = None, 
                                   hours: int = 24) -> List[Dict]:
        """Get maneuver history"""
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)
        
        history = [
            m for m in self.maneuver_history
            if datetime.fromisoformat(m["created_at"]) > cutoff_time
        ]
        
        if satellite_id:
            history = [m for m in history if m["satellite_id"] == satellite_id]
        
        return history
    
    async def get_maneuver_statistics(self) -> Dict:
        """Get maneuver planning statistics"""
        total_maneuvers = len(self.maneuver_history)
        
        if total_maneuvers == 0:
            return {
                "total_maneuvers": 0,
                "average_delta_v": 0,
                "total_fuel_used": 0
            }
        
        avg_delta_v = sum(m["delta_v"] for m in self.maneuver_history) / total_maneuvers
        total_fuel = sum(m["fuel_required"]["fuel_mass_kg"] for m in self.maneuver_history)
        
        # Count by type
        type_counts = {}
        for m in self.maneuver_history:
            mtype = m["maneuver_type"]
            type_counts[mtype] = type_counts.get(mtype, 0) + 1
        
        return {
            "total_maneuvers": total_maneuvers,
            "average_delta_v": round(avg_delta_v, 2),
            "total_fuel_used_kg": round(total_fuel, 2),
            "maneuver_types": type_counts,
            "average_confidence": round(sum(m["confidence"] for m in self.maneuver_history) / total_maneuvers, 4),
            "average_risk_reduction": round(sum(m["risk_reduction"] for m in self.maneuver_history) / total_maneuvers, 2)
        }

# Global instance
trajectory_planner = TrajectoryPlanner()
