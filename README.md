# Flutter Responsive Browser (FRB)

**Launch Flutter web apps directly in mobile device emulation mode. No more manual DevTools setup.**

## 🚀 What is FRB?

Flutter Responsive Browser is a developer tool that automatically launches your Flutter web applications in a browser window with mobile device emulation enabled. It eliminates the repetitive task of manually opening Chrome DevTools, switching to responsive mode, and selecting a device every time you debug your Flutter app.

## ✨ Features

- **📱 Instant Mobile Preview** - Launch your Flutter app directly in mobile viewport with proper device emulation
- **🎯 Accurate Device Emulation** - True mobile rendering with correct user agents, touch events, and viewport behavior
- **📐 Multiple Device Presets** - iPhone, Android, and tablet configurations ready to use
- **🎨 Visual Enhancements** - Optional device frames, zoom controls, and dark mode support
- **🔄 Flutter Integration** - Auto-detects running Flutter web servers
- **⚡ Lightning Fast** - From command to preview in under 3 seconds
- **🛠️ Developer Friendly** - Simple CLI with intuitive commands
- **🖥️ Cross-Platform** - Works on Windows, macOS, and Linux

## 🎯 Why FRB?

If you're a Flutter developer or UX designer working on responsive web apps, you know the pain:

1. Run `flutter run -d chrome`
2. Right-click → Inspect
3. Click responsive mode icon
4. Select device from dropdown
5. Adjust zoom level
6. **Repeat every single time** 😫

With FRB, it's just:
```bash
frb
```

That's it. Your app opens instantly in mobile view, ready for development.

## 🚦 Quick Start

```bash
# Install globally
npm install -g flutter-responsive-browser

# Launch with default iPhone emulation
frb

# Specify a device
frb --device "Pixel 5"

# List available devices
frb --list
```

## 📱 Supported Devices

- **iOS**: iPhone 12/13/14/15, iPhone SE, iPad, iPad Pro
- **Android**: Pixel 5/6/7, Samsung Galaxy S21, OnePlus 9
- **Tablets**: iPad Air, iPad Pro, Android tablets
- **Custom**: Define your own device configurations

## 🔧 Advanced Usage

```bash
# Auto-detect Flutter server
frb --flutter

# Launch with device frame
frb --frame

# Custom zoom level
frb --zoom 75

# Multiple devices at once
frb --device "iPhone 12" --device "iPad"

# Network throttling
frb --network 3G

# Save custom device preset
frb --save-device "My Device" --width 380 --height 820
```

## 🤝 Perfect For

- **Flutter Developers** building responsive web applications
- **UX Designers** creating and testing mobile-first designs
- **QA Engineers** testing across multiple device viewports
- **Frontend Developers** who need quick mobile previews

## 🛠️ Requirements

- Node.js 14 or higher
- Flutter SDK (for Flutter integration)
- Chrome/Chromium browser

## 📦 Installation Options

### npm (Recommended)
```bash
npm install -g flutter-responsive-browser
```

### Homebrew (macOS)
```bash
brew tap yourusername/frb
brew install flutter-responsive-browser
```

### Direct Download
Download platform-specific binaries from the [releases page](https://github.com/yourusername/flutter-responsive-browser/releases).

## 🎯 VS Code Integration

Add to your `.vscode/tasks.json`:
```json
{
  "label": "Flutter Mobile Preview",
  "type": "shell",
  "command": "frb",
  "args": ["--flutter", "--device", "iPhone 12"],
  "problemMatcher": []
}
```

## 🤔 How It Works

FRB uses Playwright's browser automation to launch Chromium with true mobile device emulation. Unlike simply resizing a browser window, it provides:

- Correct mobile user agent strings
- Touch event simulation
- Device pixel ratio emulation
- Mobile viewport behavior
- Native mobile form controls

This ensures your Flutter web app behaves exactly as it would on a real mobile device.

## 📊 Comparison

| Method | Setup Time | True Mobile Emulation | Persistent Settings |
|--------|------------|----------------------|-------------------|
| Manual DevTools | 30-60s | ✅ | ❌ |
| Browser Resize | 5s | ❌ | ❌ |
| **FRB** | **< 3s** | **✅** | **✅** |

## 🚧 Roadmap

- [ ] Safari/WebKit device emulation
- [ ] Flutter plugin for tighter integration  
- [ ] Cloud-based device farm
- [ ] Visual regression testing
- [ ] Figma design handoff integration

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

Built with [Playwright](https://playwright.dev/) for browser automation and inspired by the Flutter community's need for better mobile development workflows.

---

**Made with ❤️ for Flutter developers who value their time**

*If FRB saves you time, consider giving it a ⭐ on GitHub!*
