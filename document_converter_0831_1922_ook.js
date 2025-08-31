// 代码生成时间: 2025-08-31 19:22:06
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

// Main function to convert documents
function convertDocument(inputPath, outputPath, callback) {
  // Error handling for file existence
  fs.readFile(inputPath, 'utf8', (err, data) => {
    if (err) {
      callback(err, null);
      return;
    }

    // Placeholder for conversion logic
    // This should be replaced with actual conversion code
    let convertedData = data; // Replace with actual conversion

    // Write the converted data to the output file
    fs.writeFile(outputPath, convertedData, (err) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, outputPath);
    });
  });
}

// Create window function
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile('index.html');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
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

// IPC event handlers
ipcMain.handle('convert-document', async (event, inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    convertDocument(inputPath, outputPath, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
});

// Preload script to expose Node.js APIs to renderer
// This script is run in the renderer process.
const preload = `
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  convertDocument: (inputPath, outputPath) => ipcRenderer.invoke('convert-document', inputPath, outputPath)
});
`;

// Save the preload script to a file
fs.writeFileSync(path.join(__dirname, 'preload.js'), preload, 'utf8');
