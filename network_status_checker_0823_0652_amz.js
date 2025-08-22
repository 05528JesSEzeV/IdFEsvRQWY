// 代码生成时间: 2025-08-23 06:52:31
// Import necessary modules from Electron
const { app, BrowserWindow } = require('electron');
const net = require('net');

// Function to check network connection status
function checkNetworkStatus() {
  // Create a socket to check for network connectivity
  const socket = net.createConnection({
    host: 'www.google.com',
    port: 80
  });

  // Event listener for when the socket connects successfully
  socket.on('connect', () => {
    console.log('Network connection is active');
  });

  // Event listener for when there is an error
  socket.on('error', (error) => {
    console.error('Network connection error:', error.message);
  });

  // Close the socket after a few seconds to avoid leaving it open
  setTimeout(() => {
    socket.end();
  }, 1000);
}

// Create a BrowserWindow instance
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Load the HTML file to display
  win.loadFile('index.html');

  // Check network status when the window is loaded
  win.on('did-finish-load', () => {
    checkNetworkStatus();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Handle errors
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Close the application when the last window is closed on macOS
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
