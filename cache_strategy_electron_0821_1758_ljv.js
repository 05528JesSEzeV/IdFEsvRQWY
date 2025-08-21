// 代码生成时间: 2025-08-21 17:58:42
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

// 设置日志文件存储路径
log.transports.file.level = 'info';
log.transports.file.fileName = 'cache_strategy.log';

class CacheStrategy {
  // 构造函数，初始化缓存路径和窗口
  constructor() {
    this.cachePath = path.join(app.getPath('userData'), 'cache');
    this.window = null;
  }

  // 创建缓存目录
  createCacheDirectory() {
    try {
      if (!fs.existsSync(this.cachePath)) {
        fs.mkdirSync(this.cachePath, { recursive: true });
      }
    } catch (error) {
      log.error(`Failed to create cache directory: ${error}`);
      throw error;
    }
  }

  // 获取缓存文件路径
  getCacheFilePath(file) {
    return path.join(this.cachePath, file);
  }

  // 检查缓存文件是否存在
  async checkCacheExists(file) {
    const filePath = this.getCacheFilePath(file);
    return fs.existsSync(filePath);
  }

  // 读取缓存文件
  async readCacheFile(file) {
    const filePath = this.getCacheFilePath(file);
    if (!(await this.checkCacheExists(file))) {
      throw new Error(`Cache file ${file} does not exist`);
    }
    return fs.readFileSync(filePath, 'utf-8');
  }

  // 写入缓存文件
  async writeCacheFile(file, content) {
    const filePath = this.getCacheFilePath(file);
    fs.writeFileSync(filePath, content);
  }

  // 清除缓存
  clearCache() {
    fs.rmdirSync(this.cachePath, { recursive: true });
  }

  // 初始化Electron窗口
  initWindow() {
    this.window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    this.window.loadFile('index.html');
  }

  // 开始应用
  async start() {
    try {
      this.createCacheDirectory();
      this.initWindow();

      // 设置自动更新钩子
      autoUpdater.logger = log;
      autoUpdater.checkForUpdatesAndNotify();
    } catch (error) {
      log.error(`Error starting application: ${error}`);
    }
  }
}

// 应用主入口点
app.on('ready', () => {
  try {
    const cacheStrategy = new CacheStrategy();
    cacheStrategy.start();
  } catch (error) {
    console.error('Failed to start application:', error);
  }
});

// 窗口关闭时退出应用
app.on('window-all-closed', () => {
  app.quit();
});