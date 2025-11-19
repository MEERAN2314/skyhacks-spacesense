import httpx
import asyncio
import os
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import json

class SpaceTrackClient:
    """Client for Space-Track.org API"""
    
    def __init__(self):
        self.base_url = "https://www.space-track.org"
        self.username = os.getenv("SPACETRACK_USERNAME")
        self.password = os.getenv("SPACETRACK_PASSWORD")
        self.session = None
        self.cache = {}
        self.cache_duration = timedelta(hours=2)  # Cache for 2 hours
        
    async def login(self):
        """Login to Space-Track.org"""
        if not self.username or not self.password:
            print("⚠️  Space-Track.org credentials not found in environment")
            return False
            
        try:
            self.session = httpx.AsyncClient(timeout=30.0)
            
            login_data = {
                'identity': self.username,
                'password': self.password
            }
            
            response = await self.session.post(
                f"{self.base_url}/ajaxauth/login",
                data=login_data
            )
            
            if response.status_code == 200:
                print("✅ Space-Track.org login successful")
                return True
            else:
                print(f"❌ Space-Track.org login failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Space-Track.org connection error: {e}")
            return False
    
    async def get_cached_data(self, cache_key: str) -> Optional[List[Dict]]:
        """Get cached data if still valid"""
        if cache_key in self.cache:
            data, timestamp = self.cache[cache_key]
            if datetime.now() - timestamp < self.cache_duration:
                print(f"📋 Using cached Space-Track data for {cache_key}")
                return data
        return None
    
    def cache_data(self, cache_key: str, data: List[Dict]):
        """Cache data with timestamp"""
        self.cache[cache_key] = (data, datetime.now())
    
    async def get_latest_tle(self, limit: int = 100) -> List[Dict]:
        """Get latest TLE data for all objects"""
        cache_key = f"latest_tle_{limit}"
        
        # Check cache first
        cached_data = await self.get_cached_data(cache_key)
        if cached_data:
            return cached_data
        
        if not self.session:
            if not await self.login():
                return []
        
        try:
            query = f"{self.base_url}/basicspacedata/query/class/tle_latest/ORDINAL/1/limit/{limit}/format/json"
            
            response = await self.session.get(query)
            
            if response.status_code == 200:
                data = response.json()
                self.cache_data(cache_key, data)
                print(f"✅ Retrieved {len(data)} TLE records from Space-Track.org")
                return data
            else:
                print(f"❌ Space-Track API error: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"❌ Error fetching TLE data: {e}")
            return []
    
    async def get_debris_objects(self, limit: int = 50) -> List[Dict]:
        """Get debris objects specifically"""
        cache_key = f"debris_{limit}"
        
        # Check cache first
        cached_data = await self.get_cached_data(cache_key)
        if cached_data:
            return cached_data
        
        if not self.session:
            if not await self.login():
                return []
        
        try:
            query = f"{self.base_url}/basicspacedata/query/class/tle_latest/OBJECT_TYPE/DEBRIS/limit/{limit}/format/json"
            
            response = await self.session.get(query)
            
            if response.status_code == 200:
                data = response.json()
                self.cache_data(cache_key, data)
                print(f"✅ Retrieved {len(data)} debris objects from Space-Track.org")
                return data
            else:
                print(f"❌ Space-Track API error: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"❌ Error fetching debris data: {e}")
            return []
    
    async def get_active_satellites(self, limit: int = 30) -> List[Dict]:
        """Get active satellites"""
        cache_key = f"satellites_{limit}"
        
        # Check cache first
        cached_data = await self.get_cached_data(cache_key)
        if cached_data:
            return cached_data
        
        if not self.session:
            if not await self.login():
                return []
        
        try:
            # Get payloads (active satellites)
            query = f"{self.base_url}/basicspacedata/query/class/tle_latest/OBJECT_TYPE/PAYLOAD/limit/{limit}/format/json"
            
            response = await self.session.get(query)
            
            if response.status_code == 200:
                data = response.json()
                # Filter for active satellites (no decay date)
                active_sats = [sat for sat in data if not sat.get('DECAY_DATE')]
                self.cache_data(cache_key, active_sats)
                print(f"✅ Retrieved {len(active_sats)} active satellites from Space-Track.org")
                return active_sats
            else:
                print(f"❌ Space-Track API error: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"❌ Error fetching satellite data: {e}")
            return []
    
    async def get_object_by_norad_id(self, norad_id: int) -> Optional[Dict]:
        """Get specific object by NORAD ID"""
        cache_key = f"object_{norad_id}"
        
        # Check cache first
        cached_data = await self.get_cached_data(cache_key)
        if cached_data and len(cached_data) > 0:
            return cached_data[0]
        
        if not self.session:
            if not await self.login():
                return None
        
        try:
            query = f"{self.base_url}/basicspacedata/query/class/tle_latest/NORAD_CAT_ID/{norad_id}/format/json"
            
            response = await self.session.get(query)
            
            if response.status_code == 200:
                data = response.json()
                if data:
                    self.cache_data(cache_key, data)
                    print(f"✅ Retrieved object {norad_id} from Space-Track.org")
                    return data[0]
                else:
                    print(f"⚠️  Object {norad_id} not found")
                    return None
            else:
                print(f"❌ Space-Track API error: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ Error fetching object {norad_id}: {e}")
            return None
    
    def convert_spacetrack_to_tle(self, spacetrack_data: Dict) -> Dict:
        """Convert Space-Track.org format to our internal TLE format"""
        try:
            # Determine object type and risk level
            object_type = spacetrack_data.get('OBJECT_TYPE', 'UNKNOWN').lower()
            if object_type == 'debris':
                risk_level = self.calculate_debris_risk(spacetrack_data)
            else:
                risk_level = 'low'
            
            # Convert to our format
            tle_data = {
                "name": spacetrack_data.get('OBJECT_NAME', 'UNKNOWN'),
                "norad_id": int(spacetrack_data.get('NORAD_CAT_ID', 0)),
                "line1": spacetrack_data.get('TLE_LINE1', ''),
                "line2": spacetrack_data.get('TLE_LINE2', ''),
                "object_type": "debris" if object_type == 'debris' else "satellite",
                "size_estimate": self.estimate_size(spacetrack_data),
                "risk_level": risk_level,
                "country_code": spacetrack_data.get('COUNTRY_CODE', 'UNKNOWN'),
                "launch_date": spacetrack_data.get('LAUNCH_DATE'),
                "decay_date": spacetrack_data.get('DECAY_DATE'),
                "rcs_size": spacetrack_data.get('RCS_SIZE', 'UNKNOWN'),
                "last_updated": datetime.now().isoformat()
            }
            
            # Add mission type for satellites
            if object_type != 'debris':
                tle_data["mission_type"] = self.determine_mission_type(spacetrack_data)
            
            return tle_data
            
        except Exception as e:
            print(f"❌ Error converting Space-Track data: {e}")
            return None
    
    def calculate_debris_risk(self, spacetrack_data: Dict) -> str:
        """Calculate risk level for debris objects"""
        try:
            # Factors for risk assessment
            altitude = float(spacetrack_data.get('SEMIMAJOR_AXIS', 0)) - 6371  # Convert to altitude
            rcs_size = spacetrack_data.get('RCS_SIZE', 'UNKNOWN')
            eccentricity = float(spacetrack_data.get('ECCENTRICITY', 0))
            
            risk_score = 0
            
            # Altitude risk (LEO is higher risk)
            if 200 <= altitude <= 2000:  # LEO
                risk_score += 3
            elif 2000 < altitude <= 35786:  # MEO
                risk_score += 2
            else:  # GEO or very low
                risk_score += 1
            
            # Size risk
            if rcs_size == 'LARGE':
                risk_score += 3
            elif rcs_size == 'MEDIUM':
                risk_score += 2
            elif rcs_size == 'SMALL':
                risk_score += 1
            
            # Eccentricity risk (highly elliptical orbits cross more paths)
            if eccentricity > 0.1:
                risk_score += 2
            elif eccentricity > 0.05:
                risk_score += 1
            
            # Convert score to risk level
            if risk_score >= 6:
                return 'high'
            elif risk_score >= 4:
                return 'medium'
            else:
                return 'low'
                
        except Exception:
            return 'medium'  # Default to medium if calculation fails
    
    def estimate_size(self, spacetrack_data: Dict) -> float:
        """Estimate object size based on RCS"""
        rcs_size = spacetrack_data.get('RCS_SIZE', 'UNKNOWN')
        
        size_map = {
            'LARGE': 5.0,    # > 1m
            'MEDIUM': 0.5,   # 10cm - 1m
            'SMALL': 0.05,   # < 10cm
            'UNKNOWN': 0.1   # Default estimate
        }
        
        return size_map.get(rcs_size, 0.1)
    
    def determine_mission_type(self, spacetrack_data: Dict) -> str:
        """Determine mission type for satellites"""
        name = spacetrack_data.get('OBJECT_NAME', '').upper()
        
        if 'ISS' in name or 'STATION' in name:
            return 'crewed_station'
        elif 'STARLINK' in name or 'ONEWEB' in name:
            return 'communication'
        elif 'GPS' in name or 'GLONASS' in name or 'GALILEO' in name:
            return 'navigation'
        elif 'WEATHER' in name or 'GOES' in name or 'NOAA' in name:
            return 'weather'
        elif 'HUBBLE' in name or 'TELESCOPE' in name:
            return 'science'
        elif 'MILITARY' in name or 'DEFENSE' in name:
            return 'military'
        else:
            return 'other'
    
    async def close(self):
        """Close the HTTP session"""
        if self.session:
            await self.session.aclose()
            print("📴 Space-Track.org session closed")

# Global instance
spacetrack_client = SpaceTrackClient()