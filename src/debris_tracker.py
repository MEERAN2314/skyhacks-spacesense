import asyncio
import httpx
import random
import math
from datetime import datetime, timedelta
from typing import List, Dict
from .database import get_database
from .spacetrack_client import spacetrack_client
from .celestrak_client import celestrak_client

# Try to import scientific packages, use fallbacks if not available
try:
    import numpy as np
    HAS_NUMPY = True
except ImportError:
    HAS_NUMPY = False
    print("⚠️  NumPy not available, using Python math")

try:
    from skyfield.api import load, EarthSatellite
    from skyfield.timelib import Time
    HAS_SKYFIELD = True
    print("✅ Skyfield available for orbital mechanics")
except ImportError:
    HAS_SKYFIELD = False
    print("⚠️  Skyfield not available, using simplified orbital mechanics")
    from .orbital_simple import simple_orbital

class DebrisTracker:
    def __init__(self):
        if HAS_SKYFIELD:
            self.ts = load.timescale()
        else:
            self.ts = None
        self.db = None
        self.debris_objects = []
        self.satellites = []
    
    def validate_json_safe(self, data: Dict) -> Dict:
        """Ensure all values in dict are JSON-safe (no NaN, inf, etc.)"""
        safe_data = {}
        for key, value in data.items():
            if isinstance(value, (int, float)):
                if not math.isfinite(value):
                    # Replace NaN/inf with reasonable defaults
                    if key in ["latitude"]:
                        safe_data[key] = 0.0
                    elif key in ["longitude"]:
                        safe_data[key] = 0.0
                    elif key in ["altitude"]:
                        safe_data[key] = 400.0
                    elif key in ["velocity"]:
                        safe_data[key] = 7.66
                    else:
                        safe_data[key] = 0.0
                else:
                    safe_data[key] = value
            else:
                safe_data[key] = value
        return safe_data
        
    async def initialize(self):
        """Initialize the debris tracker"""
        self.db = await get_database()
        
        # Try to load real data from Space-Track.org first
        await self.load_real_data()
        
        # If no real data available, use sample data
        if not self.debris_objects or not self.satellites:
            await self.load_sample_data()
        
    async def load_sample_data(self):
        """Load sample TLE data for demonstration"""
        # Sample debris objects with realistic orbital parameters
        sample_debris = [
            {
                "name": "COSMOS 2251 DEB",
                "norad_id": 34454,
                "line1": "1 34454U 93036SX  23320.83333333  .00000000  00000-0  00000-0 0  9990",
                "line2": "2 34454  74.0458 280.8821 0009999 123.4567 236.5432 14.12345678123456",
                "object_type": "debris",
                "size_estimate": 0.15,
                "risk_level": "high"
            },
            {
                "name": "IRIDIUM 33 DEB",
                "norad_id": 34455,
                "line1": "1 34455U 97051C   23320.83333333  .00000000  00000-0  00000-0 0  9991",
                "line2": "2 34455  86.4000 320.1234 0001234 234.5678 125.4321 14.34567890234567",
                "object_type": "debris",
                "size_estimate": 0.08,
                "risk_level": "medium"
            }
        ]
        
        # Sample active satellites
        sample_satellites = [
            {
                "name": "ISS (ZARYA)",
                "norad_id": 25544,
                "line1": "1 25544U 98067A   23320.83333333  .00002182  00000-0  40768-4 0  9992",
                "line2": "2 25544  51.6461 339.7939 0001258  92.8340 267.3124 15.49309239123456",
                "object_type": "satellite",
                "mission_type": "crewed_station"
            },
            {
                "name": "STARLINK-1007",
                "norad_id": 44713,
                "line1": "1 44713U 19074A   23320.83333333  .00001234  00000-0  12345-4 0  9993",
                "line2": "2 44713  53.0000 123.4567 0001234 234.5678 125.4321 15.06123456789012",
                "object_type": "satellite",
                "mission_type": "communication"
            }
        ]
        
        # Store in database if available, otherwise use in-memory
        if self.db is not None:
            try:
                # Clear existing data
                await self.db.debris.delete_many({})
                await self.db.satellites.delete_many({})
                
                # Insert new data
                if sample_debris:
                    await self.db.debris.insert_many(sample_debris)
                if sample_satellites:
                    await self.db.satellites.insert_many(sample_satellites)
                    
                print("✅ Sample data loaded to MongoDB Atlas")
            except Exception as e:
                print(f"⚠️  Database insert warning: {e}")
        else:
            print("📝 Using in-memory sample data")
            
        # Always keep in-memory copy for fallback
        self.debris_objects = sample_debris
        self.satellites = sample_satellites
        
    async def load_real_data(self):
        """Load real TLE data from multiple sources"""
        try:
            print("🌐 Loading real orbital data...")
            
            # Initialize Celestrak client (no registration required)
            await celestrak_client.initialize()
            
            # Try Celestrak first (instant access, no registration)
            print("🛰️  Trying Celestrak.org (no registration required)...")
            celestrak_debris = await celestrak_client.get_debris_objects(limit=30)
            celestrak_satellites = await celestrak_client.get_active_satellites(limit=20)
            
            data_loaded = False
            
            if celestrak_debris:
                self.debris_objects = celestrak_debris
                print(f"✅ Loaded {len(celestrak_debris)} debris objects from Celestrak")
                data_loaded = True
            
            if celestrak_satellites:
                self.satellites = celestrak_satellites
                print(f"✅ Loaded {len(celestrak_satellites)} satellites from Celestrak")
                data_loaded = True
            
            # Try Space-Track.org as secondary source (if credentials available)
            if not data_loaded:
                print("🛰️  Trying Space-Track.org as backup...")
                if await spacetrack_client.login():
                    # Get real debris data
                    debris_data = await spacetrack_client.get_debris_objects(limit=30)
                    satellite_data = await spacetrack_client.get_active_satellites(limit=20)
                    
                    if debris_data:
                        # Convert Space-Track format to our format
                        converted_debris = []
                        for item in debris_data:
                            converted = spacetrack_client.convert_spacetrack_to_tle(item)
                            if converted:
                                converted_debris.append(converted)
                        
                        if converted_debris:
                            self.debris_objects = converted_debris
                            print(f"✅ Loaded {len(converted_debris)} debris objects from Space-Track")
                            data_loaded = True
                    
                    if satellite_data:
                        # Convert satellite data
                        converted_satellites = []
                        for item in satellite_data:
                            converted = spacetrack_client.convert_spacetrack_to_tle(item)
                            if converted:
                                converted_satellites.append(converted)
                        
                        if converted_satellites:
                            self.satellites = converted_satellites
                            print(f"✅ Loaded {len(converted_satellites)} satellites from Space-Track")
                            data_loaded = True
                else:
                    print("⚠️  Space-Track.org credentials not available")
            
            # Store real data in database if available
            if self.db is not None and data_loaded:
                try:
                    if hasattr(self, 'debris_objects') and self.debris_objects:
                        await self.db.debris.delete_many({})
                        await self.db.debris.insert_many(self.debris_objects)
                    
                    if hasattr(self, 'satellites') and self.satellites:
                        await self.db.satellites.delete_many({})
                        await self.db.satellites.insert_many(self.satellites)
                    
                    print("✅ Real data stored in MongoDB Atlas")
                except Exception as e:
                    print(f"⚠️  Database storage warning: {e}")
            
            if not data_loaded:
                print("⚠️  No real data sources available, will use sample data")
                
        except Exception as e:
            print(f"⚠️  Error loading real data: {e}")
            print("📝 Falling back to sample data")
        
    async def get_live_debris(self) -> List[Dict]:
        """Get live debris positions"""
        live_debris = []
        current_time = datetime.utcnow()
        
        for debris in self.debris_objects:
            try:
                if HAS_SKYFIELD and self.ts:
                    # Use Skyfield for accurate calculations
                    skyfield_time = self.ts.now()
                    satellite = EarthSatellite(debris["line1"], debris["line2"], debris["name"], self.ts)
                    geocentric = satellite.at(skyfield_time)
                    subpoint = geocentric.subpoint()
                    
                    # Add some realistic variation for demo
                    lat_variation = random.uniform(-0.1, 0.1)
                    lon_variation = random.uniform(-0.1, 0.1)
                    
                    debris_info = {
                        "id": debris["norad_id"],
                        "name": debris["name"],
                        "latitude": float(subpoint.latitude.degrees) + lat_variation,
                        "longitude": float(subpoint.longitude.degrees) + lon_variation,
                        "altitude": float(subpoint.elevation.km),
                        "velocity": random.uniform(7.5, 7.8),  # km/s
                        "risk_level": debris["risk_level"],
                        "size_estimate": debris["size_estimate"],
                        "object_type": debris["object_type"],
                        "timestamp": skyfield_time.utc_iso()
                    }
                    debris_info = self.validate_json_safe(debris_info)
                else:
                    # Use simplified orbital mechanics
                    position = simple_orbital.tle_to_position(debris["line1"], debris["line2"])
                    
                    debris_info = {
                        "id": debris["norad_id"],
                        "name": debris["name"],
                        "latitude": position["latitude"],
                        "longitude": position["longitude"],
                        "altitude": position["altitude"],
                        "velocity": position["velocity"],
                        "risk_level": debris["risk_level"],
                        "size_estimate": debris["size_estimate"],
                        "object_type": debris["object_type"],
                        "timestamp": current_time.isoformat()
                    }
                    debris_info = self.validate_json_safe(debris_info)
                
                live_debris.append(debris_info)
                
            except Exception as e:
                print(f"Error processing debris {debris['name']}: {e}")
                continue
                
        # Add some simulated debris for better visualization
        for i in range(20):
            simulated_debris = {
                "id": 90000 + i,
                "name": f"DEBRIS-{i+1:03d}",
                "latitude": random.uniform(-60, 60),
                "longitude": random.uniform(-180, 180),
                "altitude": random.uniform(200, 2000),
                "velocity": random.uniform(7.0, 8.0),
                "risk_level": random.choice(["low", "medium", "high"]),
                "size_estimate": random.uniform(0.01, 0.5),
                "object_type": "debris",
                "timestamp": current_time.isoformat()
            }
            simulated_debris = self.validate_json_safe(simulated_debris)
            live_debris.append(simulated_debris)
            
        return live_debris
        
    async def get_tracked_satellites(self) -> List[Dict]:
        """Get tracked satellites positions"""
        live_satellites = []
        current_time = datetime.utcnow()
        
        for sat in self.satellites:
            try:
                if HAS_SKYFIELD and self.ts:
                    # Use Skyfield for accurate calculations
                    skyfield_time = self.ts.now()
                    satellite = EarthSatellite(sat["line1"], sat["line2"], sat["name"], self.ts)
                    geocentric = satellite.at(skyfield_time)
                    subpoint = geocentric.subpoint()
                    
                    sat_info = {
                        "id": sat["norad_id"],
                        "name": sat["name"],
                        "latitude": float(subpoint.latitude.degrees),
                        "longitude": float(subpoint.longitude.degrees),
                        "altitude": float(subpoint.elevation.km),
                        "mission_type": sat["mission_type"],
                        "object_type": sat["object_type"],
                        "timestamp": skyfield_time.utc_iso()
                    }
                    sat_info = self.validate_json_safe(sat_info)
                else:
                    # Use simplified orbital mechanics
                    position = simple_orbital.tle_to_position(sat["line1"], sat["line2"])
                    
                    sat_info = {
                        "id": sat["norad_id"],
                        "name": sat["name"],
                        "latitude": position["latitude"],
                        "longitude": position["longitude"],
                        "altitude": position["altitude"],
                        "mission_type": sat["mission_type"],
                        "object_type": sat["object_type"],
                        "timestamp": current_time.isoformat()
                    }
                    sat_info = self.validate_json_safe(sat_info)
                
                live_satellites.append(sat_info)
                
            except Exception as e:
                print(f"Error processing satellite {sat['name']}: {e}")
                continue
                
        return live_satellites
        
    async def refresh_data(self):
        """Refresh data from Space-Track.org (called periodically)"""
        try:
            print("🔄 Refreshing data from Space-Track.org...")
            await self.load_real_data()
        except Exception as e:
            print(f"⚠️  Data refresh failed: {e}")
    
    async def close(self):
        """Clean up resources"""
        await spacetrack_client.close()
        await celestrak_client.close()