// 代码生成时间: 2025-09-19 02:25:10
const { app, BrowserWindow } = require('electron');
const { createHash } = require('crypto');
const fs = require('fs');
const path = require('path');
const dialog = require('@electron/remote');

/**
 * 创建一个哈希值计算工具的Electron窗口
 * @param {string} [filePath=''] - 文件路径
 */
function createHashWindow(filePath = '') {
  const win = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile('index.html');

  // 打开开发者工具
  win.webContents.openDevTools();

  // 传递文件路径到渲染进程
  if (filePath) {
    win.webContents.send('file-path', filePath);
  }
}

// 监听渲染进程发送的计算哈希值的消息
app.on('ready', () => {
  createHashWindow();
  app.on('browser-window-created', (e, win) => {
    // 监听渲染进程的事件
    win.webContents.on('hash-calculation-requested', (event, filePath) => {
      if (!filePath) {
        dialog.showMessageBoxSync({
          type: 'error',
          message: 'File path is not provided.'
        });
        return;
      }

      try {
        const data = fs.readFileSync(filePath);
        const hash = createHash('sha256').update(data).digest('hex');
        event.sender.send('hash-calculated', hash);
      } catch (error) {
        dialog.showMessageBoxSync({
          type: 'error',
          message: `Error calculating hash: ${error.message}`,
        });
      }
    });
  });
});

// 确保只有一个实例运行
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    createHashWindow(commandLine[1]);
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});