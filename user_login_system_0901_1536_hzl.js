// 代码生成时间: 2025-09-01 15:36:07
// user_login_system.js
// 这是一个使用JS和ELECTRON框架的用户登录验证系统的实现。

const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// 用户数据存储结构
const users = {
  'user@example.com': {
    name: 'John Doe',
    password: '$2a$10$...hashedPassword...', // 存储的密码应该是哈希过的
    verified: false
  }
};

// 哈希密码，用于保存到用户数据中
function hashPassword(password) {
  return crypto.pbkdf2Sync(password, 'salt', 1000, 64, 'sha512').toString('hex');
}

// 验证密码是否正确
function verifyPassword(storedPassword, password) {
  return storedPassword === hashPassword(password);
}

// 登录函数
function login(email, password) {
  const user = users[email];
  if (!user) {
    throw new Error('用户不存在');
  }
  if (!verifyPassword(user.password, password)) {
    throw new Error('密码错误');
  }
  user.verified = true;
  return `欢迎回来，${user.name}!`;
}

// Electron主进程的入口函数
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');
}

// 当Electron应用准备就绪时，创建浏览器窗口
app.whenReady().then(createWindow);

// 处理应用的所有错误和未捕获的异常
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

// 预加载脚本，用于暴露登录函数到渲染进程
const preload = `
  // preload.js
  const { contextBridge, ipcRenderer } = require('electron');
  contextBridge.exposeInMainWorld('electronAPI', {
    login: async (email, password) => {
      try {
        const result = await ipcRenderer.invoke('login', { email, password });
        return result;
      } catch (error) {
        throw error;
      }
    }
  });
`;

// 将预加载脚本写入文件
fs.writeFileSync(path.join(__dirname, 'preload.js'), preload);

// 登录IPC事件处理器
ipcMain.on('login', async (event, args) => {
  try {
    const result = login(args.email, args.password);
    event.reply('login-response', { result, success: true });
  } catch (error) {
    event.reply('login-response', { error: error.message, success: false });
  }
});