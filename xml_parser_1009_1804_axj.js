// 代码生成时间: 2025-10-09 18:04:47
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const xml2js = require('xml2js'); // 使用xml2js库来解析XML数据

// 创建一个BrowserWindow实例，用于展示解析结果
let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
  });

  win.loadFile('index.html'); // 加载用于展示结果的HTML页面

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow); // 当Electron应用准备好时，创建窗口

// 监听主进程中的文件拖放事件
app.on('will-finish-launching', () => {
  require('@electron/remote').initialize();
});

app.on('open-file', (event, path) => {
  // 阻止文件打开事件的默认行为
  event.preventDefault();

  // 尝试读取文件内容
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      console.error('读取文件失败:', err);
      win.webContents.send('parse-error', '无法读取文件');
      return;
    }

    // 使用xml2js解析XML数据
    const parser = new xml2js.Parser();
    parser.parseString(data, (parseErr, result) => {
      if (parseErr) {
        console.error('解析XML失败:', parseErr);
        win.webContents.send('parse-error', '无法解析XML数据');
        return;
      }

      // 将解析结果发送到渲染进程
      win.webContents.send('parse-completed', result);
    });
  });
});

// 在渲染进程中监听解析完成事件，并更新页面内容
win.webContents.on('did-finish-load', () => {
  win.webContents.send('did-finish-load');
});

// 处理渲染进程发送的解析错误事件
win.webContents.on('parse-error', (event, message) => {
  // 显示错误消息
  console.error(message);
  // 可以在此处添加更多的错误处理逻辑
});

// 处理渲染进程发送的解析完成事件
win.webContents.on('parse-completed', (event, result) => {
  // 更新页面内容以显示解析结果
  console.log('XML解析完成:', result);
  // 可以在此处添加更多的逻辑来更新页面内容
});