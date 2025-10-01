// 代码生成时间: 2025-10-01 16:51:53
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');

// 自动更新事件处理
autoUpdater.checkForUpdatesAndNotify();

// 创建浏览器窗口
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // 加载B2B采购系统页面
  const startUrl = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, 'build/index.html')}`;
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 确保应用程序只运行一个实例
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

app.on('ready', () => {
  createWindow();
  // 打开开发者工具
  if (isDev) mainWindow.webContents.openDevTools();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// 处理应用错误
process.on('uncaughtException', error => {
  console.error('捕获异常:', error);
  mainWindow.webContents.send('error', error);
});

// 预加载脚本，用于暴露Node功能给渲染进程
const preload = `
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // 暴露IPC通信
  send(channel, data) {
    ipcRenderer.send(channel, data);
  },
  receive(channel, func) {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  // 暴露更多Node功能
  // ...
});
`;

// 将预加载脚本写入文件
const fs = require('fs');
fs.writeFileSync(path.join(__dirname, 'preload.js'), preload);

// B2B采购系统主逻辑
// 以下为示例逻辑，实际逻辑根据业务需求编写

// 供应商模块
class Supplier {
  constructor(id, name, contact) {
    this.id = id;
    this.name = name;
    this.contact = contact;
  }

  // 获取供应商信息
  getInfo() {
    return {
      id: this.id,
      name: this.name,
      contact: this.contact,
    };
  }
}

// 采购订单模块
class PurchaseOrder {
  constructor(id, supplierId, details) {
    this.id = id;
    this.supplierId = supplierId;
    this.details = details; // 包含商品信息
  }

  // 添加订单详情
  addDetail(item) {
    this.details.push(item);
  }

  // 获取订单信息
  getInfo() {
    return {
      id: this.id,
      supplierId: this.supplierId,
      details: this.details,
    };
  }
}

// 启动Electron应用
app.on('ready', () => {
  createWindow();
});
