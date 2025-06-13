# App Icons for Flutt

This directory should contain the app icons for different platforms:

## Required Icon Files:

### macOS
- `icon.icns` - macOS app icon (should include multiple sizes: 16x16, 32x32, 64x64, 128x128, 256x256, 512x512, 1024x1024)

### Windows  
- `icon.ico` - Windows app icon (should include multiple sizes: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256)

### Linux
- `icon.png` - Linux app icon (recommended size: 512x512 or 1024x1024)

## Creating Icons:

### For macOS (.icns):
1. Create a 1024x1024 PNG image
2. Use `iconutil` or an app like Image2icon to generate the .icns file

### For Windows (.ico):
1. Create multiple PNG sizes
2. Use a tool like https://icoconvert.com or ImageMagick to create the .ico file

### For Linux:
1. Just use a high-resolution PNG (512x512 or 1024x1024)

## Icon Design Tips:
- Use a simple, recognizable design
- Ensure it looks good at small sizes (16x16)
- Consider using the Flutter logo or a custom design
- Use transparent background where appropriate