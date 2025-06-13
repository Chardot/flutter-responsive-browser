#!/bin/bash

# Flutt - Flutter Integration Example
# This script demonstrates how to integrate Flutt with your Flutter development workflow

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Flutt - Integration Example${NC}"
echo "================================================"

# Function to check if Flutter is installed
check_flutter() {
    if ! command -v flutter &> /dev/null; then
        echo -e "${YELLOW}Flutter is not installed or not in PATH${NC}"
        echo "Please install Flutter: https://flutter.dev/docs/get-started/install"
        exit 1
    fi
    echo -e "${GREEN}✓ Flutter found${NC}"
}

# Function to find Flutter web server port
find_flutter_port() {
    # Check common Flutter ports
    for port in 3000 3001 5000 5001 8080 8081; do
        if lsof -i :$port | grep -q LISTEN; then
            echo $port
            return 0
        fi
    done
    return 1
}

# Function to launch Flutt with Flutter
launch_flutt() {
    local device="${1:-iPhone 12}"
    local port="${2:-$(find_flutter_port)}"
    
    echo -e "${GREEN}Launching Flutt...${NC}"
    echo "Device: $device"
    echo "URL: http://localhost:$port"
    
    # Launch Flutt
    npx flutt --url "http://localhost:$port" --device "$device"
}

# Main script
main() {
    check_flutter
    
    case "$1" in
        "iphone")
            launch_flutt "iPhone 14"
            ;;
        "android")
            launch_flutt "Pixel 7"
            ;;
        "ipad")
            launch_flutt "iPad Pro"
            ;;
        "custom")
            if [ -z "$2" ]; then
                echo -e "${YELLOW}Please specify a device name${NC}"
                echo "Usage: $0 custom \"Device Name\""
                exit 1
            fi
            launch_flutt "$2"
            ;;
        "auto")
            # Auto-detect Flutter server
            echo -e "${BLUE}Auto-detecting Flutter server...${NC}"
            if port=$(find_flutter_port); then
                echo -e "${GREEN}✓ Found Flutter server on port $port${NC}"
                launch_flutt "iPhone 12" "$port"
            else
                echo -e "${YELLOW}No Flutter server detected${NC}"
                echo "Start your Flutter app first: flutter run -d chrome --web-port=3000"
                exit 1
            fi
            ;;
        *)
            echo "Usage: $0 [iphone|android|ipad|custom|auto]"
            echo ""
            echo "Examples:"
            echo "  $0 iphone              # Launch with iPhone 14"
            echo "  $0 android             # Launch with Pixel 7"
            echo "  $0 ipad                # Launch with iPad Pro"
            echo "  $0 custom \"iPhone 13\"  # Launch with custom device"
            echo "  $0 auto                # Auto-detect Flutter server"
            echo ""
            echo "Or use Flutt directly:"
            echo "  flutt                  # Auto-detect Flutter servers"
            echo "  flutt --device \"Pixel 5\""
            ;;
    esac
}

# Advanced usage: Integration with Flutter run
flutter_dev() {
    echo -e "${BLUE}Starting Flutter development environment...${NC}"
    
    # Start Flutter in background
    flutter run -d chrome --web-port=3000 &
    FLUTTER_PID=$!
    
    # Wait for server to start
    echo -e "${YELLOW}Waiting for Flutter server to start...${NC}"
    sleep 5
    
    # Check if server is running
    if lsof -i :3000 | grep -q LISTEN; then
        echo -e "${GREEN}✓ Flutter server started${NC}"
        # Launch Flutt
        launch_flutt "iPhone 12" 3000
    else
        echo -e "${YELLOW}Flutter server failed to start${NC}"
        kill $FLUTTER_PID 2>/dev/null
        exit 1
    fi
    
    # Wait for user to exit
    wait $FLUTTER_PID
}

# Run main function with arguments
main "$@"