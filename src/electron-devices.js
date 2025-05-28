import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { builtInDevices } from './devices-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class ElectronDeviceManager {
  constructor() {
    this.builtInDevices = builtInDevices;
    this.customDevices = {};
    this.loadCustomDevices();
  }

  loadCustomDevices() {
    try {
      const configPath = join(__dirname, '../config/default-devices.json');
      if (existsSync(configPath)) {
        const config = JSON.parse(readFileSync(configPath, 'utf8'));
        if (config.devices && Array.isArray(config.devices)) {
          config.devices.forEach((device) => {
            if (this.validateDevice(device)) {
              this.customDevices[device.name] = device;
            }
          });
        }
      }
    } catch (error) {
      console.warn(chalk.yellow('Warning: Could not load custom devices:'), error.message);
    }
  }

  validateDevice(device) {
    const required = ['name', 'viewport', 'userAgent'];
    const hasRequired = required.every((field) => device[field]);

    if (!hasRequired) {
      console.warn(chalk.yellow('Invalid device configuration: missing required fields'));
      return false;
    }

    if (!device.viewport.width || !device.viewport.height) {
      console.warn(chalk.yellow(`Invalid device "${device.name}": viewport must have width and height`));
      return false;
    }

    return true;
  }

  getAllDevices() {
    return {
      ...this.builtInDevices,
      ...this.customDevices,
    };
  }

  getDevice(name) {
    const allDevices = this.getAllDevices();

    if (allDevices[name]) {
      return allDevices[name];
    }

    const fuzzyMatch = this.fuzzySearch(name);
    if (fuzzyMatch) {
      console.log(chalk.gray(`Using device "${fuzzyMatch}" (matched from "${name}")`));
      return allDevices[fuzzyMatch];
    }

    return null;
  }

  fuzzySearch(query) {
    const allDevices = this.getAllDevices();
    const deviceNames = Object.keys(allDevices);
    const lowerQuery = query.toLowerCase();

    const exactMatch = deviceNames.find((name) => name.toLowerCase() === lowerQuery);
    if (exactMatch) return exactMatch;

    const startsWithMatch = deviceNames.find((name) => name.toLowerCase().startsWith(lowerQuery));
    if (startsWithMatch) return startsWithMatch;

    const containsMatch = deviceNames.find((name) => name.toLowerCase().includes(lowerQuery));
    if (containsMatch) return containsMatch;

    const wordsMatch = deviceNames.find((name) => {
      const nameWords = name.toLowerCase().split(/\s+/);
      const queryWords = lowerQuery.split(/\s+/);
      return queryWords.every((qWord) => nameWords.some((nWord) => nWord.includes(qWord)));
    });
    if (wordsMatch) return wordsMatch;

    return null;
  }

  listDevices(showBuiltIn = true, showCustom = true) {
    const allDevices = this.getAllDevices();
    const builtInNames = Object.keys(this.builtInDevices);
    const customNames = Object.keys(this.customDevices);

    console.log(chalk.blue('\n📱 Available devices:\n'));

    if (showBuiltIn && builtInNames.length > 0) {
      console.log(chalk.cyan('Built-in devices:'));
      builtInNames.sort().forEach((name) => {
        const device = allDevices[name];
        console.log(chalk.white(`  ${name}`));
        console.log(chalk.gray(`    ${device.viewport.width}x${device.viewport.height} • ${device.userAgent.substring(0, 40)}...`));
      });
    }

    if (showCustom && customNames.length > 0) {
      console.log(chalk.cyan('\nCustom devices:'));
      customNames.sort().forEach((name) => {
        const device = allDevices[name];
        console.log(chalk.white(`  ${name}`));
        console.log(chalk.gray(`    ${device.viewport.width}x${device.viewport.height} • ${device.userAgent.substring(0, 40)}...`));
      });
    }

    console.log('\n');
    return Object.keys(allDevices).sort();
  }
}