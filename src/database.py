from motor.motor_asyncio import AsyncIOMotorClient
import os
from typing import Optional
import ssl

class Database:
    client: Optional[AsyncIOMotorClient] = None
    database = None

db = Database()

async def get_database():
    """Get database instance"""
    if db.database is None:
        # Use MongoDB Atlas connection string from environment
        mongo_url = os.getenv("MONGODB_URL")
        
        if not mongo_url:
            print("⚠️  MONGODB_URL not found in environment variables")
            print("📝 Using in-memory storage for demo")
            return None
            
        try:
            # MongoDB Atlas connection with SSL
            db.client = AsyncIOMotorClient(
                mongo_url,
                ssl=True,
                ssl_cert_reqs=ssl.CERT_NONE,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=10000,
                maxPoolSize=50
            )
            
            # Extract database name from connection string or use default
            if "mongodb+srv://" in mongo_url:
                # Extract database name from Atlas connection string
                if "?" in mongo_url:
                    db_part = mongo_url.split("/")[-1].split("?")[0]
                    db_name = db_part if db_part else "spacesense_lite"
                else:
                    db_name = mongo_url.split("/")[-1] or "spacesense_lite"
            else:
                db_name = "spacesense_lite"
                
            db.database = db.client[db_name]
            
            # Test connection with timeout
            await db.client.admin.command('ping')
            print(f"✅ Connected to MongoDB Atlas successfully")
            print(f"📊 Database: {db_name}")
            
            # Create indexes for better performance
            await create_indexes()
            
        except Exception as e:
            print(f"❌ MongoDB Atlas connection failed: {e}")
            print("📝 Using in-memory storage for demo")
            db.database = None
            
    return db.database

async def create_indexes():
    """Create database indexes for better performance"""
    try:
        if db.database is not None:
            # Create indexes for debris collection
            await db.database.debris.create_index("norad_id", unique=True)
            await db.database.debris.create_index("risk_level")
            await db.database.debris.create_index("object_type")
            
            # Create indexes for satellites collection
            await db.database.satellites.create_index("norad_id", unique=True)
            await db.database.satellites.create_index("mission_type")
            
            print("✅ Database indexes created successfully")
    except Exception as e:
        print(f"⚠️  Index creation warning: {e}")

async def close_database():
    """Close database connection"""
    if db.client:
        db.client.close()
        print("📴 MongoDB Atlas connection closed")