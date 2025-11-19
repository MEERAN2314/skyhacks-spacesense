import httpx
import asyncio
import os
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import re

class CelestrakClient:
    """Client for Celestrak.org API - No registration required!"""
    
    def __init__(self):
        self.base_url = "https://celestrak.org"
        self.session = None
        self.cache = {}
        self.cache_duration = timedelta(hours=1)  # Cache for 1 hour
        
    async def initialize(self):
        """Initialize the HTTP client"""
        self.session = httpx.AsyncClient(timeout=30.0)
        print("✅ Celestrak client initialized (no registration required)")
        
    async def get_cached_data(self, cache_key: str) -> Optional[List[Dict]]:
        """Get cached data if still valid"""
        if cache_key in self.cache:
            data, timestamp = self.cache[cache_key]
            if datetime.now() - timestamp < self.cache_duration:
                print(f"📋 Using cached Celestrak data for {cache_key}")
                return data
        return None
    
    def cache_data(self, cache_key: str, data: List[Dict]):
        """Cache data with timestamp"""
        self.cache[cache_key] = (data, datetime.now())
    
    async def get_active_satellites(self, limit: int = 30) -> List[Dict]:
        """Get active satellites from Celestrak"""
        cache_key = f"celestrak_satellites_{limit}"
        
        # Check cache first
        cached_data = await self.get_cached_data(cache_key)
        if cached_data:
            return cached_data
        
        if not self.session:
            await self.initialize()
        
        satellites = []
        
        try:
            # Get different satellite categories
            categories = [
                ("stations", "https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=json"),
                ("starlink", "https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=json"),
                ("gps-ops", "https://celestrak.org/NORAD/elements/gp.php?GROUP=gps-ops&FORMAT=json"),
                ("weather", "https://celestrak.org/NORAD/elements/gp.php?GROUP=weather&FORMAT=json"),
            ]
            
            for category, url in categories:
                try:
                    response = await self.session.get(url)
                    if response.status_code == 200:
                        data = response.json()
                        
                        # Convert and add to satellites list
                        for item in data[:10]:  # Limit per category
                            converted = self.convert_celestrak_to_tle(item, category)
                            if converted:
                                satellites.append(converted)
                                
                        print(f"✅ Retrieved {len(data[:10])} satellites from Celestrak ({category})")
                        
                        if len(satellites) >= limit:
                            break
                            
                except Exception as e:
                    print(f"⚠️  Error fetching {category}: {e}")
                    continue
            
            # Cache the results
            satellites = satellites[:limit]
            self.cache_data(cache_key, satellites)
            print(f"✅ Total: {len(satellites)} satellites from Celestrak")
            
            return satellites
            
        except Exception as e:
            print(f"❌ Error fetching Celestrak satellites: {e}")
            return []
    
    async def get_debris_objects(self, limit: int = 50) -> List[Dict]:
        """Get debris objects from Celestrak"""
        cache_key = f"celestrak_debris_{limit}"
        
        # Check cache first
        cached_data = await self.get_cached_data(cache_key)
        if cached_data:
            return cached_data
        
        if not self.session:
            await self.initialize()
        
        debris_objects = []
        
        try:
            # Celestrak debris categories
            debris_urls = [
                "https://celestrak.org/NORAD/elements/gp.php?GROUP=cosmos-2251-debris&FORMAT=json",
                "https://celestrak.org/NORAD/elements/gp.php?GROUP=iridium-33-debris&FORMAT=json",
                "https://celestrak.org/NORAD/elements/gp.php?GROUP=fengyun-1c-debris&FORMAT=json",
            ]
            
            for url in debris_urls:
                try:
                    response = await self.session.get(url)
                    if response.status_code == 200:
                        data = response.json()
                        
                        # Convert and add to debris list
                        for item in data[:20]:  # Limit per category
                            converted = self.convert_celestrak_to_tle(item, "debris")
                            if converted:
                                debris_objects.append(converted)
                        
                        print(f"✅ Retrieved {len(data[:20])} debris objects from Celestrak")
                        
                        if len(debris_objects) >= limit:
                            break
                            
                except Exception as e:
                    print(f"⚠️  Error fetching debris category: {e}")
                    continue
            
            # If not enough debris from specific categories, get from general catalog
            if len(debris_objects) < limit:
                try:
                    # Get supplemental objects and filter for debris-like names
                    response = await self.session.get(
                        "https://celestrak.org/NORAD/elements/gp.php?GROUP=supplemental&FORMAT=json"
                    )
                    if response.status_code == 200:
                        data = response.json()
                        
                        # Filter for debris-like objects
                        for item in data:
                            name = item.get('OBJECT_NAME', '').upper()
                            if any(keyword in name for keyword in ['DEB', 'DEBRIS', 'FRAG', 'FRAGMENT']):
                                converted = self.convert_celestrak_to_tle(item, "debris")
                                if converted:
                                    debris_objects.append(converted)
                                    
                                if len(debris_objects) >= limit:
                                    break
                        
                        print(f"✅ Added supplemental debris objects from Celestrak")
                        
                except Exception as e:
                    print(f"⚠️  Error fetching supplemental debris: {e}")
            
            # Cache the results
            debris_objects = debris_objects[:limit]
            self.cache_data(cache_key, debris_objects)
            print(f"✅ Total: {len(debris_objects)} debris objects from Celestrak")
            
            return debris_objects
            
        except Exception as e:
            print(f"❌ Error fetching Celestrak debris: {e}")
            return []
    
    async def get_iss_data(self) -> Optional[Dict]:
        """Get ISS data specifically"""
        try:
            if not self.session:
                await self.initialize()
                
            response = await self.session.get(
                "https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=json"
            )
            
            if response.status_code == 200:
                data = response.json()
                if data:
                    converted = self.convert_celestrak_to_tle(data[0], "stations")
                    print("✅ Retrieved ISS data from Celestrak")
                    return converted
            
            return None
            
        except Exception as e:
            print(f"❌ Error fetching ISS data: {e}")
            return None
    
    def convert_celestrak_to_tle(self, celestrak_data: Dict, category: str) -> Dict:
        """Convert Celestrak format to our internal TLE format"""
        try:
            object_name = celestrak_data.get('OBJECT_NAME', 'UNKNOWN')
            
            # Determine if it's debris or satellite
            is_debris = (
                category == "debris" or 
                any(keyword in object_name.upper() for keyword in ['DEB', 'DEBRIS', 'FRAG', 'FRAGMENT'])
            )
            
            # Calculate risk level for debris
            if is_debris:
                risk_level = self.calculate_debris_risk(celestrak_data)
            else:
                risk_level = 'low'
            
            # Convert to our format
            tle_data = {
                "name": object_name,
                "norad_id": int(celestrak_data.get('NORAD_CAT_ID', 0)),
                "line1": celestrak_data.get('TLE_LINE1', ''),
                "line2": celestrak_data.get('TLE_LINE2', ''),
                "object_type": "debris" if is_debris else "satellite",
                "size_estimate": self.estimate_size_from_name(object_name),
                "risk_level": risk_level,
                "country_code": celestrak_data.get('COUNTRY_CODE', 'UNKNOWN'),
                "launch_date": celestrak_data.get('LAUNCH_DATE'),
                "decay_date": celestrak_data.get('DECAY_DATE'),
                "last_updated": datetime.now().isoformat(),
                "data_source": "celestrak"
            }
            
            # Add mission type for satellites
            if not is_debris:
                tle_data["mission_type"] = self.determine_mission_type(object_name, category)
            
            return tle_data
            
        except Exception as e:
            print(f"❌ Error converting Celestrak data: {e}")
            return None
    
    def calculate_debris_risk(self, celestrak_data: Dict) -> str:
        """Calculate risk level for debris objects"""
        try:
            # Get orbital parameters
            mean_motion = float(celestrak_data.get('MEAN_MOTION', 15))
            eccentricity = float(celestrak_data.get('ECCENTRICITY', 0))
            inclination = float(celestrak_data.get('INCLINATION', 0))
            
            # Calculate approximate altitude from mean motion
            # Higher mean motion = lower altitude = higher risk
            altitude = (398600.4418 / (mean_motion * 2 * 3.14159 / 1440) ** 2) ** (1/3) - 6371
            
            risk_score = 0
            
            # Altitude risk (LEO is higher risk)
            if 200 <= altitude <= 1000:  # LEO
                risk_score += 3
            elif 1000 < altitude <= 2000:  # Higher LEO
                risk_score += 2
            else:  # MEO/GEO
                risk_score += 1
            
            # Eccentricity risk
            if eccentricity > 0.1:
                risk_score += 2
            elif eccentricity > 0.05:
                risk_score += 1
            
            # Inclination risk (polar orbits cross more paths)
            if inclination > 80:
                risk_score += 1
            
            # Name-based risk assessment
            name = celestrak_data.get('OBJECT_NAME', '').upper()
            if 'COSMOS' in name or 'IRIDIUM' in name:
                risk_score += 2  # Known collision debris
            
            # Convert score to risk level
            if risk_score >= 5:
                return 'high'
            elif risk_score >= 3:
                return 'medium'
            else:
                return 'low'
                
        except Exception:
            return 'medium'  # Default to medium if calculation fails
    
    def estimate_size_from_name(self, name: str) -> float:
        """Estimate object size from name patterns"""
        name_upper = name.upper()
        
        # Size estimates based on object type
        if 'ISS' in name_upper or 'STATION' in name_upper:
            return 50.0  # Large space station
        elif 'STARLINK' in name_upper:
            return 2.5   # Starlink satellite
        elif 'GPS' in name_upper:
            return 5.0   # GPS satellite
        elif 'DEB' in name_upper or 'DEBRIS' in name_upper:
            return 0.1   # Small debris
        elif 'FRAG' in name_upper or 'FRAGMENT' in name_upper:
            return 0.05  # Very small fragment
        else:
            return 1.0   # Default satellite size
    
    def determine_mission_type(self, name: str, category: str) -> str:
        """Determine mission type for satellites"""
        name_upper = name.upper()
        
        # Category-based classification
        if category == "stations":
            return 'crewed_station'
        elif category == "starlink":
            return 'communication'
        elif category == "gps-ops":
            return 'navigation'
        elif category == "weather":
            return 'weather'
        
        # Name-based classification
        if 'ISS' in name_upper or 'STATION' in name_upper:
            return 'crewed_station'
        elif 'STARLINK' in name_upper or 'ONEWEB' in name_upper:
            return 'communication'
        elif 'GPS' in name_upper or 'GLONASS' in name_upper or 'GALILEO' in name_upper:
            return 'navigation'
        elif 'WEATHER' in name_upper or 'GOES' in name_upper or 'NOAA' in name_upper:
            return 'weather'
        elif 'HUBBLE' in name_upper or 'TELESCOPE' in name_upper:
            return 'science'
        else:
            return 'other'
    
    async def close(self):
        """Close the HTTP session"""
        if self.session:
            await self.session.aclose()
            print("📴 Celestrak session closed")

# Global instance
celestrak_client = CelestrakClient()