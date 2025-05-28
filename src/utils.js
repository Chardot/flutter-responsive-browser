import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function findFlutterPort() {
  console.log(chalk.gray('🔍 Searching for running Flutter web servers...'));

  for (let port = 5000; port <= 9999; port += 100) {
    const batchPromises = [];

    for (let p = port; p < port + 100 && p <= 9999; p++) {
      batchPromises.push(checkPort(p));
    }

    const results = await Promise.all(batchPromises);
    const foundPort = results.find((p) => p !== null);

    if (foundPort) {
      return foundPort;
    }
  }

  return null;
}

async function checkPort(port) {
  try {
    const { stdout } = await execAsync(`lsof -i :${port} -P -n | grep LISTEN`, { shell: true });
    if (stdout.includes('dart') || stdout.includes('flutter')) {
      console.log(chalk.green(`✓ Found Flutter server on port ${port}`));
      return port;
    }
  } catch {
    // Port not in use or command failed
  }
  return null;
}

export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
