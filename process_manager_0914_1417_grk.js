// 代码生成时间: 2025-09-14 14:17:50
// Import necessary modules
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { exec } = require('child_process');

// Function to execute shell commands
function executeCommand(command, callback) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      callback(error, null, null);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      callback(null, null, stderr);
      return;
    }
    callback(null, stdout, null);
  });
}

// Function to get system processes and send to renderer process
function getSystemProcesses(win) {
  executeCommand('ps aux', (error, stdout, stderr) => {
    if (error || stderr) {
      sendErrorToWindow(win, error || stderr);
      return;
    }
    win.webContents.send('processes', stdout);
  });
}

// Function to send error messages to the renderer process
function sendErrorToWindow(win, errorMessage) {
  win.webContents.send('error', errorMessage);
}

// Create main window
function createMainWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');

  // Initialize getSystemProcesses on window creation
  getSystemProcesses(win);
}

// Listen for process list request from renderer process
ipcMain.on('get-processes', (event, arg) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  getSystemProcesses(win);
});

// Handle create window event
app.whenReady().then(createMainWindow);

// Handle window close event
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle activate event
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
