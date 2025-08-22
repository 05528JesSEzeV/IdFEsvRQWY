// 代码生成时间: 2025-08-22 18:41:36
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// Function to apply a migration script
function applyMigration(migrationScriptPath) {
  return new Promise((resolve, reject) => {
    exec(`node ${migrationScriptPath}`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error applying migration: ${error.message}`);
      } else if (stderr) {
        reject(`Error applying migration: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Function to create a new migration script
function createMigrationScript(name) {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const migrationScriptPath = path.join('migrations', `${timestamp}_${name}.js`);
  
  fs.writeFile(migrationScriptPath, '// Migration script content goes here
// This file will be executed to apply changes to the database.
', (error) => {
    if (error) {
      console.error(`Error creating migration script: ${error.message}`);
    } else {
      console.log(`Migration script created at ${migrationScriptPath}`);
    }
  });
}

// Electron main process setup
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

// Handle creating a new migration script when the user clicks the 'Create Migration' button
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

// Export functions for use in renderer process
module.exports = {
  applyMigration,
  createMigrationScript,
};