// 代码生成时间: 2025-09-23 19:46:26
 * It allows users to input raw API response data and return a formatted JSON.
 */

const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

// Function to create a new window
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
  });
  
  win.loadFile('index.html');
  
  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

// Handle creating/removing shortcuts in the startup folder
if (require('electron-squirrel-startup')) { return app.quit(); }

// Handle window events
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Function to format API response
function formatApiResponse(rawData) {
  try {
    // Parse the raw data as JSON
    const parsedData = JSON.parse(rawData);
    // Return the formatted JSON string
    return JSON.stringify(parsedData, null, 2);
  } catch (error) {
    // Handle parse error
    console.error('Error parsing JSON:', error);
    return null;
  }
}

// Expose the formatApiResponse function to the renderer process
exports.formatApiResponse = formatApiResponse;