import { readFileSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initElectron } from './electron-main.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read config passed from parent process
const configPath = join(__dirname, '../.device-config.json');
let config;

try {
  config = JSON.parse(readFileSync(configPath, 'utf8'));
  // Clean up config file
  unlinkSync(configPath);
} catch (error) {
  console.error('Error reading device config:', error);
  process.exit(1);
}

// Pass servers to global scope if available
if (config.servers) {
  global.flutterServers = config.servers;
  console.log('Flutter servers loaded:', config.servers.length);
}

// Initialize Electron with the config
initElectron(config.url, config.device);