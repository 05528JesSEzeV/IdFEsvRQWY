// 代码生成时间: 2025-08-01 07:16:10
const electron = require('electron');
const { app, BrowserWindow } = electron;
const axios = require('axios');
const cheerio = require('cheerio');

// 创建一个BrowserWindow的构造函数
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  
  win.loadFile('index.html');
  
  win.webContents.on('did-finish-load', () => {
    // 等待页面加载完成，弹出一个输入框让用户输入网址
    win.webContents.send('prompt-url');
  });
}

// 监听主进程中的'prompt-url-response'事件，接收用户输入的网址
app.on('ready', () => {
  createWindow();
  
  app.on('prompt-url-response', (event, url) => {
    if (!url) return;
    
    // 使用axios获取网页内容
    axios.get(url)
      .then(response => {
        const html = response.data;
        
        // 使用cheerio解析HTML内容
        const $ = cheerio.load(html);
        
        // 假设我们想要抓取网页的标题
        const title = $('title').text();
        
        // 将抓取到的内容发送回渲染进程
        BrowserWindow.getFocusedWindow().webContents.send('fetched-data', title);
      })
      .catch(error => {
        console.error('Error fetching webpage:', error);
        // 将错误信息发送回渲染进程
        BrowserWindow.getFocusedWindow().webContents.send('fetched-data', null, error.message);
      });
  });
});

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

// 渲染进程中的脚本，用于处理主进程发送的数据
// 这部分代码应该放在你的index.html文件中，使用<script>标签引入
const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  // 显示一个输入框让用户输入网址
  const input = document.getElementById('url-input');
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      // 当用户按下Enter键时，发送用户输入的网址到主进程
      ipcRenderer.send('prompt-url', input.value);
    }
  });
});

// 监听主进程发送过来的数据
ipcRenderer.on('fetched-data', (event, title, error) => {
  if (error) {
    // 如果有错误，显示错误信息
    document.getElementById('result').innerText = `Error: ${error}`;
  } else {
    // 显示抓取到的内容
    document.getElementById('result').innerText = title;
  }
});