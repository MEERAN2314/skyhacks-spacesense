#!/usr/bin/env python3
"""
Diagnostic script to check environment and port binding
"""

import os
import sys
import socket

def check_environment():
    """Check environment variables"""
    print("🔍 Environment Diagnostics:")
    print(f"PORT: {os.getenv('PORT', 'Not set')}")
    print(f"HOST: {os.getenv('HOST', 'Not set')}")
    print(f"DEBUG: {os.getenv('DEBUG', 'Not set')}")
    print(f"Python version: {sys.version}")
    print(f"Platform: {sys.platform}")

def check_port_availability(port):
    """Check if port is available"""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind(('0.0.0.0', port))
            print(f"✅ Port {port} is available")
            return True
    except OSError as e:
        print(f"❌ Port {port} is not available: {e}")
        return False

def main():
    check_environment()
    
    # Check common ports
    ports_to_check = [
        int(os.getenv('PORT', 10000)),
        8006,
        8000,
        3000,
        5000
    ]
    
    print("\n🔌 Port Availability:")
    for port in ports_to_check:
        check_port_availability(port)

if __name__ == "__main__":
    main()