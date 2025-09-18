// 代码生成时间: 2025-09-18 13:05:46
const { app, BrowserWindow } = require('electron');

// 用于XSS防护的库
const DOMPurify = require('dompurify');

// 创建窗口并加载应用的函数
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // 加载应用的index.html文件
  win.loadFile('index.html');

  // 打开开发者工具
  win.webContents.openDevTools();

  // 监听渲染进程发送的消息
  win.webContents.on('did-finish-load', () => {
    // 监听渲染进程发送的'xss-protect'事件
    win.webContents.on('xss-protect', (event, userData) => {
      // 使用DOMPurify对输入数据进行清理
      const cleanData = DOMPurify.sanitize(userData);
      // 将清理后的数据发送回渲染进程
      event.reply('xss-protect', cleanData);
    });
  });
}

// 在Electron中，当所有窗口都被关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 在Electron启动时创建一个窗口
app.whenReady().then(createWindow);

// 处理错误
app.on('second-instance', (event, commandLine, workingDirectory) => {
  // 聚焦到第一个窗口并发送'focus'事件
  if (BrowserWindow.getAllWindows().length) {
    BrowserWindow.getAllWindows()[0].focus();
  }
});

// 监听未捕获的异常和进程错误
app.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
});

app.on('render-process-gone', (event, details) => {
  console.error('渲染进程崩溃:', details);
});