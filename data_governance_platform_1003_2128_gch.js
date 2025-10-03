// 代码生成时间: 2025-10-03 21:28:46
// data_governance_platform.js
// 一个简单的数据治理平台示例，使用ELECTRON框架

// 导入ELECTRON主模块
const { app, BrowserWindow } = require('electron');
const path = require('path');

// 创建一个全局变量，用于保存窗口对象
let mainWindow;

// 创建和加载应用窗口
function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // 加载应用的HTML文件
  mainWindow.loadFile('index.html');

  // 打开开发者工具
  mainWindow.webContents.openDevTools();

  // 当窗口被关闭时，删除全局引用
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// 当ELECTRON完成初始化并准备好创建浏览器窗口时，调用此函数
app.whenReady().then(createWindow);

// 所有窗口关闭时退出应用
app.on('window-all-closed', function () {
  // 在macOS上，如果没有其他窗口打开，通常不会退出应用
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 激活应用并创建窗口
app.on('activate', function () {
  // 在macOS上重新创建窗口，如果所有窗口都被关闭了
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 错误处理
app.on('will-quit', function () {
  // 清理应用退出时需要处理的任务
  // 例如：保存数据，关闭数据库连接等
  // 这里可以根据实际需要添加错误处理逻辑
});

// 预加载脚本，用于在渲染器进程中暴露必要的节点模块和功能
const preload = path.join(__dirname, 'preload.js');

// 导出预加载脚本路径
module.exports = preload;