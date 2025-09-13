// 代码生成时间: 2025-09-13 11:29:52
 * Features:
 * - Recursively copy files from source to destination
 * - Overwrite existing files in destination directory
 * - Handle file read/write errors
 * - Display progress and status messages
 */

const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs-extra');
const path = require('path');
const chokidar = require('chokidar');

// Global variables
const sourceDir = '/path/to/source'; // Source directory path
const destDir = '/path/to/destination'; // Destination directory path

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

  win.loadFile('index.html');
}

// Initialize electron app
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Handle file backup and sync
ipcMain.handle('backup-sync', async (event, { source, destination }) => {
  try {
    // Validate source and destination paths
    if (!fs.existsSync(source)) {
      throw new Error('Source directory does not exist');
    }
    if (!fs.existsSync(destination)) {
      fs.ensureDirSync(destination);
    }

    // Copy files from source to destination
    await fs.copy(source, destination, {
      recursive: true,
      overwrite: true,
    });

    // Watch source directory for changes
    chokidar.watch(source, {
      ignored: /(^|[\/\])\../, // Ignore dotfiles
      persistent: true,
    }).
      on('add', path => {
        event.reply('file-added', path);
      }).
      on('change', path => {
        event.reply('file-changed', path);
      }).
      on('unlink', path => {
        event.reply('file-removed', path);
      });

    return 'Backup and sync completed successfully';
  } catch (error) {
    return error.message;
  }
});

// Handle file removal from destination
ipcMain.handle('remove-file', async (event, { filePath }) => {
  try {
    await fs.remove(filePath);
    return 'File removed successfully';
  } catch (error) {
    return error.message;
  }
});

// Handle app closing
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});