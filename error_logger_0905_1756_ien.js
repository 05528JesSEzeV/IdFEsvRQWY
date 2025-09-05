// 代码生成时间: 2025-09-05 17:56:55
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

// 定义日志文件的路径和名称
const logFilePath = path.join(app.getPath('logs'), 'error_logs.txt');

// 创建日志文件，如果不存在
if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, '');
}

// 错误日志收集器函数
function logError(error) {
  const timestamp = new Date().toISOString();
  const errorLogEntry = `${timestamp} - ERROR: ${error.message}
${error.stack}
`;
  fs.appendFileSync(logFilePath, errorLogEntry);
  console.error(errorLogEntry);
}

// Electron主进程的错误处理
process.on('uncaughtException', (error) => {
  logError(error);
});

process.on('unhandledRejection', (reason, promise) => {
  logError(reason);
});

// 创建并加载Electron窗口
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile('index.html');
}

// 当Electron应用准备好时，创建窗口
app.whenReady().then(createWindow);

// 监听Electron应用的所有退出事件，确保日志文件被保存
app.on('will-quit', () => {
  console.log('Application will quit, logging any final errors');
});