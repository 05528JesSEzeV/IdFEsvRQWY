// 代码生成时间: 2025-09-19 06:55:38
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

// 创建 BrowserWindow 的类
class ApiResponseFormatter {
  constructor() {
    this.win = null;
  }

  // 初始化并显示窗口
  createWindow() {
    this.win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
      },
    });

    this.win.loadFile('index.html');

    this.win.on('closed', () => {
      this.win = null;
    });
  }

  // 格式化 API 响应
  formatResponse(apiData) {
    try {
      // 假设 apiData 是 JSON 格式的数据
      const response = JSON.parse(apiData);
      // 格式化逻辑，这里只是一个示例
      const formattedData = JSON.stringify(response, null, 2);
      return formattedData;
    } catch (error) {
      console.error('Error formatting response:', error);
      throw new Error('Failed to format API response.');
    }
  }
}

// 预加载脚本路径
const preloadScript = path.join(__dirname, 'preload.js');

// 确保只运行一个实例
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时，聚焦到第一个窗口
    if (this.win) {
      if (this.win.isMinimized()) this.win.restore();
      this.win.focus();
    }
  });
}

// 创建窗口，加载应用
app.on('ready', () => {
  new ApiResponseFormatter().createWindow();
});

// 退出时清理
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    new ApiResponseFormatter().createWindow();
  }
});