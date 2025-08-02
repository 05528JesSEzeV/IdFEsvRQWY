// 代码生成时间: 2025-08-02 12:04:11
// 引入Electron主进程和渲染进程所需的模块
const { app, BrowserWindow, webContents } = require('electron');
const { protectWindow } = require('./xss_protect_module'); // 引入XSS防护模块

// 用于存储创建的BrowserWindow实例
let mainWindow;

// 创建窗口并加载应用
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // 禁用上下文隔离（为了简单演示，实际开发中应启用）,
    },
  });

  // 加载应用的index.html文件
  mainWindow.loadFile('index.html');

  // 打开开发者工具
  mainWindow.webContents.openDevTools();

  // 监听窗口关闭事件
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // 应用XSS防护
  protectWindow(mainWindow.webContents);
}

// 此函数用于保护Electron窗口免受XSS攻击
function protectWindow(contents) {
  // 监听渲染进程发送的消息
  contents.on('did-finish-load', () => {
    // 清除所有脚本标签
    contents.executeJavaScript(
      'document.querySelectorAll("script").forEach(script => script.remove());'
    );
  });
}

// 监听Electron的ready事件来创建窗口
app.on('ready', createWindow);

// 监听所有窗口关闭事件，退出应用
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// 激活应用时重新创建窗口
app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// XSS防护模块
// 请注意，这是一个非常基础的示例，实际应用中需要更复杂的防护措施
module.exports = {
  protectWindow,
};

// 注意：此代码仅作示例用途，实际应用中需要结合其他安全实践，如CSP（内容安全策略）等。