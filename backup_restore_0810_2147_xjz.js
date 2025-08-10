// 代码生成时间: 2025-08-10 21:47:09
// 导入必要的模块
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

// 创建BrowserWindow窗口
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// 备份数据
function backupData() {
  const options = {
    properties: ['showOpenDialog'],
    filters: [{ name: 'All Files', extensions: ['*'] }]
  };
  dialog.showOpenDialog(mainWindow, options).then(async (result) => {
    if (!result.canceled && result.filePaths.length > 0) {
      const sourcePath = result.filePaths[0];
      const backupPath = path.join(path.dirname(sourcePath), 'backup_' + path.basename(sourcePath));
      try {
        await fs.promises.copyFile(sourcePath, backupPath);
        alert('备份成功！');
      } catch (error) {
        console.error('备份失败：', error.message);
        alert('备份失败：' + error.message);
      }
    }
  });
}

// 恢复数据
function restoreData() {
  const options = {
    properties: ['showOpenDialog'],
    filters: [{ name: 'All Files', extensions: ['*'] }]
  };
  dialog.showOpenDialog(mainWindow, options).then(async (result) => {
    if (!result.canceled && result.filePaths.length > 0) {
      const sourcePath = result.filePaths[0];
      const restorePath = path.join(path.dirname(sourcePath), 'restore_' + path.basename(sourcePath));
      try {
        await fs.promises.copyFile(sourcePath, restorePath);
        alert('恢复成功！');
      } catch (error) {
        console.error('恢复失败：', error.message);
        alert('恢复失败：' + error.message);
      }
    }
  });
}

app.on('ready', createWindow);
