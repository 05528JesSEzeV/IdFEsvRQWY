// 代码生成时间: 2025-10-12 03:54:23
// data_desensitization_app.js
// This Electron application provides a simple data desensitization tool.

const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');

// Function to desensitize the data in the file.
// It replaces sensitive characters with asterisks.
function desensitizeData(filePath, sensitivePattern) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const desensitizedData = data.replace(sensitivePattern, (match) => '*'.repeat(match.length));
    fs.writeFileSync(filePath, desensitizedData, 'utf8');
    return `Data desensitized successfully.`;
  } catch (error) {
    console.error('Error desensitizing data:', error);
    return `Error: ${error.message}`;
  }
}

// Create a new BrowserWindow.
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

app.whenReady().then(createWindow).catch(console.error);

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

// Handle the 'desensitize-data' command from the renderer process.
// It opens a file dialog, reads the file, desensitizes the data, and saves it back.
ipcMain.on('desensitize-data', async (event, args) => {
  const { filePath, sensitivePattern } = args;
  const result = desensitizeData(filePath, sensitivePattern);
  event.reply('desensitization-result', { result });
});

// Handle the file dialog open and send the selected file path to the renderer process.
ipcMain.on('open-file-dialog', async (event) => {
  const { canceled, filePaths } = await dialog.showOpenFile({
    properties: ['openFile'],
  });
  if (!canceled && filePaths.length > 0) {
    event.reply('selected-file-path', { filePath: filePaths[0] });
  } else {
    event.reply('selected-file-path', { filePath: null });
  }
});