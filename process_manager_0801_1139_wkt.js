// 代码生成时间: 2025-08-01 11:39:37
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { exec } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

// 定义全局变量，用于存储进程管理器窗口的引用
let processManagerWindow;

// 创建进程管理器窗口的函数
function createProcessManagerWindow() {
  // 创建新的 BrowserWindow 实例
  processManagerWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // 并且加载应用的 index.html。
  processManagerWindow.loadFile('index.html');

  // 打开开发者工具。
  processManagerWindow.webContents.openDevTools();

  // 当 window 被关闭，这个事件会被触发。
  processManagerWindow.on('closed', () => {
    processManagerWindow = null;
  });
}

// 处理显示进程列表的IPC消息
ipcMain.on('list-processes', (event) => {
  exec('ps aux', (error, stdout, stderr) => {
    if (error) {
      console.error('Error executing ps aux:', error);
      event.reply('list-processes', { success: false, error: error.message });
      return;
    }
    if (stderr) {
      console.error('Error executing ps aux:', stderr);
      event.reply('list-processes', { success: false, error: stderr });
      return;
    }
    event.reply('list-processes', { success: true, processes: stdout });
  });
});

// 处理杀死进程的IPC消息
ipcMain.on('kill-process', (event, pid) => {
  try {
    process.kill(pid, 'SIGTERM');
    event.reply('kill-process', { success: true });
  } catch (error) {
    console.error('Error killing process:', error);
    event.reply('kill-process', { success: false, error: error.message });
  }
});

// 这是 Electron 的主要部分和程序的入口点，创建一个浏览器窗口。
app.on('ready', createProcessManagerWindow);

// 在所有窗口都被关闭后退出。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 当应用激活时创建一个新窗口
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createProcessManagerWindow();
  }
});