#!/usr/bin/env python3
"""
Installation fix for Python 3.12 compatibility issues
"""

import subprocess
import sys
import os

def run_command(cmd):
    """Run a command and return success status"""
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {cmd}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {cmd}")
        print(f"Error: {e.stderr}")
        return False

def main():
    print("🔧 Fixing Python 3.12 compatibility issues...")
    
    # Upgrade pip and setuptools first
    print("\n📦 Upgrading pip and setuptools...")
    run_command("pip install --upgrade pip setuptools wheel")
    
    # Install packages one by one to avoid conflicts
    packages = [
        "fastapi",
        "uvicorn[standard]", 
        "jinja2",
        "python-multipart",
        "websockets",
        "motor",
        "pymongo",
        "httpx",
        "python-dotenv",
        "aiofiles",
        "google-generativeai"
    ]
    
    print("\n🚀 Installing core packages...")
    for package in packages:
        print(f"\nInstalling {package}...")
        if not run_command(f"pip install {package}"):
            print(f"⚠️  Failed to install {package}, continuing...")
    
    # Try to install scientific packages
    scientific_packages = [
        "numpy",
        "pandas", 
        "skyfield"
    ]
    
    print("\n🔬 Installing scientific packages...")
    for package in scientific_packages:
        print(f"\nInstalling {package}...")
        if not run_command(f"pip install {package}"):
            print(f"⚠️  Failed to install {package}, will use fallback")
    
    # Optional packages (nice to have)
    optional_packages = [
        "scipy",
        "astropy",
        "poliastro",
        "plotly",
        "celery",
        "redis"
    ]
    
    print("\n📊 Installing optional packages...")
    for package in optional_packages:
        print(f"\nTrying to install {package}...")
        run_command(f"pip install {package}")
    
    print("\n✅ Installation complete!")
    print("\n🚀 You can now run: python run.py")

if __name__ == "__main__":
    main()