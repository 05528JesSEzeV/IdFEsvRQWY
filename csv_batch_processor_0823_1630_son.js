// 代码生成时间: 2025-08-23 16:30:01
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const { Transform } = require('stream');

// Function to process a single CSV file
function processCsvFile(filePath, transformation) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .pipe(transformation)
      .on('error', (error) => reject(error))
      .on('finish', () => resolve('File processed'));
  });
}

// Main application window
class AppWindow extends BrowserWindow {
  constructor() {
    super({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
      },
    });

    this.loadFile('index.html');
  }

  // Open a dialog for file selection
  selectFiles() {
    const { canceled, filePaths } = dialog.showOpenDialogSync(this, {
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'CSV Files', extensions: ['csv'] }],
    });

    if (canceled || !filePaths.length) return;

    filePaths.forEach((filePath) => {
      processCsvFile(filePath, this.createTransformStream())
        .then((result) => console.log(result))
        .catch((error) => console.error('Error processing file:', error));
    });
  }

  // Create a transform stream that applies changes to the CSV data
  createTransformStream() {
    const transformation = new Transform({
      transform(chunk, encoding, callback) {
        // Your transformation logic here
        callback(null, chunk);
      },
    });

    return transformation;
  }
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) app.exit();

// Create main window, load application, and start processing
app.on('ready', () => {
  const mainWindow = new AppWindow();

  // Allow opening of file dialogs
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.selectFiles();
  });
});

// Quit the app when all windows are closed
app.on('window-all-closed', app.quit);

// Handle app reactivation on macOS
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) new AppWindow();
});
