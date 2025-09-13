// 代码生成时间: 2025-09-14 02:03:21
// Import necessary modules
const { app, BrowserWindow } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) app.quit();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

/**
 * Search Algorithm Optimization Module
 *
 * @module searchAlgorithmOptimization
 */

// Define search algorithm functions
const searchAlgorithms = {
  /**
   * Perform a basic linear search.
   *
   * @param {Array} array - The array to search.
   * @param {any} target - The target value to find.
   * @returns {number|null} - The index of the target value or null if not found.
   */
  linearSearch: function (array, target) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === target) return i;
    }
    return null;
  },

  /**
   * Perform a binary search on a sorted array.
   *
   * @param {Array} array - The sorted array to search.
   * @param {any} target - The target value to find.
   * @returns {number|null} - The index of the target value or null if not found.
   */
  binarySearch: function (array, target) {
    let low = 0;
    let high = array.length - 1;

    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      if (array[mid] === target) return mid;
      if (array[mid] < target) low = mid + 1;
      else high = mid - 1;
    }
    return null;
  }
};

// Export the search algorithm module for use in the renderer process.
module.exports = searchAlgorithms;