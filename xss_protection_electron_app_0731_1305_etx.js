// 代码生成时间: 2025-07-31 13:05:02
const { app, BrowserWindow } = require('electron');
const { parse } = require('url');
const { createServer } = require('vite');
const express = require('express');
const path = require('path');
const xss = require('xss');
const bodyParser = require('body-parser');
const PORT = 3000;
const HTML_FILE = path.join(__dirname, 'index.html');

// 创建一个 Express 应用
const app = express();

// 使用中间件解析 JSON 和 urlencoded 数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 创建一个 Vite 服务器以提供静态文件
const vite = createServer({ preview: true });

// 使用 Vite 服务器提供静态文件
async function handleRequest(req, res) {
  try {
    // 让 Vite 处理请求
    await vite.handleRequest(req, res);
  } catch (err) {
    console.error('vite error:', err);
    res.status(500).send('Internal Server Error');
  }
}

// 设置静态文件目录
app.use(express.static('public'));

// 配置路由以处理表单提交
app.post('/api/sanitize', (req, res) => {
  try {
    // 获取用户输入
    const userInput = req.body.userInput;
    // 使用 xss 库清理输入以防止 XSS 攻击
    const sanitizedInput = xss(userInput);
    // 将清理后的数据发送回客户端
    res.json({ sanitizedInput });
  } catch (error) {
    // 错误处理
    console.error('Error sanitizing input:', error);
    res.status(500).send('Internal Server Error');
  }
});

// 设置路由处理所有其他请求并提供 Vite 服务器
app.all('*', (req, res) => {
  handleRequest(req, res).catch((err) => {
    console.error('Error serving:', err);
    res.status(500).send('Internal Server Error');
  });
});

// 启动 Express 服务器
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// 创建 Electron 应用的浏览器窗口
app.once('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // 加载 HTML 文件
  mainWindow.loadFile(HTML_FILE);
});

// 确保应用在所有窗口关闭时退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 预加载脚本，用于在渲染器进程中注入安全功能
const PRELOAD_SCRIPT = `
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // 提供与渲染器进程通信的方法
  getServerResponse: async (userInput) => {
    try {
      const sanitizedInput = await ipcRenderer.invoke('sanitize-input', userInput);
      return sanitizedInput;
    } catch (error) {
      console.error('Failed to sanitize input:', error);
      return null;
    }
  },
});
`;

// 将预加载脚本写入文件
fs.writeFileSync(path.join(__dirname, 'preload.js'), PRELOAD_SCRIPT);

// 注释说明:
// 该代码创建了一个 Electron 应用，其中包含一个 Express 服务器用于处理表单提交，并使用 xss 库进行 XSS 防护。
// 用户输入通过表单提交后，服务器会清理输入以防止 XSS 攻击，并将清理后的数据发送回客户端。
// 预加载脚本在渲染器进程中注入了一个 API，该 API 允许与主进程通信以进行输入清理。