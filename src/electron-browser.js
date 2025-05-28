import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';
import { ElectronDeviceManager } from './electron-devices.js';
import { detectFlutterServers } from './flutter-detector.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const deviceManager = new ElectronDeviceManager();

export async function launchElectronBrowser(url = 'auto', deviceName = 'iPhone 12') {
  console.log(chalk.blue('🚀 Launching Electron browser...'));
  
  // Auto-detect Flutter servers if URL is 'auto' or not provided
  if (url === 'auto' || url === 'http://localhost:5000') {
    const servers = await detectFlutterServers();
    
    if (servers.length === 0) {
      console.log(chalk.yellow('⚠️  No Flutter servers found'));
      console.log(chalk.gray('Starting with server selection page...'));
      url = 'selection'; // Special marker for selection page
    } else if (servers.length === 1) {
      // Single server found, use it automatically
      url = servers[0].url;
      console.log(chalk.green(`✓ Auto-connecting to ${servers[0].projectName} at ${url}`));
    } else {
      // Multiple servers found, show selection page
      console.log(chalk.blue(`Found ${servers.length} Flutter servers`));
      url = 'selection'; // Special marker for selection page
      
      // Store servers for the selection page
      global.flutterServers = servers;
      console.log(chalk.gray(`Servers to display: ${JSON.stringify(servers.map(s => ({ name: s.projectName, port: s.port })))}`));
    }
  }

  const device = deviceManager.getDevice(deviceName);
  if (!device) {
    throw new Error(`Device "${deviceName}" not found. Use --list to see available devices.`);
  }

  console.log(chalk.green(`✓ Launching with ${deviceName} emulation`));
  console.log(chalk.gray(`  Viewport: ${device.viewport.width}x${device.viewport.height}`));
  console.log(chalk.gray(`  User Agent: ${device.userAgent.substring(0, 50)}...`));
  console.log(chalk.green('  ✓ Frameless window (no Chrome UI)')); 

  // Write device config to temp file to pass to Electron process
  const configPath = join(__dirname, '../.device-config.json');
  const { writeFileSync } = await import('fs');
  const configData = { 
    url, 
    device: {
      ...device,
      name: deviceName // Ensure we pass the device name
    }
  };
  
  // Include servers if showing selection page
  if (url === 'selection' && global.flutterServers) {
    configData.servers = global.flutterServers;
  }
  
  writeFileSync(configPath, JSON.stringify(configData));

  // Launch Electron process
  const electronPath = join(__dirname, 'electron-launcher.js');
  const electron = spawn('npx', ['electron', electronPath], {
    stdio: 'inherit',
    env: { ...process.env },
  });

  console.log(chalk.blue(`📱 Opening ${url}...`));

  // Handle Electron process exit
  electron.on('close', (code) => {
    if (code !== 0) {
      console.error(chalk.red(`Electron process exited with code ${code}`));
    }
    process.exit(code);
  });

  // Handle termination signals
  process.on('SIGINT', () => {
    electron.kill();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    electron.kill();
    process.exit(0);
  });
}

export function listDevices() {
  return deviceManager.listDevices();
}