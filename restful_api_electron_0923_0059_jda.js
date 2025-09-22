// 代码生成时间: 2025-09-23 00:59:25
// restful_api_electron.js
// 使用ELECTRON框架创建的RESTful API接口程序

const { app, BrowserWindow } = require('electron');
const express = require('express');
const http = require('http');

// 创建Electron应用和服务器
class ElectronRESTfulAPI {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.setupRoutes();
    }

    // 设置路由
    setupRoutes() {
        // 定义路由及其对应的处理函数
        this.app.get('/', (req, res) => {
            res.send('Welcome to the RESTful API!');
        });

        // 处理错误
        this.app.use((req, res, next) => {
            res.status(404).send('Not Found');
        });
    }

    // 启动服务器
    startServer(port) {
        this.server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}

// 创建窗口和Electron应用
class AppWindow extends BrowserWindow {
    constructor() {
        super({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
    }

    // 创建Electron窗口
    createWindow() {
        this.loadFile('index.html');
    }
}

// 启动Electron应用
function createElectronApp() {
    const mainWindow = new AppWindow();
    mainWindow.createWindow();

    const api = new ElectronRESTfulAPI();
    api.startServer(3000); // 使用3000端口
}

// 确保Electron主进程的代码只在应用启动时执行一次
app.whenReady().then(createElectronApp);

// 捕获Electron应用的所有退出事件
app.on('window-all-closed', () => {
    app.quit();
});