// 代码生成时间: 2025-09-30 21:03:59
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

// 创建和管理主窗口的函数
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
  
  win.on('closed', () => {
    win = null;
  });
}

// 当 Electron 完成初始化并准备好创建浏览器窗口时，调用此函数
app.on('ready', createWindow);

// 所有窗口关闭时退出应用
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

// 预加载脚本路径
const preloadPath = path.join(__dirname, 'preload.js');

// 处理主进程与渲染进程之间的通信
ipcMain.on('save-api-version', (event, apiVersion) => {
  try {
    // 将API版本信息保存到文件
    fs.writeFileSync(path.join(__dirname, 'api_versions.json'), JSON.stringify(apiVersion));
    event.reply('api-version-saved', 'API version saved successfully');
  } catch (error) {
    event.reply('api-version-save-error', `Error saving API version: ${error.message}`);
  }
});

// 预加载脚本
const preload = `
  const { contextBridge, ipcRenderer } = require('electron');
  
  contextBridge.exposeInMainWorld('electronAPI', {
    saveApiVersion: (apiVersion) => {
      ipcRenderer.send('save-api-version', apiVersion);
    },
  });
`;

// 将预加载脚本保存到文件
fs.writeFileSync(preloadPath, preload);

// 错误处理和日志记录（示例）
const logError = (error) => {
  console.error('An error occurred:', error);
};