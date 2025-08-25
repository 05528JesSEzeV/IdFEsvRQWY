// 代码生成时间: 2025-08-25 19:03:54
 * This application will create a simple interface
 * where users can view and manage audit logs.
 */

// Import required modules
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const log4js = require('log4js');

// Set up logger configuration
log4js.configure({
  appenders: {
    audit: { type: 'file', filename: 'audit.log' }
  },
  categories: {
    default: { appenders: ['audit'], level: 'info' }
  }
});

const logger = log4js.getLogger();

// Function to create and load the main window
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // Load the index.html of the app
  win.loadFile('index.html');
}

// Function to handle log viewer request
ipcMain.on('view-log', async (event) => {
  const logFilePath = path.join(app.getAppPath(), 'audit.log');
  try {
    const logContent = await fs.promises.readFile(logFilePath, 'utf8');
    event.reply('log-content', logContent);
  } catch (error) {
    logger.error('Failed to read log file: ', error);
    event.reply('log-error', error.message);
  }
});

// Function to handle log deletion request
ipcMain.on('delete-log', async (event) => {
  const logFilePath = path.join(app.getAppPath(), 'audit.log');
  try {
    await fs.promises.unlink(logFilePath);
    logger.info('Log file deleted successfully.');
    event.reply('log-deleted', true);
  } catch (error) {
    logger.error('Failed to delete log file: ', error);
    event.reply('log-error', error.message);
  }
});

// Handle creating window on activation of the app
app.whenReady().then(createWindow).catch(logger.error);

// Handle window closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle app re-activation
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
