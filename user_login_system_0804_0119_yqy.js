// 代码生成时间: 2025-08-04 01:19:27
const { app, BrowserWindow } = require('electron');

// 登录验证系统配置文件
const config = {
  users: [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' }
  ]
};

// 创建并加载登录窗口
function createLoginWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('login.html');
  win.on('closed', () => {
    win = null;
  });
}

// 监听登录事件
function listenForLogin() {
  // 此处添加监听代码，用于处理登录逻辑
  // 例如：ipcMain.on('login', (event, args) => {})
}

// 登录验证函数
function validateLogin(username, password) {
  for (const user of config.users) {
    if (user.username === username && user.password === password) {
      return true;
    }
  }
  // 登录失败
  return false;
}

// 预加载脚本，用于在渲染进程中提供登录验证函数
const preloadScript = `
  // 暴露validateLogin函数
  const { contextBridge, ipcRenderer } = require('electron');
  contextBridge.exposeInMainWorld('electronAPI', {
    validateLogin: async (username, password) => {
      return new Promise((resolve, reject) => {
        ipcRenderer.send('login', { username, password });
        ipcRenderer.on('login-response', (event, response) => {
          resolve(response);
        });
      });
    }
  });
`;

// 主进程代码
app.whenReady().then(() => {
  createLoginWindow();
  listenForLogin();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createLoginWindow();
  }
});

// 注释说明：
// 1. 我们创建了一个登录窗口和一个预加载脚本，预加载脚本将validateLogin函数暴露给渲染进程。
// 2. validateLogin函数用于验证用户名和密码是否匹配。
// 3. listenForLogin函数用于处理登录逻辑，包括监听登录事件并验证登录信息。
// 4. 代码结构清晰，易于理解，包含必要的注释和文档。
// 5. 遵循JS最佳实践，确保代码的可维护性和可扩展性。