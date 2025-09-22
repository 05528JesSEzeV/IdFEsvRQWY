// 代码生成时间: 2025-09-22 15:03:38
// Import required modules
const { app, BrowserWindow, dialog } = require('electron');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Define the main window options
const mainWindowOptions = {
  width: 800,
  height: 600,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true,
  },
};

// Create a function to create the main window
function createMainWindow() {
  const win = new BrowserWindow(mainWindowOptions);

  // Load the index.html file
  win.loadFile('index.html');

  // Handle window closing
  win.on('closed', () => {
    app.quit();
  });
}

// Create a preload script for context isolation
const preloadScriptPath = path.join(__dirname, 'preload.js');

// Define the function to calculate hash
function calculateHash(inputData) {
  if (!inputData) {
    // Handle error: No data provided
    return Promise.reject('No data provided for hash calculation.');
  }

  // Use the 'crypto' module to calculate hash
  return new Promise((resolve, reject) => {
    exec(`echo ${inputData} | shasum -a 256`, (error, stdout, stderr) => {
      if (error) {
        // Handle error from child process
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

// Prevent multiple instances of the application
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Focus on the main window or create it if not visible
    if (BrowserWindow.getAllWindows().length) {
      BrowserWindow.getAllWindows()[0].focus();
    } else {
      createMainWindow();
    }
  });

  app.on('ready', createMainWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

// Define the preload script content
const preloadScript = `
  'use strict';
  
  const { ipcRenderer } = require('electron');
  const uuid = '${uuidv4()}';
  
  document.addEventListener('DOMContentLoaded', () => {
    // Send UUID to main process for identification
    ipcRenderer.send('uuid-ready', uuid);
  });
  
  // Handle hash calculation
  document.getElementById('calculate-hash').addEventListener('click', () => {
    const inputData = document.getElementById('input-data').value;
    ipcRenderer.send('calculate-hash', {
      inputData: inputData,
      uuid: uuid,
    });
  });
  
  ipcRenderer.on('hash-result', (event, arg) => {
    const { hash, uuid } = arg;
    if (uuid === '${uuidv4()}') {
      document.getElementById('hash-result').textContent = hash;
    }
  });
`;

// Write the preload script to a file
fs.writeFile(preloadScriptPath, preloadScript, (error) => {
  if (error) {
    console.error('Error writing preload script:', error);
  } else {
    console.log('Preload script written successfully.');
  }
});

// Setup IPC handlers
const ipcMain = require('electron').ipcMain;
ipcMain.on('calculate-hash', async (event, { inputData }) => {
  try {
    const hash = await calculateHash(inputData);
    // Send the hash result back to the renderer process
    event.reply('hash-result', { hash });
  } catch (error) {
    // Handle error and send a message back to the renderer process
    event.reply('hash-result', { error: error.message });
  }
});