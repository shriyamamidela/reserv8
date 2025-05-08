const { spawn } = require('child_process');
const path = require('path');

function startServer() {
    console.log('🚀 Starting server...');
    
    // Kill any existing process on port 5000
    const findProcess = spawn('netstat', ['-ano', '|', 'findstr', ':5000']);
    findProcess.stdout.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.forEach(line => {
            const parts = line.trim().split(/\s+/);
            if (parts.length > 4) {
                const pid = parts[4];
                if (pid && !isNaN(pid)) {
                    try {
                        process.kill(pid);
                        console.log(`✅ Killed existing process on port 5000 (PID: ${pid})`);
                    } catch (err) {
                        // Process might not exist anymore, ignore
                    }
                }
            }
        });
    });

    // Start the server
    const server = spawn('node', ['server.js'], {
        stdio: 'inherit'
    });

    // Handle server exit
    server.on('exit', (code) => {
        console.log(`❌ Server exited with code ${code}`);
        console.log('🔄 Restarting server in 5 seconds...');
        setTimeout(startServer, 5000);
    });

    // Handle server errors
    server.on('error', (err) => {
        console.error('❌ Server error:', err);
        console.log('🔄 Restarting server in 5 seconds...');
        setTimeout(startServer, 5000);
    });
}

// Start the server initially
startServer();
