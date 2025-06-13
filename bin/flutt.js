#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { launchElectronBrowser, listDevices } from '../src/electron-browser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

program
  .name('flutt')
  .description(chalk.cyan('Flutt - Launch browsers in mobile device emulation mode'))
  .version(packageJson.version);

program
  .option('-u, --url <url>', 'URL to open (auto-detects Flutter servers if not specified)')
  .option('-d, --device <device>', 'Device to emulate', 'iPhone 12')
  .option('-l, --list', 'List all available devices')
  .option('--playwright', 'Use Playwright instead of Electron (has Chrome UI)')
  .action(async (options) => {
    try {
      if (options.list) {
        listDevices();
        process.exit(0);
      }

      console.log(chalk.cyan('\n🌐 Flutt\n'));

      if (options.playwright) {
        // Dynamically import Playwright browser only when needed
        const { launchBrowser } = await import('../src/browser.js');
        await launchBrowser(options.url || 'http://localhost:5000', options.device);
      } else {
        await launchElectronBrowser(options.url || 'auto', options.device);
      }
    } catch (error) {
      console.error(chalk.red('\n❌ Error:'), error.message);
      process.exit(1);
    }
  });

program.on('--help', () => {
  console.log('');
  console.log(chalk.gray('Examples:'));
  console.log(chalk.gray('  $ flutt                            # Launch with Electron (no Chrome UI)'));
  console.log(chalk.gray('  $ flutt --url http://localhost:3000'));
  console.log(chalk.gray('  $ flutt --device "Pixel 5"'));
  console.log(chalk.gray('  $ flutt --list'));
  console.log(chalk.gray('  $ flutt --playwright               # Use Playwright (with Chrome UI)'));
  console.log('');
  console.log(chalk.gray('Popular devices:'));
  console.log(chalk.gray('  - iPhone 12, iPhone 13, iPhone 14'));
  console.log(chalk.gray('  - Pixel 5, Pixel 7'));
  console.log(chalk.gray('  - iPad, iPad Pro'));
  console.log('');
  console.log(chalk.gray('Note: Electron mode provides a frameless window for better mobile preview'));
  console.log('');
});

program.parse();
