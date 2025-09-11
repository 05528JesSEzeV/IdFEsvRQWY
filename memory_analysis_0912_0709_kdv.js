// 代码生成时间: 2025-09-12 07:09:11
 * This tool provides insights into the memory usage of the running application.
 */

const { app, BrowserWindow } = require('electron');
const os = require('os');
const { performance } = require('perf_hooks');

// Function to create a new BrowserWindow
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the index.html of the app
  win.loadFile('index.html');

  // Open the dev tools if in development mode
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow)
  .catch(console.error);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Create the main window when the app is activated
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Preload script to expose Node.js APIs to the renderer
// This script will run in the renderer process.
// It can be used to expose certain Node.js APIs to the renderer.
const path = require('path');

// Memory analysis function
function memoryAnalysis() {
  try {
    // Get the current memory usage
    const memoryUsage = process.memoryUsage();
    const usedMemoryMb = memoryUsage.heapUsed / 1024 / 1024;
    return {
      usedMemoryMb,
      // Get the system's total available memory
      totalMemoryMb: os.totalmem() / 1024 / 1024
    };
  } catch (error) {
    // Handle any errors that occur during memory analysis
    console.error('Error in memory analysis:', error);
    throw error;
  }
}

// Expose memoryAnalysis function to the renderer
exports.memoryAnalysis = memoryAnalysis;

// Handle the memory analysis request from the renderer
const { ipcMain } = require('electron');
ipcMain.handle('get-memory-usage', async () => {
  const memoryInfo = memoryAnalysis();
  return memoryInfo;
});