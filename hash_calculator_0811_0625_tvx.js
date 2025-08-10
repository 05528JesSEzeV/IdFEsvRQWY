// 代码生成时间: 2025-08-11 06:25:38
// hash_calculator.js
// This Electron application is a simple hash calculator.

const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Create a function to calculate the hash of a file
function calculateHash(file, algorithm) {
  return new Promise((resolve, reject) => {
    // Create a readable stream for the file
    const stream = fs.createReadStream(file);
    // Use the crypto module to create a hash
    const hash = crypto.createHash(algorithm);
    // When data is read from the stream, update the hash
    stream.on('data', (chunk) => {
      hash.update(chunk);
    });
    // Once the stream has finished, resolve the hash
    stream.on('end', () => {
      resolve(hash.digest('hex'));
    });
    // Handle errors
    stream.on('error', (error) => {
      reject(error);
    });
  });
}

// Create a function to open a file and calculate its hash
function openFileAndCalculateHash() {
  // Use dialog to show an open file dialog
  dialog.showOpenDialog({ properties: ['openFile'] }).then((result) => {
    if (!result.canceled && result.filePaths.length) {
      const file = result.filePaths[0];
      // Prompt the user for the hash algorithm to use
      dialog.showInputBox({
        title: 'Hash Algorithm',
        prompt: 'Enter the hash algorithm to use (e.g., sha256, md5)',
        value: 'sha256'
      }).then((resultAlgorithm) => {
        if (resultAlgorithm.response === 0) {
          let algorithm = resultAlgorithm.inputText;
          calculateHash(file, algorithm).then((hash) => {
            // Show the calculated hash in a message box
            dialog.showMessageBox({
              message: 'The hash of the file is:',
              detail: hash,
              buttons: ['OK']
            });
          }).catch((error) => {
            // Handle errors in hash calculation
            dialog.showMessageBox({
              message: 'An error occurred while calculating the hash.',
              detail: error.message,
              buttons: ['OK']
            });
          });
        }
      });
    }
  });
}

// Create a function to create the main window of the application
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
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
  createWindow();
  // Open file and calculate hash when ready
  openFileAndCalculateHash();
});

// Handle window close event to quit the app
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});