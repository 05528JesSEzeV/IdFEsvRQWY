// 代码生成时间: 2025-09-03 12:23:24
const { app, BrowserWindow } = require('electron');

// 确保只有一个窗口实例
let mainWindow;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // 加载应用的 index.html
  mainWindow.loadFile('index.html');

  // 打开开发者工具
  mainWindow.webContents.openDevTools();

  // 当 window 被关闭，退出应用
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// 这部分代码将在所有窗口关闭后执行
app.on('window-all-closed', function () {
  // 在 macOS 上，通常用户在按下 Cmd + Q 时只会退出应用，而不是关闭所有窗口。
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // 在macOS上，当dock图标点击并没有任何其他窗口打开，运行此代码
  if (mainWindow === null) {
    createWindow();
  }
});

// 在main.js中创建并加载窗口，首次创建窗口
app.whenReady().then(createWindow);

// 随机数生成器模块
const randomGenerator = {
  // 生成随机数的方法
  generateRandomNumber(min, max) {
    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new Error('Both min and max must be numbers');
    }
    if (min > max) {
      throw new Error('Min must be less than or equal to max');
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

// 预加载脚本
const path = require('path');
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // 将随机数生成器的方法暴露给渲染进程
    generateRandomNumber: () => ipcRenderer.invoke('generate-random-number'),
});

// 渲染进程中的脚本
document.addEventListener('DOMContentLoaded', () => {
  const generateButton = document.getElementById('generate-button');
  const resultElement = document.getElementById('result');

  generateButton.addEventListener('click', () => {
    try {
      const randomValue = window.electronAPI.generateRandomNumber();
      resultElement.textContent = `Random Number: ${randomValue}`;
    } catch (error) {
      resultElement.textContent = `Error: ${error.message}`;
    }
  });
});