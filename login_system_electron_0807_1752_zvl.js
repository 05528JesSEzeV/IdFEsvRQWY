// 代码生成时间: 2025-08-07 17:52:37
const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { autoUpdater } = require('electron-updater');

// 定义一个简单的用户数据库
const usersDB = {
  'admin': {
    username: 'admin',
    password: 'password123',
  },
};

// 创建登录窗口函数
function createLoginWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // 加载登录页面
  win.loadFile('login.html');

  // 打开开发者工具
  win.webContents.openDevTools();
}

// 预加载脚本，用于暴露验证函数
const preload = `
  // 预加载脚本
  const { contextBridge, ipcRenderer } = require('electron');
  
  contextBridge.exposeInMainWorld('api', {
    login: (username, password) => {
      ipcRenderer.send('login', { username, password });
    },
  });
`;

// 保存预加载脚本到文件
fs.writeFileSync(path.join(__dirname, 'preload.js'), preload);

// 主进程程序
app.whenReady().then(() => {
  createLoginWindow();

  // 监听登录事件
  app.on('login', (event, { username, password }) => {
    if (username in usersDB && usersDB[username].password === password) {
      console.log('Login successful');
      // 可以在这里添加更多逻辑，如打开主窗口等
    } else {
      console.log('Login failed');
      dialog.showErrorBox('Login Failed', 'Invalid username or password');
    }
  });

  // 检查更新
  autoUpdater.checkForUpdatesAndNotify();
});

// 错误处理
app.on('window-all-closed', () => {
  app.quit();
});

// 程序入口点
app.on('ready', () => {
  console.log('Electron app is ready');
});