// 代码生成时间: 2025-08-22 23:11:06
const { app, BrowserWindow, ipcMain } = require('electron');
const net = require('net');
const isOnline = require('is-online');
const { exec } = require('child_process');

// Function to check network status
function checkNetworkStatus() {
  return new Promise((resolve, reject) => {
    isOnline().then(online => {
      resolve(online);
    }).catch(error => {
      reject(error);
    });
  });
}

// Handler for the online event
function handleOnlineEvent() {
  console.log('Online event triggered, checking network status...');
  checkNetworkStatus().then(online => {
    if (online) {
      mainWindow.webContents.send('network-status', 'online');
    } else {
      mainWindow.webContents.send('network-status', 'offline');
    }
  }).catch(error => {
    mainWindow.webContents.send('network-status', 'error', error.message);
  });
}

// Handler for the offline event
function handleOfflineEvent() {
  console.log('Offline event triggered, checking network status...');
  checkNetworkStatus().then(online => {
    if (online) {
      mainWindow.webContents.send('network-status', 'online');
    } else {
      mainWindow.webContents.send('network-status', 'offline');
    }
  }).catch(error => {
    mainWindow.webContents.send('network-status', 'error', error.message);
  });
}

// Create and load the main window
let mainWindow;
app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  
  // Register IPC event listeners
  ipcMain.on('check-network', (event, arg) => {
    checkNetworkStatus().then(online => {
      if (online) {
        event.reply('network-status-response', 'online');
      } else {
        event.reply('network-status-response', 'offline');
      }
    }).catch(error => {
      event.reply('network-status-response', 'error', error.message);
    });
  });

  // Register online and offline event listeners
  require('online-offline')().then(isOnline => {
    if (isOnline) {
      handleOnlineEvent();
    } else {
      handleOfflineEvent();
    }
  });
  
  // Handle network status changes
  require('online-offline').on('online', handleOnlineEvent);
  require('online-offline').on('offline', handleOfflineEvent);
});

// Handle application close
app.on('window-all-closed', () => {
  app.quit();
});