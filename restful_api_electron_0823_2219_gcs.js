// 代码生成时间: 2025-08-23 22:19:23
const { app, BrowserWindow } = require('electron');
const express = require('express');
const cors = require('cors');

// 创建 Express 应用
const appElectron = express();
appElectron.use(cors());

// 定义端口号
const port = 3000;

// 设置静态资源目录
appElectron.use(express.static('public'));

// 定义路由
appElectron.get('/api/users', (req, res) => {
  // 假设这里是一个数据库查询操作
  const users = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];
  res.json(users);
});

// 错误处理中间件
appElectron.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 启动服务器
appElectron.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// 确保 Electron 应用只在开发时运行
if (require('electron-is-dev')) {
  // 创建 Electron 窗口实例
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // 并且加载应用的 index.html
  mainWindow.loadFile('index.html');
}

// 以下是 Electron 的主进程代码
app.on('ready', () => {
  // 这里可以添加更多 Electron 的初始化代码
});

// 以下是 Electron 主进程的退出事件监听器
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 显式地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 激活应用并且创建 browser window
app.on('activate', () => {
  // 在这提交 Electron 的单例或在首次创建
  // BrowserWindow 的时候创建它
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
