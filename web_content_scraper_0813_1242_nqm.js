// 代码生成时间: 2025-08-13 12:42:35
const { app, BrowserWindow } = require('electron');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) return;

// Create an array of protocols that the app will handle.
const protocols = ['web-scraping'];

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  mainWindow.loadFile('index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
  // Register custom protocol for web scraping.
  for (const protocol of protocols) {
    require('register-scheme')(protocol, {
      handler: async (scheme, arg) => {
        // Handle the custom protocol.
        const url = arg[0];
        try {
          const response = await axios.get(url);
          return `<html>${response.data}</html>`;
        } catch (error) {
          throw new Error(`Failed to fetch content from ${url}: ${error.message}`);
        }
      },
      usage: 'web-scraping://<URL>',
    });
  }
  createMainWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// Preload script to expose node APIs only to renderer process.
const preload = `
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveContent: (content, filePath) => {
    ipcRenderer.send('save-content', content, filePath);
  }
});
`;

// Main process script to handle saving the content.
const saveContent = (event, content, filePath) => {
  fs.writeFile(filePath, content, (error) => {
    if (error) {
      console.error('Error saving content:', error);
      event.reply('save-content-response', { success: false, message: error.message });
    } else {
      event.reply('save-content-response', { success: true, message: 'Content saved successfully' });
    }
  });
};

ipcMain.on('save-content', saveContent);
