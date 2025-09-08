// 代码生成时间: 2025-09-09 04:31:17
const { app, BrowserWindow } = require('electron');

// Custom sorting algorithm function
function bubbleSort(arr) {
  // Check if the input is valid array
  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array');
  }
  // Get the length of the array
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements if they are in wrong order
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

// Function to create and load the BrowserWindow
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the index.html of the app
  win.loadFile('index.html');
}

// Electron main process event handlers
app.on('ready', createWindow);

// Catch any errors in the application
process.on('uncaughtException', (error) => {
  console.error('Unhandled exception:', error);
});