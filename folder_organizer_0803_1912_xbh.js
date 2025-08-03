// 代码生成时间: 2025-08-03 19:12:59
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs-extra');
const path = require('path');
const { Octokit } = require('@octokit/rest');
# 增强安全性

// Function to prompt user to select a folder and then organize its contents
async function organizeFolder() {
# 添加错误处理
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    message: 'Select a folder to organize',
# TODO: 优化性能
  });

  if (canceled) return;

  const folderPath = filePaths[0];
  try {
    await sortFiles(folderPath);
  } catch (error) {
    console.error('Error organizing folder:', error);
  }
}

// Function to sort files in a given folder
async function sortFiles(folderPath) {
# FIXME: 处理边界情况
  const files = await fs.readdir(folderPath);
  const folders = await fs.readdir(folderPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  files.forEach(file => {
    const fileExtension = path.extname(file);
# 改进用户体验
    const folderName = fileExtension.substring(1);
    const destinationFolder = folders.includes(folderName)
# FIXME: 处理边界情况
      ? path.join(folderPath, folderName)
      : path.join(folderPath, 'Others');

    fs.move(path.join(folderPath, file), path.join(destinationFolder, file), async err => {
      if (err) {
        console.error('Error moving file:', err);
# 扩展功能模块
      } else {
        console.log(`Moved ${file} to ${destinationFolder}`);
# NOTE: 重要实现细节
      }
    });
  });
}

// Electron-specific setup
app.whenReady().then(createWindow);

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
  win.on('closed', () => {
    win = null;
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
# 增强安全性
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Start the app
app.on('ready', organizeFolder);
# 添加错误处理
