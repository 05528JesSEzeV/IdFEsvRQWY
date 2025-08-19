// 代码生成时间: 2025-08-19 10:13:18
const { app, BrowserWindow, shell, dialog } = require('electron');
const psList = require('ps-list'); // 用于获取进程信息的npm包
const path = require('path');

// 创建浏览器窗口的函数
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    },
  });

  // 加载进程管理器页面
  win.loadFile('process_manager.html');

  // 打开开发者工具
  win.webContents.openDevTools();
}

// 预加载脚本，用于暴露进程管理功能
const preloadScript = `
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getProcesses: async () => ipcRenderer.invoke('getProcesses'),
  killProcess: async (pid) => ipcRenderer.invoke('killProcess', pid),
});
`;

// 将预加载脚本保存到文件
const fs = require('fs');
fs.writeFileSync(path.join(__dirname, 'preload.js'), preloadScript);

// 处理主进程和渲染进程之间的通信
ipcMain.on('getProcesses', async () => {
  try {
    const processes = await psList();
    const filteredProcesses = processes.filter(p => p.name);
    return filteredProcesses;
  } catch (error) {
    console.error('Failed to get processes:', error);
  }
});

ipcMain.on('killProcess', async (event, pid) => {
  try {
    process.kill(pid, 'SIGTERM');
    dialog.showMessageBox({
      type: 'info',
      message: 'Process killed successfully',
    });
  } catch (error) {
    console.error('Failed to kill process:', error);
    dialog.showMessageBox({
      type: 'error',
      message: `Failed to kill process: ${error.message}`,
    });
  }
});

// 程序入口
app.whenReady().then(createWindow).on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
