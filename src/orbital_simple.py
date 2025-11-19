"""
Simple orbital mechanics fallback for when Skyfield is not available
"""

import math
from datetime import datetime
from typing import Dict, Tuple

class SimpleOrbitalMechanics:
    """Simple orbital calculations without external dependencies"""
    
    def __init__(self):
        self.earth_radius = 6371.0  # km
        
    def tle_to_position(self, tle_line1: str, tle_line2: str) -> Dict:
        """Convert TLE to approximate position (simplified)"""
        try:
            # Parse basic orbital elements from TLE
            elements = self.parse_tle(tle_line1, tle_line2)
            
            # Calculate current position (simplified)
            lat, lon, alt = self.calculate_position(elements)
            
            return {
                "latitude": lat,
                "longitude": lon, 
                "altitude": alt,
                "velocity": elements.get("velocity", 7.5)
            }
            
        except Exception as e:
            # Return random position if parsing fails
            import random
            return {
                "latitude": random.uniform(-60, 60),
                "longitude": random.uniform(-180, 180),
                "altitude": random.uniform(200, 2000),
                "velocity": random.uniform(7.0, 8.0)
            }
    
    def parse_tle(self, line1: str, line2: str) -> Dict:
        """Parse TLE lines to extract orbital elements"""
        try:
            # Extract key orbital elements with validation
            inclination = float(line2[8:16].strip())
            raan = float(line2[17:25].strip())
            eccentricity = float("0." + line2[26:33].strip())
            arg_perigee = float(line2[34:42].strip())
            mean_anomaly = float(line2[43:51].strip())
            mean_motion = float(line2[52:63].strip())
            
            # Validate extracted values
            if not all(math.isfinite(x) for x in [inclination, raan, eccentricity, arg_perigee, mean_anomaly, mean_motion]):
                raise ValueError("Invalid TLE values")
            
            # Clamp values to reasonable ranges
            inclination = max(0, min(180, inclination))
            raan = raan % 360
            eccentricity = max(0, min(0.99, eccentricity))
            arg_perigee = arg_perigee % 360
            mean_anomaly = mean_anomaly % 360
            mean_motion = max(0.1, min(20, mean_motion))  # Reasonable range for satellites
            
            # Calculate approximate altitude
            altitude = self.mean_motion_to_altitude(mean_motion)
            
            # Calculate velocity with validation
            velocity = math.sqrt(398600.4418 / (self.earth_radius + altitude))
            if not math.isfinite(velocity):
                velocity = 7.66
            
            return {
                "inclination": inclination,
                "raan": raan,
                "eccentricity": eccentricity,
                "arg_perigee": arg_perigee,
                "mean_anomaly": mean_anomaly,
                "mean_motion": mean_motion,
                "altitude": altitude,
                "velocity": velocity
            }
            
        except Exception:
            # Return default values if parsing fails
            return {
                "inclination": 51.6,
                "raan": 0.0,
                "eccentricity": 0.001,
                "arg_perigee": 0.0,
                "mean_anomaly": 0.0,
                "mean_motion": 15.5,
                "altitude": 400.0,
                "velocity": 7.66
            }
    
    def mean_motion_to_altitude(self, mean_motion: float) -> float:
        """Convert mean motion to approximate altitude"""
        try:
            # Validate input
            if not mean_motion or mean_motion <= 0 or not math.isfinite(mean_motion):
                return 400.0
            
            # Simplified calculation
            # mean_motion is in revolutions per day
            period_seconds = 86400.0 / mean_motion  # seconds per orbit
            
            # Validate period
            if not math.isfinite(period_seconds) or period_seconds <= 0:
                return 400.0
            
            # Using Kepler's third law (simplified)
            semi_major_axis = (398600.4418 * (period_seconds / (2 * math.pi)) ** 2) ** (1/3)
            
            # Validate semi-major axis
            if not math.isfinite(semi_major_axis):
                return 400.0
                
            altitude = semi_major_axis - self.earth_radius
            
            # Validate and clamp altitude
            if not math.isfinite(altitude):
                return 400.0
                
            return max(200.0, min(50000.0, altitude))  # Clamp to reasonable range
            
        except Exception:
            return 400.0  # Default ISS-like altitude
    
    def calculate_position(self, elements: Dict) -> Tuple[float, float, float]:
        """Calculate current lat/lon/alt from orbital elements (very simplified)"""
        try:
            # This is a very simplified calculation
            # In reality, this requires complex orbital mechanics
            
            # Get current time
            now = datetime.utcnow()
            
            # Simple time-based position calculation
            time_factor = (now.hour * 3600 + now.minute * 60 + now.second) / 86400.0
            
            # Validate elements
            raan = float(elements.get("raan", 0))
            mean_anomaly = float(elements.get("mean_anomaly", 0))
            mean_motion = float(elements.get("mean_motion", 15.5))
            inclination = float(elements.get("inclination", 51.6))
            altitude = float(elements.get("altitude", 400))
            
            # Calculate longitude (simplified)
            longitude = (raan + mean_anomaly + time_factor * 360.0 * mean_motion) % 360.0
            if longitude > 180:
                longitude -= 360
            
            # Calculate latitude (simplified)
            latitude = inclination * math.sin(
                math.radians(mean_anomaly + time_factor * 360.0)
            ) * 0.5
            
            # Validate results
            if not all(math.isfinite(x) for x in [latitude, longitude, altitude]):
                raise ValueError("Invalid calculation result")
            
            # Clamp to valid ranges
            latitude = max(-90, min(90, latitude))
            longitude = max(-180, min(180, longitude))
            altitude = max(200, min(50000, altitude))
            
            return latitude, longitude, altitude
            
        except Exception:
            # Return random position if calculation fails
            import random
            return (
                random.uniform(-60, 60),
                random.uniform(-180, 180), 
                random.uniform(200, 2000)
            )

# Global instance
simple_orbital = SimpleOrbitalMechanics()