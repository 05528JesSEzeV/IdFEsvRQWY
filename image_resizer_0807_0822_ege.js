// 代码生成时间: 2025-08-07 08:22:09
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Function to resize a single image
async function resizeImage(inputPath, outputPath, targetWidth, targetHeight) {
  try {
    await sharp(inputPath)
      .resize({
        width: targetWidth,
        height: targetHeight,
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFile(outputPath);
  } catch (error) {
    console.error(`Error resizing image: ${error.message}`);
    throw error;
  }
}

// Function to get files from the user
function getDirectoryPath() {
  return dialog.showOpenDialog({
    properties: ['openDirectory']
  });
}

// Function to process all images in a directory
async function processDirectory(directoryPath, targetWidth, targetHeight) {
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const fileStats = fs.statSync(filePath);
    
    if (fileStats.isFile() && filePath.endsWith('.jpg') || filePath.endsWith('.png')) {
      const outputFilePath = filePath.replace(/\.jpg$/i, '_resized.jpg').replace(/\.png$/i, '_resized.png');
      await resizeImage(filePath, outputFilePath, targetWidth, targetHeight);
      console.log(`Resized and saved: ${outputFilePath}`);
    }
  }
}

// Create main window
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // Load the index.html of the app.
  win.loadFile('index.html');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow).then(() => {
  getDirectoryPath().then(async (dirPath) => {
    if (dirPath.canceled) return;

    const targetWidth = 800; // Target width for resizing
    const targetHeight = 600; // Target height for resizing
    await processDirectory(dirPath.filePaths[0], targetWidth, targetHeight);
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/*
 * Preload Script
 * This script is run before the main renderer process and can be used to expose
 * additional Electron functionality to the renderer process.
 */
// preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'electronAPI', {
    getDirectoryPath: () => ipcRenderer.send('get-directory-path'),
  }
);
