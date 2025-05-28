const DeviceManager = require('./device_manager');

async function testDeviceManager() {
    console.log('Testing DeviceManager...\n');
    
    try {
        // Create instance
        const deviceManager = new DeviceManager();
        console.log('✓ DeviceManager instance created');
        
        // Check if methods exist
        console.log('\nChecking methods:');
        console.log('- listDevices exists:', typeof deviceManager.listDevices === 'function');
        console.log('- launchDevice exists:', typeof deviceManager.launchDevice === 'function');
        
        // Test listDevices
        console.log('\nTesting listDevices():');
        const devices = await deviceManager.listDevices();
        console.log('✓ listDevices() completed');
        console.log('Number of devices:', devices.length);
        
        if (devices.length > 0) {
            console.log('\nFirst device:');
            console.log(JSON.stringify(devices[0], null, 2));
        }
        
    } catch (error) {
        console.error('\n✗ Error occurred:');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
    }
}

// Run the test
testDeviceManager();