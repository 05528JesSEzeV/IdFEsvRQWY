// 代码生成时间: 2025-08-15 04:56:47
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

// 数据模型类
class DataModel {
  // 构造函数
  constructor(databasePath) {
    this.databasePath = databasePath;
  }

  // 读取数据
  async readData() {
    try {
      const data = fs.readFileSync(this.databasePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading data:', error);
      throw error;
    }
  }

  // 写入数据
  async writeData(data) {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      fs.writeFileSync(this.databasePath, jsonData, 'utf8');
    } catch (error) {
      console.error('Error writing data:', error);
      throw error;
    }
  }
}

// 创建Electron窗口的函数
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  mainWindow.loadFile('index.html');
}

// 监听渲染进程的消息
ipcMain.on('read-data', async (event) => {
  try {
    const dataModel = new DataModel('data.json');
    const data = await dataModel.readData();
    event.reply('data-read', data);
  } catch (error) {
    event.reply('data-read-error', error.message);
  }
});

ipcMain.on('write-data', async (event, data) => {
  try {
    const dataModel = new DataModel('data.json');
    await dataModel.writeData(data);
    event.reply('data-written', 'Data written successfully');
  } catch (error) {
    event.reply('data-write-error', error.message);
  }
});

// 应用准备就绪时创建窗口
app.whenReady().then(createWindow);

// 应用的所有窗口都被关闭时退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 应用激活时重新创建窗口
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});