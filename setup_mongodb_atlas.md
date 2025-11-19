# 🌐 MongoDB Atlas Setup Guide for SpaceSense Lite

This guide will help you set up MongoDB Atlas for your SpaceSense Lite project.

## 🚀 Quick Setup Steps

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Verify your email address

### 2. Create a New Cluster
1. **Choose Cloud Provider**: Select AWS, Google Cloud, or Azure
2. **Select Region**: Choose the region closest to your users
3. **Cluster Tier**: Select **M0 Sandbox** (Free tier - perfect for hackathons!)
4. **Cluster Name**: Name it `spacesense-cluster` or similar
5. Click **"Create Cluster"** (takes 1-3 minutes)

### 3. Configure Database Access
1. Go to **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. **Authentication Method**: Password
4. **Username**: `spacesense_user` (or your choice)
5. **Password**: Generate a secure password (save it!)
6. **Database User Privileges**: Select **"Read and write to any database"**
7. Click **"Add User"**

### 4. Configure Network Access
1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. **For Development**: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. **For Production**: Add your specific IP addresses
5. Click **"Confirm"**

### 5. Get Connection String
1. Go to **"Clusters"** and click **"Connect"** on your cluster
2. Select **"Connect your application"**
3. **Driver**: Python, **Version**: 3.6 or later
4. **Copy the connection string** - it looks like:
   ```
   mongodb+srv://spacesense_user:<password>@spacesense-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 6. Configure Your Application
1. **Replace `<password>`** in the connection string with your actual password
2. **Add database name** to the connection string:
   ```
   mongodb+srv://spacesense_user:your_password@spacesense-cluster.xxxxx.mongodb.net/spacesense_lite?retryWrites=true&w=majority
   ```
3. **Update your `.env` file**:
   ```env
   MONGODB_URL=mongodb+srv://spacesense_user:your_password@spacesense-cluster.xxxxx.mongodb.net/spacesense_lite?retryWrites=true&w=majority
   ```

## 🔧 Example Configuration

### Complete .env File
```env
# MongoDB Atlas Configuration
MONGODB_URL=mongodb+srv://spacesense_user:your_password@spacesense-cluster.xxxxx.mongodb.net/spacesense_lite?retryWrites=true&w=majority

# Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379

# Application Settings
DEBUG=True
HOST=0.0.0.0
PORT=8000
```

## 🧪 Test Your Connection

Run this Python script to test your MongoDB Atlas connection:

```python
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import ssl

async def test_connection():
    mongo_url = "your_connection_string_here"
    
    try:
        client = AsyncIOMotorClient(
            mongo_url,
            ssl=True,
            ssl_cert_reqs=ssl.CERT_NONE,
            serverSelectionTimeoutMS=5000
        )
        
        # Test connection
        await client.admin.command('ping')
        print("✅ MongoDB Atlas connection successful!")
        
        # Test database operations
        db = client.spacesense_lite
        test_doc = {"test": "connection", "timestamp": "2024-01-01"}
        
        result = await db.test_collection.insert_one(test_doc)
        print(f"✅ Document inserted with ID: {result.inserted_id}")
        
        # Clean up test document
        await db.test_collection.delete_one({"_id": result.inserted_id})
        print("✅ Test document cleaned up")
        
        client.close()
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")

# Run the test
asyncio.run(test_connection())
```

## 🚀 Running SpaceSense Lite with Atlas

Once configured, start your application:

```bash
# Install dependencies
pip install -r requirements.txt

# Run the application
python run.py
```

You should see:
```
✅ Connected to MongoDB Atlas successfully
📊 Database: spacesense_lite
✅ Database indexes created successfully
✅ Sample data loaded to MongoDB Atlas
🚀 SpaceSense Lite initialized successfully!
```

## 📊 Monitor Your Database

1. Go to your **MongoDB Atlas Dashboard**
2. Click on your cluster name
3. Use the **"Collections"** tab to view your data:
   - `debris` collection - Orbital debris objects
   - `satellites` collection - Tracked satellites

## 🔒 Security Best Practices

### For Production:
1. **Restrict IP Access**: Only allow specific IP addresses
2. **Use Strong Passwords**: Generate complex passwords
3. **Principle of Least Privilege**: Create users with minimal required permissions
4. **Enable Monitoring**: Set up Atlas monitoring and alerts
5. **Regular Backups**: Configure automated backups

### Connection String Security:
- ✅ Store in environment variables (`.env` file)
- ✅ Never commit connection strings to Git
- ✅ Use different credentials for dev/staging/production
- ❌ Never hardcode credentials in source code

## 🆘 Troubleshooting

### Common Issues:

**Connection Timeout**
```
Solution: Check network access settings, ensure your IP is whitelisted
```

**Authentication Failed**
```
Solution: Verify username/password, check user permissions
```

**Database Not Found**
```
Solution: Ensure database name is in connection string
```

**SSL Certificate Issues**
```python
# Add this to your connection:
ssl_cert_reqs=ssl.CERT_NONE
```

## 💡 Free Tier Limits

MongoDB Atlas M0 (Free) includes:
- **Storage**: 512 MB
- **RAM**: Shared
- **Connections**: 500 concurrent
- **Perfect for**: Development, hackathons, small projects

## 🎯 For Your Hackathon

This setup gives you:
- ✅ **Cloud Database**: Professional, scalable storage
- ✅ **Global Access**: Works from anywhere
- ✅ **Zero Cost**: Free tier perfect for hackathons
- ✅ **Easy Scaling**: Can upgrade if needed
- ✅ **Backup & Security**: Built-in Atlas features

Your SpaceSense Lite project will now have enterprise-grade database infrastructure! 🚀