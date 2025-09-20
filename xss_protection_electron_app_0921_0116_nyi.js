// 代码生成时间: 2025-09-21 01:16:51
const { app, BrowserWindow } = require('electron');
const { escape } = require('html-escaper');

// 定义一个函数用于转义XSS攻击向量
function escapeXSS(input) {
  return escape(input);
}

// 创建窗口的函数
function createWindow() {
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  // 并且加载应用的index.html文件
  win.loadFile('index.html');

  // 打开开发工具
  win.webContents.openDevTools();
}

// 这个函数将在所有窗口被关闭后被调用
app.on('window-all-closed', () => {
  // 如果平台是macOS，应用和它们的菜单栏会保持活跃
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', createWindow);

// 错误处理
app.on('error', (error) => {
  console.error('An error occurred:', error);
});

// 注释：
// 这个简单的Electron应用程序展示了如何使用`html-escaper`库来转义XSS攻击
// 向量，以增强网页内容的安全性。
// 在实际的生产环境中，你可能需要更复杂的XSS保护措施，包括使用内容
// 安全策略（CSP）和验证用户输入。

// 请注意，这个示例代码没有处理所有可能的XSS攻击场景，
// 而只是提供了一个基本的转义函数作为起点。
// 实际应用中，你可能需要使用更全面的库，例如`xss`或`DOMPurify`，
// 来处理更复杂的XSS攻击防护。