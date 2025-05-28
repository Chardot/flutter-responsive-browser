#!/bin/bash

# Flutter Responsive Browser - Flutter Integration Example
# This script demonstrates how to integrate FRB with your Flutter development workflow

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Flutter Responsive Browser - Integration Example${NC}"
echo "================================================"

# Function to check if Flutter is installed
check_flutter() {
    if ! command -v flutter &> /dev/null; then
        echo -e "${YELLOW}Flutter is not installed or not in PATH${NC}"
        echo "Please install Flutter: https://flutter.dev/docs/get-started/install"
        exit 1
    fi
}

# Function to find Flutter web port
find_flutter_port() {
    local port=$(lsof -i -P -n | grep LISTEN | grep dart | awk '{print $9}' | cut -d: -f2 | head -1)
    if [ -z "$port" ]; then
        echo ""
    else
        echo "$port"
    fi
}

# Function to launch FRB with Flutter
launch_with_flutter() {
    local device="${1:-iPhone 12}"
    local port="${2:-5000}"
    
    echo -e "${GREEN}Launching Flutter Responsive Browser...${NC}"
    echo "Device: $device"
    echo "URL: http://localhost:$port"
    
    # Launch FRB
    npx flutter-responsive-browser --url "http://localhost:$port" --device "$device"
}

# Main script
main() {
    check_flutter
    
    # Check if Flutter web server is running
    echo -e "${BLUE}Checking for running Flutter web servers...${NC}"
    flutter_port=$(find_flutter_port)
    
    if [ -z "$flutter_port" ]; then
        echo -e "${YELLOW}No Flutter web server detected.${NC}"
        echo "Starting Flutter web server on port 5000..."
        
        # Start Flutter in background
        flutter run -d chrome --web-port=5000 &
        FLUTTER_PID=$!
        
        # Wait for server to start
        echo "Waiting for Flutter to start..."
        sleep 5
        
        # Launch FRB
        launch_with_flutter "iPhone 12" 5000
        
        # Clean up
        kill $FLUTTER_PID 2>/dev/null
    else
        echo -e "${GREEN}Found Flutter web server on port $flutter_port${NC}"
        
        # Launch FRB with detected port
        launch_with_flutter "iPhone 12" "$flutter_port"
    fi
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --device)
            DEVICE="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --device <name>    Device to emulate (default: iPhone 12)"
            echo "  --help            Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Run main function
main