import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { initElectron } from './electron-main.js';
import { detectFlutterServers } from './flutter-detector.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Default device for packaged app
const defaultDevice = {
  name: 'iPhone 12',
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
  viewport: {
    width: 390,
    height: 844,
  },
};

// Auto-detect Flutter servers or show selection
async function startApp() {
  const servers = await detectFlutterServers();
  
  let url = 'selection'; // Default to selection page
  
  if (servers.length === 1) {
    // Single server found, use it automatically
    url = servers[0].url;
    console.log(`Auto-connecting to ${servers[0].projectName} at ${url}`);
  } else if (servers.length > 1) {
    // Multiple servers found, show selection page
    global.flutterServers = servers;
  }
  
  // Initialize Electron with default device
  initElectron(url, defaultDevice);
}

// Start the app
startApp().catch(console.error);