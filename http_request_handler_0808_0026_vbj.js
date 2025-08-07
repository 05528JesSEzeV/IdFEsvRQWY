// 代码生成时间: 2025-08-08 00:26:05
// 引入ELECTRON中web服务器模块
const { app, BrowserWindow, webContents } = require('electron');
const express = require('express');
const http = require('http');
const { createServer } = require('vite');

// 创建express应用
const app = express();

// 创建HTTP服务器
const server = http.createServer(app);

// HTTP请求处理函数
app.get('/', (req, res) => {
    // 发送HTTP响应
    res.send('Hello World!');
});

// 错误处理中间件
app.use((err, req, res, next) => {
    // 打印错误信息
    console.error(err);
    // 发送错误响应
    res.status(500).send('Internal Server Error');
});

// 启动HTTP服务器
function startServer() {
    // 指定端口号
    const port = 3000;
    // 启动服务器
    server.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

// ELECTRON主进程代码
app.whenReady().then(() => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    win.loadFile('index.html');

    // 调用启动服务器函数
    startServer();
}).catch((err) => {
    // 错误处理
    console.error('启动ELECTRON应用失败:', err);
});

// ELECTRON应用退出时关闭服务器
app.on('window-all-closed', () => {
    server.close();
    app.quit();
});