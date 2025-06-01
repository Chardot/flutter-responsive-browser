import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';

const execAsync = promisify(exec);

export async function detectFlutterServers() {
  console.log(chalk.gray('🔍 Scanning for Flutter web servers...'));
  
  const servers = [];
  const uniqueServices = new Map(); // Use Map for deduplication
  
  try {
    // First, find all dart/flutter processes with their ports using lsof
    // This is much more efficient than scanning individual ports
    const { stdout } = await execAsync(
      `lsof -iTCP -sTCP:LISTEN -P -n | grep -E '(dart|flutter)' || true`,
      { shell: true, timeout: 5000 }
    );
    
    if (stdout) {
      const lines = stdout.trim().split('\n').filter(line => line);
      
      for (const line of lines) {
        // Parse lsof output more carefully
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 9) {
          const processName = parts[0];
          const pid = parts[1];
          // Find the column with TCP address (contains colon and ends with (LISTEN))
          let address = '';
          for (let i = 8; i < parts.length; i++) {
            if (parts[i].includes(':') && i + 1 < parts.length && parts[i + 1] === '(LISTEN)') {
              address = parts[i];
              break;
            }
          }
          
          if (!address) continue;
          
          // Extract port and IP from address (format: IP:PORT or *:PORT)
          const addressMatch = address.match(/^(.+):(\d+)$/);
          if (addressMatch) {
            const [, ip, portStr] = addressMatch;
            const port = parseInt(portStr);
            
            // Check if it's a web server port (typically > 3000)
            if (port >= 3000 && port <= 70000) {
              const server = await getServerInfo(pid, port);
              if (server) {
                // Create unique key based on project name and port
                const serviceKey = `${server.projectName}:${port}`;
                
                if (!uniqueServices.has(serviceKey)) {
                  // First time seeing this service
                  server.addresses = new Set([ip]);
                  server.protocols = new Set();
                  if (ip.includes(':')) {
                    server.protocols.add('tcp6');
                  } else {
                    server.protocols.add('tcp4');
                  }
                  uniqueServices.set(serviceKey, server);
                } else {
                  // Update existing service with additional address info
                  const existing = uniqueServices.get(serviceKey);
                  existing.addresses.add(ip);
                  if (ip.includes(':')) {
                    existing.protocols.add('tcp6');
                  } else {
                    existing.protocols.add('tcp4');
                  }
                }
              }
            }
          }
        }
      }
    }
    
    // If no servers found with the efficient method, fall back to checking common ports
    if (uniqueServices.size === 0) {
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
            const serviceKey = `${server.projectName}:${server.port}`;
            if (!uniqueServices.has(serviceKey)) {
              server.addresses = new Set(['localhost']);
              server.protocols = new Set(['tcp4']);
              uniqueServices.set(serviceKey, server);
            }
          }
        });
      }
    }
  } catch (error) {
    console.error(chalk.yellow('Error detecting Flutter servers:'), error.message);
  }
  
  // Convert Map values to array
  let uniqueServers = Array.from(uniqueServices.values());
  
  // Group servers by project name
  const serversByProject = {};
  uniqueServers.forEach(server => {
    if (!serversByProject[server.projectName]) {
      serversByProject[server.projectName] = [];
    }
    serversByProject[server.projectName].push(server);
  });
  
  // For each project, prefer tcp6 servers that are not starting up
  const filteredServers = [];
  Object.entries(serversByProject).forEach(([projectName, servers]) => {
    // Sort servers by preference: tcp6 and not starting up first
    servers.sort((a, b) => {
      // Prefer servers that are not starting up
      if (!a.isStartingUp && b.isStartingUp) return -1;
      if (a.isStartingUp && !b.isStartingUp) return 1;
      
      // Then prefer tcp6
      const aHasTcp6 = a.protocols && a.protocols.has('tcp6');
      const bHasTcp6 = b.protocols && b.protocols.has('tcp6');
      if (aHasTcp6 && !bHasTcp6) return -1;
      if (!aHasTcp6 && bHasTcp6) return 1;
      
      return 0;
    });
    
    // Only keep the best server for each project
    filteredServers.push(servers[0]);
  });
  
  // Log each filtered server
  filteredServers.forEach(server => {
    const status = server.isStartingUp ? ' (starting up)' : '';
    const protocols = server.protocols ? ` [${Array.from(server.protocols).join(', ')}]` : '';
    console.log(chalk.green(`✓ Found Flutter server: ${server.projectName} on port ${server.port}${status}${protocols}`));
  });
  
  return filteredServers;
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
    
    // Check if this is actually a Flutter web server by trying to fetch it
    try {
      const response = await fetch(`http://localhost:${port}`, {
        method: 'GET',
        signal: AbortSignal.timeout(1500),
        headers: {
          'Accept': 'text/html'
        }
      });
      
      if (response.ok) {
        const text = await response.text();
        // Check if this is a Flutter web app by looking for Flutter-specific content
        const isFlutterWeb = text.includes('flutter') || 
                           text.includes('Flutter') || 
                           text.includes('main.dart.js') ||
                           text.includes('flutter_service_worker.js') ||
                           text.includes('<!DOCTYPE html>'); // Most Flutter web apps serve HTML
        
        // Also check if it's NOT a DevTools or Observatory page
        const isDevTools = text.includes('DevTools') || 
                          text.includes('Observatory') ||
                          text.includes('vm_service') ||
                          port < 10000; // DevTools/Observatory typically use lower ports
        
        if (isFlutterWeb && !isDevTools) {
          return {
            port,
            url: `http://localhost:${port}`,
            projectName,
            processName: 'dart',
          };
        }
      }
    } catch (fetchError) {
      // If we can't fetch, it might be starting up or not an HTTP server
      // Only return it if it's in the typical Flutter web port range
      if (port >= 40000 && port <= 65000 && fetchError.name !== 'AbortError') {
        return {
          port,
          url: `http://localhost:${port}`,
          projectName,
          processName: 'dart',
          isStartingUp: true,
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
      const pid = processInfo[1];
      
      // Use getServerInfo to apply the same filtering logic
      return await getServerInfo(pid, port);
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