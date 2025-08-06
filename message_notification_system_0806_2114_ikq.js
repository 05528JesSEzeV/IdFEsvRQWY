// 代码生成时间: 2025-08-06 21:14:34
// Import required Electron modules
const { app, BrowserWindow, Notification } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

// Enable auto-updates
autoUpdater.checkForUpdatesAndNotify();

// Create a function to show a notification
function showNotification(title, message) {
  const notification = new Notification({
    title: title,
    body: message
  });
  notification.show();
}

// Create a BrowserWindow
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load the index.html of the app
  win.loadFile('index.html');

  // Open the devtools for debugging
  win.webContents.openDevTools();
}

// Create the window when the app is ready
app.whenReady().then(createWindow).catch(console.error);

// Handle window close event to allow for app to relaunch if necessary
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Reopen window on macOS
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/**
 * Error handling for auto-updates
 */
autoUpdater.on('error', (error) => {
  console.error('Auto-update error:', error);
  showNotification('Update Error', 'Failed to check for updates.');
});

// Listen for update download complete event
autoUpdater.on('update-downloaded', (info) => {
  showNotification('Update Available', 'A new version has been downloaded.');
  // Restart the app and install the update
  autoUpdater.quitAndInstall();
});