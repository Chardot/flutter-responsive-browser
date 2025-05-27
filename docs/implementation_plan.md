# Flutter Responsive Browser - Implementation Plan for Claude Code

## Project Overview

Create a standalone tool that launches a browser window with mobile device emulation for Flutter web development, eliminating the need to manually open Chrome DevTools and switch to responsive mode. This project will be developed entirely by Claude Code (Claude Opus 4).

## Goals

- **Primary**: Launch a browser that automatically opens in mobile device emulation mode
- **Secondary**: Support multiple device presets and custom configurations
- **Nice-to-have**: Integration with Flutter toolchain and visual device frames

## Technology Stack

- **Node.js**: Runtime environment
- **Playwright**: Browser automation and device emulation
- **Commander.js**: CLI argument parsing
- **Chalk**: Terminal output styling

## Development Approach with Claude Code

### Initial Setup Prompt

```
Create a new Node.js project called "flutter-responsive-browser" with the following structure:
- Initialize npm with appropriate package.json
- Install playwright, commander, and chalk as dependencies
- Create the directory structure as specified
- Set up ESLint with standard configuration
```

### Project Structure

```
flutter-responsive-browser/
├── package.json
├── README.md
├── bin/
│   └── frb.js                  # CLI entry point
├── docs/
│   └── implementation_plan.md  # Dev implementation plan
├── src/
│   ├── index.js                # Main application logic
│   ├── devices.js              # Device configurations
│   ├── browser.js              # Browser launch logic
│   └── utils.js                # Helper functions
├── config/
│   └── default-devices.json    # Default device presets
└── examples/
    └── flutter-integration.sh
```

## Implementation Phases

### Phase 1: Core Functionality

#### Task 1.1: Project Foundation
**Prompt for Claude Code:**
```
Set up the flutter-responsive-browser project:
1. Create package.json with name "flutter-responsive-browser", version "1.0.0"
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
3. Accept a URL parameter (default to http://localhost:5000)
4. Keep the browser window open until manually closed
5. Export the launch function for use in other modules
Include proper error handling for connection failures
```

#### Task 1.3: CLI Interface
**Prompt for Claude Code:**
```
Create the CLI interface in bin/frb.js:
1. Make it executable with #!/usr/bin/env node
2. Use Commander.js to parse arguments: --url, --device, --list
3. Import and use the browser launch function
4. Add colorful output with Chalk
5. Handle errors gracefully with helpful messages
6. Add --version and --help support
```

### Phase 2: Enhanced Features

#### Task 2.1: Device Management System
**Prompt for Claude Code:**
```
Implement a comprehensive device management system:
1. Create src/devices.js with a DeviceManager class
2. Add built-in device presets for popular devices (iPhone 12/13/14, Pixel 5, iPad)
3. Load custom devices from config/default-devices.json
4. Implement device validation
5. Add method to list all available devices
6. Support device lookup by name (case-insensitive, fuzzy matching)
```

#### Task 2.2: Visual Enhancements
**Prompt for Claude Code:**
```
Add visual enhancement features to the browser window:
1. Implement optional device frame rendering using CSS injection
2. Add zoom controls (50%, 75%, 100%, 125%, 150%)
3. Create a device info overlay showing current device specs
4. Add dark/light mode toggle functionality
5. Implement these as command-line flags: --frame, --zoom, --info
```

#### Task 2.3: Developer Experience Improvements
**Prompt for Claude Code:**
```
Enhance the developer experience:
1. Add auto-detection of running Flutter web servers (scan ports 5000-9999)
2. Implement hot-reload preservation (maintain viewport on page reload)
3. Add support for launching multiple device windows simultaneously
4. Create keyboard shortcuts: Cmd/Ctrl+D (device switcher), Cmd/Ctrl+R (rotate)
5. Add --watch flag to auto-restart on Flutter hot reload
```

### Phase 3: Advanced Features

#### Task 3.1: Flutter Integration
**Prompt for Claude Code:**
```
Create Flutter-specific integrations:
1. Create examples/flutter-integration.sh script
2. Add Flutter port detection logic in src/utils.js
3. Create VS Code task configuration in examples/.vscode/tasks.json
4. Add Flutter-specific documentation in README.md
5. Implement --flutter flag that auto-detects and connects to Flutter web server
```

#### Task 3.2: Advanced Emulation Features
**Prompt for Claude Code:**
```
Add advanced device emulation capabilities:
1. Implement network throttling (3G, 4G, offline) with --network flag
2. Add geolocation mocking with --location flag
3. Create orientation toggle (portrait/landscape) with --rotate flag
4. Add touch gesture visualization overlay
5. Implement device capability restrictions (camera, microphone)
```

#### Task 3.3: Configuration & Persistence
**Prompt for Claude Code:**
```
Build configuration and persistence system:
1. Create user config file at ~/.frb/config.json
2. Save last used device and preferences
3. Support project-specific .frbrc files
4. Implement custom device saving with --save-device flag
5. Add configuration commands: config get/set/reset
```

### Phase 4: Polish & Distribution

#### Task 4.1: Testing Suite
**Prompt for Claude Code:**
```
Create comprehensive test suite:
1. Set up Jest testing framework
2. Write unit tests for all core modules (aim for 80% coverage)
3. Create integration tests for CLI commands
4. Add GitHub Actions workflow for CI/CD
5. Include cross-platform testing matrix (Windows, macOS, Linux)
```

#### Task 4.2: Documentation
**Prompt for Claude Code:**
```
Create complete documentation:
1. Improve README.md with examples and screenshots
2. Generate API documentation using JSDoc
3. Create CONTRIBUTING.md with development guidelines
4. Write Flutter integration guide in docs/flutter-guide.md
5. Add troubleshooting section for common issues
```

#### Task 4.3: Distribution Package
**Prompt for Claude Code:**
```
Prepare for distribution:
1. Add npm publication configuration in package.json
2. Create release script that builds and packages the tool
3. Generate standalone executables using pkg
4. Create installation instructions for npm, Homebrew, and direct download
5. Set up automated release workflow with GitHub Actions
```

## Claude Code Interaction Guidelines

### Effective Prompting Strategies

1. **Be Specific**: Include exact file paths and function names
2. **Iterative Development**: Build features incrementally
3. **Request Tests**: Ask for tests alongside implementation
4. **Code Review**: Request Claude Code to review and optimize after implementation

### Example Development Session

```
You: "Create the DeviceManager class in src/devices.js with methods to load built-in devices, 
add custom devices, and search devices by name. Include iPhone and Android presets."

[Claude Code implements]

You: "Add fuzzy search to the device lookup so 'iphone' matches 'iPhone 12 Pro'"

[Claude Code enhances]

You: "Write comprehensive tests for DeviceManager in tests/devices.test.js"

[Claude Code adds tests]
```

### Quality Checkpoints

After each phase, request Claude Code to:
1. Run ESLint and fix any issues
2. Ensure all functions have JSDoc comments
3. Verify error handling is comprehensive
4. Check for potential performance issues
5. Review code for best practices

## Success Metrics

- **Code Quality**: 80%+ test coverage, zero ESLint errors
- **Performance**: < 3 seconds from command to rendered page
- **Usability**: Intuitive CLI with helpful error messages
- **Documentation**: Clear, example-rich documentation

## Tips for Working with Claude Code

1. **Incremental Building**: Don't try to build everything at once
2. **Test Frequently**: Request test runs after each major feature
3. **Review Output**: Always review generated code for correctness
4. **Iterate**: Don't hesitate to request improvements or fixes
5. **Context Preservation**: Reference previous implementations when building related features

## Project Milestones

1. **Milestone 1**: Basic working tool (Phase 1 complete)
2. **Milestone 2**: Feature-complete with device management (Phase 2 complete)
3. **Milestone 3**: Production-ready with tests and docs (Phase 3-4 complete)

## Getting Started with Claude Code

Begin with:
```
"Create a new Node.js project for flutter-responsive-browser with the initial 
project structure, package.json, and basic README as specified in the implementation plan"
```

Then proceed task by task through the phases, using the specific prompts provided for each task.
