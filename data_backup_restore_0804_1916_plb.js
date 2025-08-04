// 代码生成时间: 2025-08-04 19:16:22
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

// Function to backup data
function backupData(sourcePath) {
  return new Promise((resolve, reject) => {
    const backupPath = path.join(os.tmpdir(), 'backup', 'data_backup.zip');
    
    fs.copy(sourcePath, backupPath)
      .then(() => {
        console.log('Data backed up successfully.');
        resolve(backupPath);
      }).catch(error => {
        console.error('Error backing up data:', error);
        reject(error);
      });
  });
}

// Function to restore data
function restoreData(backupPath, destinationPath) {
  return new Promise((resolve, reject) => {
    
    fs.remove(destinationPath)
      .then(() => {
        return fs.copy(backupPath, destinationPath);
      }).then(() => {
        console.log('Data restored successfully.');
        resolve();
      }).catch(error => {
        console.error('Error restoring data:', error);
        reject(error);
      });
  });
}

// Create Electron BrowserWindow
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  
  win.loadFile('index.html');
}

// Handle creating, loading, and updating windows
app.whenReady().then(createWindow).on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}).on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle backup and restore actions
app.on('will-quit', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });

  if (canceled || !filePaths.length) {
    console.log('No directory selected for backup.');
    return;
  }

  try {
    const backupFile = await backupData(filePaths[0]);
    console.log('Backup file:', backupFile);
  } catch (error) {
    console.error('Backup failed:', error);
  }
});

// Add event listener for restore action
app.on('ready', () => {
  const { response, filePaths } = dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Backup Files', extensions: ['zip'] }],
  });

  if (response === 0 && filePaths.length) {
    const backupFile = filePaths[0];
    dialog.showOpenDialog({
      properties: ['openDirectory'],
      message: 'Select destination directory for restore',
    }).then(async ({ canceled, filePaths: destinationPaths }) => {
      if (canceled || !destinationPaths.length) {
        console.log('No destination directory selected for restore.');
        return;
      }

      try {
        await restoreData(backupFile, destinationPaths[0]);
      } catch (error) {
        console.error('Restore failed:', error);
      }
    });
  }
});