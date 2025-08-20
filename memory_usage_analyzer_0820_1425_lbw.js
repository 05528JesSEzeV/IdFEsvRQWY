// 代码生成时间: 2025-08-20 14:25:21
const { app, BrowserWindow, ipcMain } = require('electron');
const os = require('os');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Function to get memory usage data
async function getMemoryUsage() {
  try {
    const { stdout } = await exec('free -m'); // Command to get memory info on Unix systems
    const lines = stdout.split('
');
    const memoryInfo = lines[1].split(/\s+/); // Splitting by whitespace
    const totalMemory = parseInt(memoryInfo[1], 10); // Total memory in MB
    const usedMemory = parseInt(memoryInfo[2], 10); // Used memory in MB
    const freeMemory = parseInt(memoryInfo[3], 10); // Free memory in MB

    return { totalMemory, usedMemory, freeMemory };
  } catch (error) {
    console.error('Error fetching memory usage:', error);
    throw error;
  }
}

// Function to send memory usage data to renderer process
function sendMemoryUsage(win) {
  getMemoryUsage().then(data => {
    win.webContents.send('memory-usage', data);
  }).catch(error => {
    win.webContents.send('memory-usage-error', error.message);
  });
}

// Main Electron application
function createWindow () {
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

  // Register IPC listeners
  ipcMain.on('get-memory-usage', () => {
    sendMemoryUsage(win);
  });
}

// Handle creating/removing windows
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
