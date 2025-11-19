# 🛰️ Space-Track.org API Setup Guide

Space-Track.org provides free access to orbital data for satellites and debris. This guide will help you get API access for real TLE (Two-Line Element) data.

## 🚀 Getting Space-Track.org API Access

### 1. Create Account
1. Go to [Space-Track.org](https://www.space-track.org/)
2. Click **"Request Account"** (top right)
3. Fill out the registration form:
   - **Organization**: Your university/company name
   - **Use Case**: "Educational/Research - Orbital Debris Tracking"
   - **Justification**: "Developing orbital debris management system for space safety"
4. **Wait for approval** (usually 1-2 business days)

### 2. Account Approval Process
- You'll receive an email when your account is approved
- **Important**: Space-Track requires legitimate use cases
- **For Hackathons**: Mention it's for educational/research purposes

### 3. API Documentation
- Once approved, login and go to **"Help" → "API Documentation"**
- The API uses REST endpoints with authentication
- Rate limited to prevent abuse

## 🔑 API Credentials Setup

### 1. Get Your Credentials
After account approval:
- **Username**: Your Space-Track.org username
- **Password**: Your Space-Track.org password
- **No separate API key needed** - uses your login credentials

### 2. Update .env File
```env
# Space-Track.org API Credentials
SPACETRACK_USERNAME=your_username_here
SPACETRACK_PASSWORD=your_password_here
```

## 📡 Available Data Types

### TLE Data Categories
1. **Active Satellites** - Currently operational satellites
2. **Debris** - Tracked space debris objects
3. **Rocket Bodies** - Spent rocket stages
4. **Payloads** - Satellite payloads
5. **Historical Data** - Past orbital elements

### Key API Endpoints
```
# Latest TLE data for all objects
https://www.space-track.org/basicspacedata/query/class/tle_latest/ORDINAL/1/format/json

# Specific satellite by NORAD ID
https://www.space-track.org/basicspacedata/query/class/tle_latest/NORAD_CAT_ID/25544/format/json

# Debris objects only
https://www.space-track.org/basicspacedata/query/class/tle_latest/OBJECT_TYPE/DEBRIS/format/json

# Objects by country
https://www.space-track.org/basicspacedata/query/class/tle_latest/COUNTRY_CODE/US/format/json
```

## 🔧 Integration Examples

### Basic API Call
```python
import requests
import json

def get_space_track_data(username, password, query):
    """Get data from Space-Track.org API"""
    
    # Login endpoint
    login_url = "https://www.space-track.org/ajaxauth/login"
    
    # Create session
    session = requests.Session()
    
    # Login
    login_data = {
        'identity': username,
        'password': password
    }
    
    response = session.post(login_url, data=login_data)
    
    if response.status_code == 200:
        # Make API request
        api_response = session.get(query)
        return api_response.json()
    else:
        raise Exception("Login failed")

# Example usage
username = "your_username"
password = "your_password"
query = "https://www.space-track.org/basicspacedata/query/class/tle_latest/ORDINAL/1/limit/100/format/json"

data = get_space_track_data(username, password, query)
```

### Get ISS Data
```python
# Get International Space Station TLE
iss_query = "https://www.space-track.org/basicspacedata/query/class/tle_latest/NORAD_CAT_ID/25544/format/json"
iss_data = get_space_track_data(username, password, iss_query)
```

### Get Debris Data
```python
# Get debris objects
debris_query = "https://www.space-track.org/basicspacedata/query/class/tle_latest/OBJECT_TYPE/DEBRIS/limit/50/format/json"
debris_data = get_space_track_data(username, password, debris_query)
```

## 📊 Data Format

### TLE Response Format
```json
{
  "CCSDS_OMM_VERS": "2.0",
  "COMMENT": "GENERATED VIA SPACE-TRACK.ORG API",
  "CREATION_DATE": "2024-01-15T10:30:00.000000",
  "ORIGINATOR": "18 SPCS",
  "OBJECT_NAME": "ISS (ZARYA)",
  "OBJECT_ID": "1998-067A",
  "CENTER_NAME": "EARTH",
  "REF_FRAME": "TEME",
  "TIME_SYSTEM": "UTC",
  "MEAN_ELEMENT_THEORY": "SGP4",
  "EPOCH": "2024-01-15T09:45:36.123456",
  "MEAN_MOTION": "15.49309239",
  "ECCENTRICITY": "0.0001258",
  "INCLINATION": "51.6461",
  "RA_OF_ASC_NODE": "339.7939",
  "ARG_OF_PERICENTER": "92.8340",
  "MEAN_ANOMALY": "267.3124",
  "EPHEMERIS_TYPE": "0",
  "CLASSIFICATION_TYPE": "U",
  "NORAD_CAT_ID": "25544",
  "ELEMENT_SET_NO": "999",
  "REV_AT_EPOCH": "12345",
  "BSTAR": "0.000040768",
  "MEAN_MOTION_DOT": "0.00002182",
  "MEAN_MOTION_DDOT": "0",
  "SEMIMAJOR_AXIS": "6795.049",
  "PERIOD": "92.68",
  "APOAPSIS": "422.659",
  "PERIAPSIS": "411.439",
  "OBJECT_TYPE": "PAYLOAD",
  "RCS_SIZE": "LARGE",
  "COUNTRY_CODE": "ISS",
  "LAUNCH_DATE": "1998-11-20",
  "SITE": "TTMTR",
  "DECAY_DATE": null,
  "FILE": "3456",
  "GP_ID": "123456789",
  "TLE_LINE0": "ISS (ZARYA)",
  "TLE_LINE1": "1 25544U 98067A   24015.40664352  .00002182  00000-0  40768-4 0  9992",
  "TLE_LINE2": "2 25544  51.6461 339.7939 0001258  92.8340 267.3124 15.49309239123456"
}
```

## ⚡ Rate Limits & Best Practices

### Rate Limits
- **200 requests per hour** for registered users
- **Bulk downloads** available for large datasets
- **Cache data** to minimize API calls

### Best Practices
1. **Cache TLE data** - Update every few hours, not every request
2. **Batch requests** - Get multiple objects in one call when possible
3. **Filter data** - Use query parameters to get only what you need
4. **Handle errors** - API can be temporarily unavailable
5. **Respect limits** - Don't exceed rate limits

### Example Caching Strategy
```python
import time
from datetime import datetime, timedelta

class SpaceTrackCache:
    def __init__(self):
        self.cache = {}
        self.cache_duration = timedelta(hours=2)  # Cache for 2 hours
    
    def get_cached_data(self, query):
        if query in self.cache:
            data, timestamp = self.cache[query]
            if datetime.now() - timestamp < self.cache_duration:
                return data
        return None
    
    def cache_data(self, query, data):
        self.cache[query] = (data, datetime.now())
```

## 🚨 Important Notes

### Account Requirements
- ✅ **Real name and organization** required
- ✅ **Legitimate use case** (research, education, commercial)
- ✅ **No automated account creation**
- ❌ **Fake information** will result in account rejection

### Data Usage
- ✅ **Free for approved users**
- ✅ **Educational and research use** encouraged
- ✅ **Commercial use** allowed with proper justification
- ❌ **Redistribution** of raw data without permission

### For Your Hackathon
- **Apply early** - Account approval takes 1-2 days
- **Use educational justification** - Mention it's for learning/research
- **Have backup plan** - Use sample data if approval is pending
- **Cache data** - Don't hit API limits during demo

## 🔄 Fallback Strategy

If Space-Track.org is unavailable or account pending:

1. **Use sample TLE data** (already implemented)
2. **Celestrak.org** - Alternative TLE source (no registration)
3. **NASA APIs** - Some orbital data available
4. **Simulated data** - Generate realistic orbital parameters

## 📞 Support

- **Space-Track.org Help**: help@space-track.org
- **API Documentation**: Available after login
- **Status Page**: Check for service outages
- **Community Forums**: User discussions and help

## 🎯 Quick Start for Hackathon

1. **Register immediately** at Space-Track.org
2. **Use educational justification**
3. **While waiting for approval**, use the sample data already in SpaceSense Lite
4. **Once approved**, add credentials to `.env` file
5. **Test API integration** with a few simple calls
6. **Implement caching** to avoid rate limits during demo

Your SpaceSense Lite project will have access to real, up-to-date orbital data from the official U.S. government source! 🛰️