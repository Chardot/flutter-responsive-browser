# Flutt

**Launch Flutter web apps directly in mobile device emulation mode. No more manual DevTools setup.**

## 🚀 What is Flutt?

Flutt is a developer tool that automatically launches your Flutter web applications in a browser window with mobile device emulation enabled. It eliminates the repetitive task of manually opening Chrome DevTools, switching to responsive mode, and selecting a device every time you debug your Flutter app.

## ✨ Features

- **📱 Instant Mobile Preview** - Launch your Flutter app directly in mobile viewport with proper device emulation
- **🎯 Accurate Device Emulation** - True mobile rendering with correct user agents, touch events, and viewport behavior
- **📐 Multiple Device Presets** - iPhone, Android, and tablet configurations ready to use
- **🎨 Visual Enhancements** - Optional device frames, zoom controls, and dark mode support
- **🔄 Flutter Integration** - Auto-detects running Flutter web servers
- **⚡ Lightning Fast** - From command to preview in under 3 seconds
- **🛠️ Developer Friendly** - Simple CLI with intuitive commands
- **🖥️ Cross-Platform** - Works on Windows, macOS, and Linux

## 🎯 Why Flutt?

If you're a Flutter developer or UX designer working on responsive web apps, you know the pain:

1. Run `flutter run -d chrome`
2. Right-click → Inspect
3. Click responsive mode icon
4. Select device from dropdown
5. Adjust zoom level
6. **Repeat every single time** 😫

With Flutt, it's just:

```bash
flutt
```

That's it! Your Flutter app opens instantly in a clean, mobile-emulated browser.

## 🚀 Quick Start

### Download Pre-built App (Recommended)

**[⬇️ Download Flutt for macOS](https://github.com/Chardot/flutter-responsive-browser/releases/latest)**

- **Apple Silicon (M1/M2/M3)**: Download `Flutt-1.0.0-arm64.dmg`
- **Intel Macs**: Download `Flutt-1.0.0.dmg`

### Install via npm

```bash
npm install -g flutt
```

### Basic Usage

```bash
# Auto-detect and launch Flutter web server
flutt

# Launch with specific URL
flutt --url http://localhost:3000

# Use a specific device
flutt --device "iPhone 14"

# List all available devices
flutt --list
```

## 📱 Available Devices

### iPhones
- iPhone SE, iPhone 12 Mini, iPhone 12, iPhone 12 Pro, iPhone 12 Pro Max
- iPhone 13 Mini, iPhone 13, iPhone 13 Pro, iPhone 13 Pro Max
- iPhone 14, iPhone 14 Plus, iPhone 14 Pro, iPhone 14 Pro Max

### Android Phones
- Pixel 4, Pixel 5, Pixel 6, Pixel 7
- Galaxy S8, Galaxy S9+, Galaxy S20 Ultra

### Tablets
- iPad Mini, iPad Air, iPad Pro (11" and 12.9")
- Nexus 7, Nexus 10, Pixel C

## ⚙️ Command Options

```bash
flutt [options]

Options:
  -u, --url <url>        URL to open (auto-detects Flutter servers if not specified)
  -d, --device <device>  Device to emulate (default: "iPhone 12")
  -l, --list            List all available devices
  --playwright          Use Playwright instead of Electron (includes Chrome UI)
  -h, --help           Display help
  -V, --version        Display version
```

## 🔧 Installation Options

### Direct Download (Easiest)
**[⬇️ Download from GitHub Releases](https://github.com/Chardot/flutter-responsive-browser/releases/latest)**

Choose the appropriate file for your system:
- **macOS Apple Silicon**: `Flutt-1.0.0-arm64.dmg`
- **macOS Intel**: `Flutt-1.0.0.dmg`

### npm
```bash
npm install -g flutt
```

### Build from Source
```bash
git clone https://github.com/Chardot/flutter-responsive-browser.git
cd flutter-responsive-browser
npm install
npm run dist
```

## 🎨 Features in Detail

### Auto-Detection of Flutter Servers
Flutt automatically scans for running Flutter web servers on your machine:
- Detects servers on common ports (3000-9999)
- Shows project name and port
- Launches with a single click

### Visual Device Emulation
```json
{
  "frames": true,
  "darkMode": false,
  "zoomLevel": 0.75,
  "orientation": "portrait",
  "networkThrottle": "Fast 3G",
  "touchEmulation": true,
  "deviceMetrics": true
}
```

### Keyboard Shortcuts
- `Ctrl/Cmd + Shift + D` - Toggle device frame
- `Ctrl/Cmd + Shift + R` - Rotate device
- `Ctrl/Cmd + Plus/Minus` - Zoom in/out
- `Ctrl/Cmd + 0` - Reset zoom

## 🚀 Why Developers Love Flutt

### Performance
Flutt uses Playwright's browser automation to ensure fast, reliable device emulation with minimal overhead.

### Comparison

| Feature | Manual DevTools | Chrome Extensions | Flutt |
|---------|----------------|-------------------|--------|
| Setup Time | 15-30 seconds | 10-15 seconds | **< 3 seconds** |
| Auto Flutter Detection | ❌ | ❌ | **✅** |
| True Mobile Emulation | ✅ | Partial | **✅** |
| Custom Devices | Limited | ❌ | **✅** |
| Visual Frames | ❌ | Some | **✅** |
| Cross-Platform | ✅ | ✅ | **✅** |

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Clone the repo
git clone https://github.com/yourusername/flutt.git

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

Built with:
- [Playwright](https://playwright.dev/) - Browser automation
- [Commander.js](https://github.com/tj/commander.js/) - CLI framework
- [Chalk](https://github.com/chalk/chalk) - Terminal styling

---

*If Flutt saves you time, consider giving it a ⭐ on GitHub!*