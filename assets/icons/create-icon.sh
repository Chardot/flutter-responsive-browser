#!/bin/bash

# This script helps create app icons for Flutt
# You need to have a 1024x1024 PNG file named 'icon-1024.png' in this directory

echo "App Icon Creation Script for Flutt"
echo "======================================================"

# Check if source file exists
if [ ! -f "icon-1024.png" ]; then
    echo "ERROR: Please create a 1024x1024 PNG file named 'icon-1024.png' in this directory first."
    echo ""
    echo "You can create this icon using any graphics software like:"
    echo "  - Figma, Sketch, or Adobe tools"
    echo "  - Free tools like GIMP or Inkscape"
    echo "  - Online tools like Canva"
    echo ""
    echo "Design tips:"
    echo "  - Use a simple, recognizable design"
    echo "  - Consider using the Flutter logo or 'Flutt' text"
    echo "  - Use colors that stand out"
    echo "  - Test how it looks at small sizes"
    exit 1
fi

# Create various sizes for .icns (macOS)
echo "Creating icon sizes for macOS..."
mkdir -p icon.iconset

# Create all required sizes for macOS
sips -z 16 16     icon-1024.png --out icon.iconset/icon_16x16.png
sips -z 32 32     icon-1024.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32     icon-1024.png --out icon.iconset/icon_32x32.png
sips -z 64 64     icon-1024.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128   icon-1024.png --out icon.iconset/icon_128x128.png
sips -z 256 256   icon-1024.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256   icon-1024.png --out icon.iconset/icon_256x256.png
sips -z 512 512   icon-1024.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512   icon-1024.png --out icon.iconset/icon_512x512.png
cp icon-1024.png icon.iconset/icon_512x512@2x.png

# Create .icns file
echo "Creating .icns file..."
iconutil -c icns icon.iconset
rm -rf icon.iconset

# Create icon.png for Linux (use 512x512)
echo "Creating icon.png for Linux..."
sips -z 512 512 icon-1024.png --out icon.png

echo ""
echo "SUCCESS! Created:"
echo "  - icon.icns (for macOS)"
echo "  - icon.png (for Linux)"
echo ""
echo "For Windows (.ico file), you'll need to:"
echo "  1. Visit https://icoconvert.com"
echo "  2. Upload your icon-1024.png"
echo "  3. Select sizes: 16, 32, 48, 64, 128, 256"
echo "  4. Download and save as 'icon.ico' in this directory"
echo ""
echo "After creating all icons, restart the app to see the new icon in the dock!"