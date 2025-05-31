import { app, BrowserWindow, Menu, ipcMain, desktopCapturer } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ElectronDeviceManager } from './electron-devices.js';
import { writeFile } from 'fs/promises';
import { homedir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;
let currentDevice;
let currentUrl;
const deviceManager = new ElectronDeviceManager();

function createDeviceMenu() {
  const devices = deviceManager.getAllDevices();
  const deviceMenuItems = [];

  // Group devices by type
  const iPhones = [];
  const iPads = [];
  const androids = [];
  const others = [];

  Object.entries(devices).forEach(([name, device]) => {
    const menuItem = {
      label: name,
      type: 'radio',
      checked: currentDevice && currentDevice.name === name,
      click: () => switchDevice(name, device),
    };

    if (name.toLowerCase().includes('iphone')) {
      iPhones.push(menuItem);
    } else if (name.toLowerCase().includes('ipad')) {
      iPads.push(menuItem);
    } else if (name.toLowerCase().includes('pixel') || name.toLowerCase().includes('galaxy')) {
      androids.push(menuItem);
    } else {
      others.push(menuItem);
    }
  });

  // Build menu structure
  if (iPhones.length > 0) {
    deviceMenuItems.push({ label: 'iPhone', enabled: false });
    deviceMenuItems.push(...iPhones);
    deviceMenuItems.push({ type: 'separator' });
  }

  if (iPads.length > 0) {
    deviceMenuItems.push({ label: 'iPad', enabled: false });
    deviceMenuItems.push(...iPads);
    deviceMenuItems.push({ type: 'separator' });
  }

  if (androids.length > 0) {
    deviceMenuItems.push({ label: 'Android', enabled: false });
    deviceMenuItems.push(...androids);
    deviceMenuItems.push({ type: 'separator' });
  }

  if (others.length > 0) {
    deviceMenuItems.push({ label: 'Other', enabled: false });
    deviceMenuItems.push(...others);
  }

  return deviceMenuItems;
}

function switchDevice(deviceName, device) {
  if (!mainWindow || !currentUrl) return;

  // Update current device
  currentDevice = { ...device, name: deviceName };

  // Calculate new window size
  const titleBarHeight = 28;
  const windowWidth = Math.max(device.viewport.width, 320);
  const windowHeight = device.viewport.height + titleBarHeight;

  // Resize window
  mainWindow.setSize(windowWidth, windowHeight);
  mainWindow.center();

  // Update the content with new device info
  const deviceInfo = {
    device: deviceName,
    viewport: `${device.viewport.width}×${device.viewport.height}`
  };
  
  mainWindow.webContents.executeJavaScript(`
    try {
      // Update stored data
      window.currentUserAgent = ${JSON.stringify(device.userAgent)};
      
      // Update device info in UI
      document.getElementById('device-name').textContent = ${JSON.stringify(deviceName)};
      document.getElementById('viewport-size').textContent = ${JSON.stringify(deviceInfo.viewport)};
      document.getElementById('separator').style.display = 'inline';
      
      // Reload iframe to apply new device settings
      const iframe = document.getElementById('content-frame');
      const currentSrc = iframe.src;
      iframe.src = 'about:blank';
      setTimeout(() => {
        iframe.src = currentSrc;
      }, 100);
    } catch (e) {
      console.error('Error updating device:', e);
    }
  `).catch(console.error);

  // Update the menu to show the new selection
  updateApplicationMenu();
}

function updateApplicationMenu() {
  const template = [
    {
      label: 'Flutter Responsive Browser',
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'Device',
      submenu: createDeviceMenu(),
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

export function createWindow(url, device) {
  // Store current device and URL
  currentDevice = device;
  currentUrl = url;

  // Calculate window size based on device viewport
  const titleBarHeight = 28; // Height of our custom title bar
  const windowWidth = Math.max(device.viewport.width, 320);
  const windowHeight = device.viewport.height + titleBarHeight;

  // Create frameless window for clean appearance
  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    frame: false, // Frameless window
    transparent: false,
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'electron-preload.js'),
      webSecurity: true,
    },
    resizable: false, // Lock to device size
    center: true,
    show: false, // Don't show until ready
    alwaysOnTop: false,
    fullscreenable: false,
  });

  // Set up the application menu with device options
  updateApplicationMenu();

  // We'll handle device emulation in the iframe instead
  // This keeps the wrapper UI unaffected

  // Setup IPC handlers
  ipcMain.on('minimize-window', () => {
    if (mainWindow) {
      mainWindow.minimize();
    }
  });

  ipcMain.on('close-window', () => {
    if (mainWindow) {
      mainWindow.close();
    }
  });

  ipcMain.on('take-screenshot', async () => {
    if (!mainWindow) return;
    
    try {
      // Get the bounds of the iframe content (excluding the 28px title bar)
      const [width, height] = mainWindow.getContentSize();
      const rect = {
        x: 0,
        y: 28, // Skip the title bar
        width: width,
        height: height - 28 // Subtract title bar height
      };
      
      // Capture only the iframe area
      const image = await mainWindow.webContents.capturePage(rect);
      const buffer = image.toPNG();
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      const filename = `frb-screenshot-${timestamp}.png`;
      const downloadsPath = join(homedir(), 'Downloads', filename);
      
      // Save to Downloads folder
      await writeFile(downloadsPath, buffer);
      console.log(`✓ Screenshot saved to: ${downloadsPath}`);
    } catch (error) {
      console.error('Failed to take screenshot:', error);
    }
  });

  ipcMain.on('refresh-servers', async () => {
    if (!mainWindow) return;
    
    // Import the flutter detector dynamically
    const { detectFlutterServers } = await import('./flutter-detector.js');
    
    console.log('🔍 Refreshing Flutter servers...');
    const servers = await detectFlutterServers();
    global.flutterServers = servers;
    
    // Send updated servers to the renderer
    mainWindow.webContents.executeJavaScript(`
      const iframe = document.getElementById('content-frame');
      if (iframe && iframe.contentWindow) {
        window.flutterServers = ${JSON.stringify(servers)};
        iframe.contentWindow.postMessage({ type: 'servers', servers: ${JSON.stringify(servers)} }, '*');
      }
    `).catch(console.error);
  });

  // Handle navigation errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    if (errorCode === -102) { // ERR_CONNECTION_REFUSED
      console.error(`\n⚠️  Warning: Could not connect to ${validatedURL}`);
      console.error('   Make sure your Flutter web server is running');
      console.error('   Try: flutter run -d chrome --web-port=5000\n');
    }
  });

  // Always load the wrapper with titlebar
  mainWindow.loadFile(join(__dirname, 'wrapper-with-titlebar.html'));
  
  // Once wrapper is loaded, handle the content
  mainWindow.webContents.once('did-finish-load', () => {
    if (url === 'selection') {
      // Show the server selection page
      const selectionUrl = `file://${join(__dirname, 'server-selection.html')}`;
      const deviceInfo = {
        device: 'Scanning...',
        viewport: ''
      };
      
      const servers = global.flutterServers || [];
      
      mainWindow.webContents.executeJavaScript(`
        console.log('Loading selection page with ${servers.length} servers...');
        window.loadContent(${JSON.stringify(selectionUrl)}, ${JSON.stringify(deviceInfo)}, ${JSON.stringify(servers)});
        
        // Also inject servers after iframe loads
        setTimeout(() => {
          const iframe = document.getElementById('content-frame');
          if (iframe) {
            // Use both methods for reliability
            const injectServers = () => {
              try {
                // Method 1: Direct property setting
                if (iframe.contentWindow && iframe.contentWindow.displayServers) {
                  iframe.contentWindow.servers = ${JSON.stringify(servers)};
                  iframe.contentWindow.displayServers(iframe.contentWindow.servers);
                }
                
                // Method 2: PostMessage (more reliable for cross-origin)
                iframe.contentWindow.postMessage({
                  type: 'servers',
                  servers: ${JSON.stringify(servers)}
                }, '*');
                
                console.log('Servers sent to iframe');
              } catch (e) {
                console.error('Error injecting servers:', e);
                // Retry on error
                setTimeout(injectServers, 200);
              }
            };
            
            // Check if iframe is loaded
            if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
              injectServers();
            } else {
              // Wait for iframe to load
              iframe.addEventListener('load', injectServers);
              // Also try after a delay as backup
              setTimeout(injectServers, 500);
            }
          }
        }, 500);
      `).catch(console.error);
      
      // Handle server selection
      ipcMain.once('select-server', (event, server) => {
        currentUrl = server.url;
        loadAppInWrapper(server.url, device);
      });
    } else {
      // Load the app directly
      loadAppInWrapper(url, device);
    }
  });
  
  function loadAppInWrapper(targetUrl, targetDevice) {
    const deviceInfo = {
      device: targetDevice.name || 'Device',
      viewport: `${targetDevice.viewport.width}×${targetDevice.viewport.height}`
    };
    
    mainWindow.webContents.executeJavaScript(`
      try {
        window.currentUserAgent = ${JSON.stringify(targetDevice.userAgent)};
        window.loadContent(${JSON.stringify(targetUrl)}, ${JSON.stringify(deviceInfo)});
      } catch (e) {
        console.error('Error loading app:', e);
      }
    `).catch(console.error);
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Open DevTools for debugging
    // if (url === 'selection') {
    //   mainWindow.webContents.openDevTools();
    // }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
    app.quit();
  });

  return mainWindow;
}

// Handle app ready
export function initElectron(url, device) {
  app.whenReady().then(() => {
    createWindow(url, device);

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow(url, device);
      }
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}