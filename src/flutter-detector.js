import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';

const execAsync = promisify(exec);

export async function detectFlutterServers() {
  console.log(chalk.gray('🔍 Scanning for Flutter web servers...'));
  
  const servers = [];
  
  try {
    // First, find all dart/flutter processes with their ports using lsof
    // This is much more efficient than scanning individual ports
    const { stdout } = await execAsync(
      `lsof -iTCP -sTCP:LISTEN -P -n | grep -E '(dart|flutter)' | awk '{print $2, $9}' | sort -u || true`,
      { shell: true, timeout: 5000 }
    );
    
    if (stdout) {
      const lines = stdout.trim().split('\n').filter(line => line);
      
      for (const line of lines) {
        const parts = line.split(' ');
        if (parts.length >= 2) {
          const pid = parts[0];
          const address = parts[1];
          
          // Extract port from address (format: *:PORT or IP:PORT)
          const portMatch = address.match(/:(\d+)$/);
          if (portMatch) {
            const port = parseInt(portMatch[1]);
            
            // Check if it's a web server port (typically > 3000)
            if (port >= 3000 && port <= 70000) {
              const server = await getServerInfo(pid, port);
              if (server) {
                servers.push(server);
              }
            }
          }
        }
      }
    }
    
    // If no servers found with the efficient method, fall back to checking common ports
    if (servers.length === 0) {
      console.log(chalk.gray('No Flutter processes found, checking common ports...'));
      
      const commonPorts = [
        3000, 3001, 3002,
        5000, 5001, 5002,
        8080, 8081, 8082,
        // Add some specific ports in the 50000-70000 range
        ...Array.from({ length: 10 }, (_, i) => 50000 + i * 1000),
        ...Array.from({ length: 10 }, (_, i) => 60000 + i * 1000),
      ];
      
      const batchSize = 5;
      for (let i = 0; i < commonPorts.length; i += batchSize) {
        const batch = commonPorts.slice(i, i + batchSize);
        const batchPromises = batch.map(port => checkPort(port));
        const results = await Promise.all(batchPromises);
        
        results.forEach((server) => {
          if (server) {
            servers.push(server);
          }
        });
      }
    }
  } catch (error) {
    console.error(chalk.yellow('Error detecting Flutter servers:'), error.message);
  }
  
  // Remove duplicate servers (same port)
  const uniqueServers = servers.reduce((acc, server) => {
    if (!acc.find(s => s.port === server.port)) {
      acc.push(server);
    }
    return acc;
  }, []);
  
  return uniqueServers;
}

async function getServerInfo(pid, port) {
  try {
    // Get the working directory of the process to find project name
    const { stdout: cwdOutput } = await execAsync(
      `lsof -p ${pid} | grep cwd | awk '{print $NF}' | head -1`,
      { shell: true, timeout: 1000 }
    );
    
    let projectName = 'Flutter App';
    if (cwdOutput) {
      const projectPath = cwdOutput.trim();
      projectName = projectPath.split('/').pop() || 'Flutter App';
    }
    
    // Verify the server is responding
    try {
      const response = await fetch(`http://localhost:${port}`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(1000)
      });
      
      if (response.ok || response.status === 404) {
        console.log(chalk.green(`✓ Found Flutter server: ${projectName} on port ${port}`));
        return {
          port,
          url: `http://localhost:${port}`,
          projectName,
          processName: 'dart',
        };
      }
    } catch (fetchError) {
      // Server might not be HTTP or might be starting up
      if (fetchError.name !== 'AbortError') {
        console.log(chalk.green(`✓ Found Flutter server: ${projectName} on port ${port} (starting up)`));
        return {
          port,
          url: `http://localhost:${port}`,
          projectName,
          processName: 'dart',
        };
      }
    }
  } catch (error) {
    // Ignore errors for individual servers
  }
  
  return null;
}

async function checkPort(port) {
  try {
    // Use lsof to check if port is in use by dart/flutter
    const { stdout } = await execAsync(`lsof -i :${port} -P -n | grep LISTEN || true`, { 
      shell: true,
      timeout: 1000 
    });
    
    if (stdout && (stdout.includes('dart') || stdout.includes('flutter'))) {
      // Extract process info
      const lines = stdout.trim().split('\n');
      const processInfo = lines[0].split(/\s+/);
      const processName = processInfo[0];
      
      // Try to get the Flutter project name from the process
      let projectName = 'Flutter App';
      try {
        const { stdout: pwdOutput } = await execAsync(`lsof -p ${processInfo[1]} | grep cwd | awk '{print $NF}' | head -1`, {
          shell: true,
          timeout: 1000
        });
        
        if (pwdOutput) {
          const projectPath = pwdOutput.trim();
          projectName = projectPath.split('/').pop() || 'Flutter App';
        }
      } catch (e) {
        // Ignore errors in getting project name
      }
      
      console.log(chalk.green(`✓ Found Flutter server: ${projectName} on port ${port}`));
      
      return {
        port,
        url: `http://localhost:${port}`,
        projectName,
        processName,
      };
    }
  } catch (error) {
    // Port not in use or error checking
  }
  
  return null;
}

export async function checkSinglePort(port) {
  try {
    const response = await fetch(`http://localhost:${port}`, { 
      method: 'HEAD',
      timeout: 2000 
    });
    return response.ok;
  } catch {
    return false;
  }
}