# Flutt - Implementation Plan

## Project Overview
A developer tool that launches browsers in mobile device emulation mode for Flutter web development.

## Goals
- Launch browser with pre-configured mobile device emulation
- Support multiple device presets (iPhone, Android, tablets)
- Integrate with Flutter development workflow
- Provide visual enhancements (device frames, zoom controls)
- Auto-detect running Flutter web servers

## Technical Stack
- **Core**: Node.js with ES modules
- **Browser Automation**: Playwright
- **CLI Framework**: Commander.js
- **Terminal Styling**: Chalk
- **Testing**: Jest

## Architecture
- CLI interface for user commands
- Browser controller using Playwright
- Device configuration manager
- Flutter server detector
- Visual enhancement layer

## Directory Structure

### Phase 0: Project Setup

Create a new Node.js project called "flutt" with the following structure:

```
flutt/
├── package.json
├── README.md
├── bin/
│   └── flutt.js                # CLI entry point
├── docs/
│   └── implementation_plan.md  # Dev implementation plan
├── src/
│   ├── index.js                # Main application logic
│   ├── devices.js              # Device configurations
│   ├── browser.js              # Browser launch logic
│   ├── flutter-detector.js     # Flutter server detection
│   ├── visual-enhancements.js # Device frames, zoom
│   └── config.js               # User configuration
├── test/
│   └── *.test.js               # Test files
└── examples/
    └── flutter-integration.sh  # Example scripts
```

### Phase 1: Core Functionality

#### Task 1.1: Project Foundation
**Prompt for Claude Code:**
```
Set up the flutt project:
1. Create package.json with name "flutt", version "1.0.0"
2. Add dependencies: playwright@latest, commander@9, chalk@5
3. Create the directory structure listed above
4. Add npm scripts: "start", "dev", "test"
5. Create .gitignore for Node.js projects
6. Initialize ESLint with airbnb-base configuration
```

#### Task 1.2: Basic Browser Launch
**Prompt for Claude Code:**
```
Implement the core browser launch functionality in src/browser.js:
1. Create a function that launches Chromium with Playwright
2. Set default device emulation to iPhone 12
3. Enable touch events and mobile viewport
4. Add error handling for browser launch failures
5. Export the launch function
```

#### Task 1.3: CLI Interface
**Prompt for Claude Code:**
```
Create the CLI interface in bin/flutt.js:
1. Use Commander.js to parse command line arguments
2. Add options: --url, --device, --list-devices
3. Add colorful output with Chalk
4. Handle errors gracefully with helpful messages
5. Make the file executable (shebang)
```

### Phase 2: Device Management

#### Task 2.1: Device Configurations
**Prompt for Claude Code:**
```
Create device configuration system in src/devices.js:
1. Define device presets for iPhone (12, 13, 14 series)
2. Add Android devices (Pixel series, Galaxy)
3. Include tablets (iPad, Android tablets)
4. Each device should have: name, viewport, userAgent, deviceScaleFactor
5. Export functions to get device by name and list all devices
```

#### Task 2.2: Device Selection
**Prompt for Claude Code:**
```
Enhance the CLI to support device selection:
1. Implement --list-devices flag to show all available devices
2. Add device validation when --device flag is used
3. Group devices by category (iPhone, Android, Tablet) in list output
4. Add fuzzy matching for device names (e.g., "iphone 12" matches "iPhone 12")
```

### Phase 3: Flutter Integration

#### Task 3.1: Flutter Server Detection
**Prompt for Claude Code:**
```
Implement Flutter server detection in src/flutter-detector.js:
1. Scan common Flutter ports (3000-9999)
2. Check for Flutter web server signatures
3. Return list of detected servers with port and project info
4. Add timeout and error handling
```

#### Task 3.2: Auto-launch Integration
**Prompt for Claude Code:**
```
Add Flutter auto-detection to the CLI:
1. When no URL is provided, scan for Flutter servers
2. If one server found, auto-launch it
3. If multiple found, show selection menu
4. If none found, show helpful error message
```

### Phase 4: Visual Enhancements

#### Task 4.1: Device Frames
**Prompt for Claude Code:**
```
Implement device frames in src/visual-enhancements.js:
1. Create overlay system for device frames
2. Add frame images for major devices
3. Implement toggle functionality
4. Ensure frames scale with zoom
```

#### Task 4.2: Zoom Controls
**Prompt for Claude Code:**
```
Add zoom control functionality:
1. Implement zoom in/out keyboard shortcuts
2. Add zoom level indicator
3. Save zoom preference per device
4. Reset zoom option
```

### Phase 5: Configuration & Polish

#### Task 5.1: User Configuration
**Prompt for Claude Code:**
```
Create user configuration system:
1. Create config file at ~/.flutt/config.json
2. Store user preferences: default device, theme, zoom level
3. Add CLI flags to update config
4. Implement config validation
```

#### Task 5.2: Error Handling & UX
**Prompt for Claude Code:**
```
Polish the user experience:
1. Add loading spinners for long operations
2. Implement graceful shutdown on Ctrl+C
3. Add helpful error messages with solutions
4. Create --help with examples
5. Add version command
```

### Phase 6: Testing & Documentation

#### Task 6.1: Unit Tests
**Prompt for Claude Code:**
```
Create comprehensive test suite:
1. Test device configuration loading
2. Test Flutter server detection
3. Test CLI argument parsing
4. Test error scenarios
5. Mock Playwright for browser tests
```

#### Task 6.2: Documentation
**Prompt for Claude Code:**
```
Create user documentation:
1. Write comprehensive README with examples
2. Add inline code documentation
3. Create CONTRIBUTING.md
4. Add example scripts in examples/
5. Document keyboard shortcuts
```

### Phase 7: Distribution

#### Task 7.1: Package Preparation
**Prompt for Claude Code:**
```
Prepare for npm distribution:
1. Update package.json with all metadata
2. Create .npmignore
3. Add prepublish scripts
4. Test npm pack locally
5. Add installation instructions
```

#### Task 7.2: Cross-platform Support
**Prompt for Claude Code:**
```
Ensure cross-platform compatibility:
1. Test on Windows, macOS, Linux
2. Handle platform-specific paths
3. Add platform-specific installation notes
4. Create GitHub Actions for CI/CD
```

## Implementation Timeline

- **Week 1**: Phase 1-2 (Core functionality & Device management)
- **Week 2**: Phase 3-4 (Flutter integration & Visual enhancements)
- **Week 3**: Phase 5-6 (Configuration & Testing)
- **Week 4**: Phase 7 (Distribution & Polish)

## Success Criteria

1. Can launch browser with mobile emulation in < 3 seconds
2. Supports at least 20 device presets
3. Auto-detects Flutter servers reliably
4. Works on all major platforms
5. Has > 80% test coverage
6. Clear documentation with examples

This implementation plan provides a clear roadmap for development, with specific tasks that can be given to Claude Code for implementation.