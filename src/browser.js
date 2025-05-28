import { chromium, devices } from 'playwright';
import chalk from 'chalk';
import { DeviceManager } from './devices.js';

const deviceManager = new DeviceManager();

export async function launchBrowser(url = 'http://localhost:5000', deviceName = 'iPhone 12') {
  console.log(chalk.blue('🚀 Launching browser...'));

  let browser;
  let context;
  let page;

  try {
    const device = deviceManager.getDevice(deviceName);
    if (!device) {
      throw new Error(`Device "${deviceName}" not found. Use --list to see available devices.`);
    }

    // Calculate window size with some padding for better display
    const windowWidth = Math.max(device.viewport.width + 20, 400);
    const windowHeight = device.viewport.height + 100;

    browser = await chromium.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        `--window-size=${windowWidth},${windowHeight}`,
        '--window-position=100,100',
        '--hide-scrollbars',
        '--disable-blink-features=AutomationControlled',
        '--disable-features=TranslateUI',
        '--disable-extensions',
        '--disable-default-apps',
        '--disable-component-extensions-with-background-pages',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
      ],
    });

    context = await browser.newContext({
      ...device,
      ignoreHTTPSErrors: true,
      // Set viewport to exact device size
      viewport: device.viewport,
    });

    page = await context.newPage();

    page.on('error', (error) => {
      console.error(chalk.red('Page error:'), error.message);
    });

    page.on('pageerror', (error) => {
      console.error(chalk.red('Page error:'), error.message);
    });

    console.log(chalk.green(`✓ Browser launched with ${deviceName} emulation`));
    console.log(chalk.gray(`  Viewport: ${device.viewport.width}x${device.viewport.height}`));
    console.log(chalk.gray(`  User Agent: ${device.userAgent.substring(0, 50)}...`));
    console.log(chalk.yellow('  Note: Chrome UI cannot be fully hidden in Playwright'));

    try {
      console.log(chalk.blue(`📱 Navigating to ${url}...`));
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      console.log(chalk.green('✓ Page loaded successfully'));
      
      // Add styles after navigation to minimize visual clutter
      await page.addStyleTag({
        content: `
          /* Hide scrollbars while maintaining scrollability */
          ::-webkit-scrollbar { display: none; }
          * { scrollbar-width: none; }
          
          /* Ensure content fills the viewport */
          html, body { 
            margin: 0 !important; 
            padding: 0 !important; 
            overflow: auto !important;
          }
        `,
      });
    } catch (error) {
      if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
        console.error(chalk.yellow('⚠️  Warning: Could not connect to', url));
        console.error(chalk.yellow('   Make sure your Flutter web server is running'));
        console.error(chalk.gray('   Try: flutter run -d chrome --web-port=5000'));
      } else {
        console.error(chalk.red('Failed to load page:'), error.message);
      }
    }

    await new Promise((resolve) => {
      browser.on('disconnected', resolve);
    });
  } catch (error) {
    console.error(chalk.red('Failed to launch browser:'), error.message);

    if (browser) {
      await browser.close();
    }

    throw error;
  }
}

export function listDevices() {
  return deviceManager.listDevices();
}
