# 🔧 Render Deployment Fix Guide

## 🚨 Current Issue

Render is scanning for port 8006 but the app is binding to a different port (8002). This happens when:
1. Render has a PORT environment variable set to 8006 in the dashboard
2. The app is not reading that PORT variable correctly

## ✅ Solution Steps

### Step 1: Check Render Dashboard Settings

1. Go to your Render dashboard
2. Select your `spacesense-lite` service
3. Go to **Environment** tab
4. Look for a `PORT` environment variable
5. **DELETE IT** if it exists (Render sets PORT automatically)

### Step 2: Update Start Command

In Render Dashboard:
1. Go to **Settings** tab
2. Find **Start Command**
3. Change it to: `python start.py`
4. Click **Save Changes**

### Step 3: Verify Build Command

In Render Dashboard:
1. Go to **Settings** tab
2. Find **Build Command**
3. Change it to: `./render-build.sh`
4. Or use: `pip install -r requirements-cloud.txt`
5. Click **Save Changes**

### Step 4: Manual Deploy

1. Go to **Manual Deploy** section
2. Click **Clear build cache & deploy**
3. This ensures a fresh deployment

## 🎯 What Should Happen

After these changes, you should see in the logs:

```
🚀 SpaceSense Lite Cloud Startup
🔌 Port from environment: 10000 (or whatever Render assigns)
🌐 Binding to: 0.0.0.0:10000
✅ Uvicorn imported
✅ FastAPI app imported
🎯 Starting server on 0.0.0.0:10000...
INFO: Uvicorn running on http://0.0.0.0:10000
```

And Render should detect the port successfully.

## 🔍 Debugging

If it still doesn't work, check the logs for:

1. **What port is Render expecting?**
   Look for: `Continuing to scan for open port XXXX`

2. **What port is the app binding to?**
   Look for: `Binding to 0.0.0.0:YYYY`

3. **Are they the same?**
   - If NO: There's a PORT environment variable conflict
   - If YES: There might be a startup delay issue

## 🚀 Alternative: Use Render's Auto-Detection

If the above doesn't work, try this simpler approach:

### Option A: Let Render Auto-Detect

1. **Remove render.yaml** from your repository (temporarily)
2. In Render Dashboard, set:
   - **Build Command**: `pip install -r requirements-cloud.txt`
   - **Start Command**: `python start.py`
3. Deploy

### Option B: Use Uvicorn Directly

1. In Render Dashboard, set:
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
2. This uses Render's PORT variable directly

## 📝 Environment Variables to Set

In Render Dashboard → Environment:

```
DEBUG=False
MONGODB_URL=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_gemini_api_key (optional)
```

**DO NOT SET:**
- PORT (Render sets this automatically)
- HOST (we hardcode 0.0.0.0)

## 🎯 Quick Fix Command

If you want to test locally with the same port Render uses:

```bash
PORT=10000 python start.py
```

This simulates Render's environment.

## 🆘 Still Not Working?

### Check 1: Is the app actually starting?
Look for these lines in logs:
```
✅ FastAPI app imported
INFO: Application startup complete
```

### Check 2: Is it binding to the right port?
Look for:
```
INFO: Uvicorn running on http://0.0.0.0:XXXX
```

### Check 3: Is Render checking the right port?
Look for:
```
==> Continuing to scan for open port XXXX
```

**These two XXXX numbers MUST match!**

## 🔧 Nuclear Option: Fresh Deploy

1. Delete the service in Render
2. Create a new service
3. Connect your GitHub repo
4. Let Render auto-detect everything
5. Only set these environment variables:
   - `DEBUG=False`
   - `MONGODB_URL=your_connection_string`

## 📞 Need More Help?

If none of this works, the issue might be:
1. Render's auto-detection is overriding your start command
2. There's a cached PORT variable somewhere
3. The health check is failing before port detection

**Solution**: Contact Render support or try deploying to a different platform (Heroku, Railway) to verify the app works.