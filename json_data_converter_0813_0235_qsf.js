// 代码生成时间: 2025-08-13 02:35:07
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const { parse, stringify } = require('json5');

// 创建一个BrowserWindow对象的构造函数
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    // 并加载index.html文件
    win.loadFile('index.html');

    // 开启开发工具
    win.webContents.openDevTools();
}

// 程序启动时创建窗口
app.on('ready', createWindow);

// 监听窗口关闭事件
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// 监听激活事件重建窗口
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// 定义JSON数据转换函数
function convertJsonData(inputData, formatType) {
    try {
        // 解析输入的JSON数据
        const parsedData = parse(inputData);

        // 根据格式类型转换数据
        let convertedData;
        switch (formatType) {
            case 'json5':
                convertedData = stringify(parsedData, null, 2);
                break;
            case 'json':
                convertedData = JSON.stringify(parsedData, null, 2);
                break;
            default:
                throw new Error('Unsupported format type');
        }

        // 返回转换后的JSON数据
        return convertedData;
    } catch (error) {
        // 处理解析错误
        console.error('Error converting JSON data:', error);
        return null;
    }
}

// 导出JSON数据转换函数
module.exports = {
    convertJsonData,
};