#!/usr/bin/env python3
"""
SpaceSense Pro - API Testing Suite
Tests all external data sources and connectivity
"""

import asyncio
import httpx
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.HEADER}{'='*60}")
    print(f"{text:^60}")
    print(f"{'='*60}{Colors.ENDC}\n")

def print_success(text):
    print(f"{Colors.OKGREEN}✅ {text}{Colors.ENDC}")

def print_error(text):
    print(f"{Colors.FAIL}❌ {text}{Colors.ENDC}")

def print_warning(text):
    print(f"{Colors.WARNING}⚠️  {text}{Colors.ENDC}")

def print_info(text):
    print(f"{Colors.OKCYAN}ℹ️  {text}{Colors.ENDC}")

async def test_celestrak():
    """Test Celestrak.org API"""
    print_header("Testing Celestrak.org API")
    
    results = {"passed": 0, "failed": 0}
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        # Test 1: ISS Data
        print_info("Test 1: Fetching ISS data...")
        try:
            response = await client.get(
                "https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=json"
            )
            if response.status_code == 200:
                data = response.json()
                if data:
                    print_success(f"ISS Data Retrieved: {data[0]['OBJECT_NAME']}")
                    print(f"   NORAD ID: {data[0]['NORAD_CAT_ID']}")
                    print(f"   Epoch: {data[0]['EPOCH']}")
                    results["passed"] += 1
                else:
                    print_error("No ISS data returned")
                    results["failed"] += 1
            else:
                print_error(f"HTTP {response.status_code}")
                results["failed"] += 1
        except Exception as e:
            print_error(f"ISS test failed: {e}")
            results["failed"] += 1
        
        # Test 2: Starlink Satellites
        print_info("Test 2: Fetching Starlink satellites...")
        try:
            response = await client.get(
                "https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=json"
            )
            if response.status_code == 200:
                data = response.json()
                print_success(f"Starlink Data Retrieved: {len(data)} satellites")
                if data:
                    print(f"   Sample: {data[0]['OBJECT_NAME']}")
                results["passed"] += 1
            else:
                print_error(f"HTTP {response.status_code}")
                results["failed"] += 1
        except Exception as e:
            print_error(f"Starlink test failed: {e}")
            results["failed"] += 1
        
        # Test 3: Debris Objects
        print_info("Test 3: Fetching debris objects...")
        try:
            response = await client.get(
                "https://celestrak.org/NORAD/elements/gp.php?GROUP=cosmos-2251-debris&FORMAT=json"
            )
            if response.status_code == 200:
                data = response.json()
                print_success(f"Debris Data Retrieved: {len(data)} objects")
                if data:
                    print(f"   Sample: {data[0]['OBJECT_NAME']}")
                results["passed"] += 1
            else:
                print_error(f"HTTP {response.status_code}")
                results["failed"] += 1
        except Exception as e:
            print_error(f"Debris test failed: {e}")
            results["failed"] += 1
        
        # Test 4: GPS Satellites
        print_info("Test 4: Fetching GPS satellites...")
        try:
            response = await client.get(
                "https://celestrak.org/NORAD/elements/gp.php?GROUP=gps-ops&FORMAT=json"
            )
            if response.status_code == 200:
                data = response.json()
                print_success(f"GPS Data Retrieved: {len(data)} satellites")
                if data:
                    print(f"   Sample: {data[0]['OBJECT_NAME']}")
                results["passed"] += 1
            else:
                print_error(f"HTTP {response.status_code}")
                results["failed"] += 1
        except Exception as e:
            print_error(f"GPS test failed: {e}")
            results["failed"] += 1
    
    print(f"\n{Colors.BOLD}Celestrak Results: {results['passed']}/{results['passed'] + results['failed']} tests passed{Colors.ENDC}")
    return results["passed"] > 0

async def test_spacetrack():
    """Test Space-Track.org API"""
    print_header("Testing Space-Track.org API")
    
    username = os.getenv("SPACETRACK_USERNAME")
    password = os.getenv("SPACETRACK_PASSWORD")
    
    if not username or not password:
        print_warning("Space-Track.org credentials not found in .env")
        print_info("This is optional - Celestrak works without it")
        return False
    
    print_info("Attempting login to Space-Track.org...")
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Login
            login_data = {
                'identity': username,
                'password': password
            }
            
            response = await client.post(
                "https://www.space-track.org/ajaxauth/login",
                data=login_data
            )
            
            if response.status_code == 200:
                print_success("Space-Track.org login successful!")
                
                # Test data fetch
                print_info("Fetching TLE data...")
                response = await client.get(
                    "https://www.space-track.org/basicspacedata/query/class/tle_latest/ORDINAL/1/limit/10/format/json"
                )
                
                if response.status_code == 200:
                    data = response.json()
                    print_success(f"Retrieved {len(data)} TLE records")
                    return True
                else:
                    print_error(f"Failed to fetch data: HTTP {response.status_code}")
                    return False
            else:
                print_error(f"Login failed: HTTP {response.status_code}")
                return False
                
    except Exception as e:
        print_error(f"Space-Track test failed: {e}")
        return False

async def test_gemini():
    """Test Google Gemini AI API"""
    print_header("Testing Google Gemini AI API")
    
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key or api_key == "demo_key":
        print_warning("Gemini API key not found in .env")
        print_info("This is optional - app works with fallback insights")
        return False
    
    print_info("Configuring Gemini API...")
    
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        
        print_info("Testing AI generation...")
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content("Say 'API test successful' in one sentence.")
        
        if response.text:
            print_success("Gemini AI is working!")
            print(f"   Response: {response.text[:100]}...")
            return True
        else:
            print_error("No response from Gemini")
            return False
            
    except ImportError:
        print_error("google-generativeai package not installed")
        print_info("Install with: pip install google-generativeai")
        return False
    except Exception as e:
        print_error(f"Gemini API test failed: {e}")
        print_warning("Check your API key in .env file")
        return False

async def test_mongodb():
    """Test MongoDB Atlas connection"""
    print_header("Testing MongoDB Atlas Connection")
    
    mongo_url = os.getenv("MONGODB_URL")
    
    if not mongo_url:
        print_warning("MongoDB URL not found in .env")
        print_info("This is optional - app uses in-memory storage as fallback")
        return False
    
    print_info("Connecting to MongoDB Atlas...")
    
    try:
        from motor.motor_asyncio import AsyncIOMotorClient
        
        client = AsyncIOMotorClient(
            mongo_url,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=10000
        )
        
        # Test connection
        await client.admin.command('ping')
        
        # Get database info
        db_name = mongo_url.split("/")[-1].split("?")[0] if "/" in mongo_url else "spacesense_pro"
        db = client[db_name]
        collections = await db.list_collection_names()
        
        print_success("MongoDB Atlas connection successful!")
        print(f"   Database: {db_name}")
        print(f"   Collections: {len(collections)}")
        
        client.close()
        return True
        
    except ImportError:
        print_error("motor package not installed")
        print_info("Install with: pip install motor")
        return False
    except Exception as e:
        print_error(f"MongoDB connection failed: {e}")
        print_warning("Check your MONGODB_URL in .env file")
        return False

async def test_local_server():
    """Test if local SpaceSense Pro server is running"""
    print_header("Testing Local SpaceSense Pro Server")
    
    print_info("Checking if server is running on http://localhost:8006...")
    
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get("http://localhost:8006/health")
            
            if response.status_code == 200:
                data = response.json()
                print_success("Server is running!")
                print(f"   Status: {data.get('status')}")
                print(f"   Service: {data.get('service')}")
                return True
            else:
                print_warning("Server returned unexpected status")
                return False
                
    except Exception as e:
        print_warning("Server is not running")
        print_info("Start with: python run.py")
        return False

async def main():
    """Run all tests"""
    print(f"\n{Colors.BOLD}{Colors.HEADER}")
    print("╔════════════════════════════════════════════════════════════╗")
    print("║         SpaceSense Pro - API Testing Suite                ║")
    print("║                                                            ║")
    print("║  Testing all external data sources and connectivity       ║")
    print("╚════════════════════════════════════════════════════════════╝")
    print(f"{Colors.ENDC}")
    
    start_time = datetime.now()
    print(f"Test Started: {start_time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Run all tests
    results = {
        "celestrak": await test_celestrak(),
        "spacetrack": await test_spacetrack(),
        "gemini": await test_gemini(),
        "mongodb": await test_mongodb(),
        "server": await test_local_server()
    }
    
    # Summary
    print_header("Test Summary")
    
    print(f"{Colors.BOLD}Required Services:{Colors.ENDC}")
    if results["celestrak"]:
        print_success("Celestrak.org API - WORKING")
    else:
        print_error("Celestrak.org API - FAILED")
    
    print(f"\n{Colors.BOLD}Optional Services:{Colors.ENDC}")
    if results["spacetrack"]:
        print_success("Space-Track.org API - WORKING")
    else:
        print_error("Space-Track.org API - NOT CONFIGURED")
    
    if results["gemini"]:
        print_success("Google Gemini AI - WORKING")
    else:
        print_error("Google Gemini AI - NOT CONFIGURED")
    
    if results["mongodb"]:
        print_success("MongoDB Atlas - WORKING")
    else:
        print_error("MongoDB Atlas - NOT CONFIGURED")
    
    print(f"\n{Colors.BOLD}Local Server:{Colors.ENDC}")
    if results["server"]:
        print_success("SpaceSense Pro Server - RUNNING")
    else:
        print_warning("SpaceSense Pro Server - NOT RUNNING")
    
    # Overall status
    print_header("Overall Status")
    
    if results["celestrak"]:
        print_success("READY TO GO!")
        print("SpaceSense Pro can run with real orbital data from Celestrak.org")
        if not results["server"]:
            print_info("Start the server with: python run.py")
    else:
        print_error("CRITICAL: Celestrak.org API is not working")
        print_warning("Check your internet connection")
    
    end_time = datetime.now()
    print(f"\nTest Completed: {end_time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Duration: {(end_time - start_time).total_seconds():.2f} seconds")

if __name__ == "__main__":
    asyncio.run(main())
