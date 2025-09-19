// 代码生成时间: 2025-09-19 20:52:27
// Import necessary modules
const { app, BrowserWindow, ipcMain } = require('electron');
const os = require('os');
const process = require('process');

// Function to get system processes
function getSystemProcesses() {
  return new Promise((resolve, reject) => {
    try {
      // Get the list of all processes
      const processes = process.getProcessList();
      resolve(processes);
    } catch (error) {
      reject(error);
    }
  });
}

// Function to kill a process
function killProcess(pid) {
  return new Promise((resolve, reject) => {
    try {
      // Kill the process with the given PID
      process.kill(pid);
      resolve('Process killed successfully');
    } catch (error) {
      reject(error);
    }
  });
}

// Create main window
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the index.html of the app
  mainWindow.loadFile('index.html');

  // Open the DevTools for debugging
  mainWindow.webContents.openDevTools();

  // Handle window close event
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// IPC event listener for getting system processes
ipcMain.on('get-system-processes', async (event) => {
  try {
    const processes = await getSystemProcesses();
    event.reply('processes-list', processes);
  } catch (error) {
    console.error('Error fetching system processes:', error);
  }
});

// IPC event listener for killing a process
ipcMain.on('kill-process', async (event, pid) => {
  try {
    const result = await killProcess(pid);
    event.reply('kill-process-response', result);
  } catch (error) {
    console.error('Error killing process:', error);
  }
});

// Catch system errors
process.on('uncaughtException', function (error) {
  console.error('Uncaught Exception:', error);
});

// Catch unhandled rejections
process.on('unhandledRejection', function (reason, promise) {
  console.error('Unhandled Rejection:', promise, 'reason:', reason);
});