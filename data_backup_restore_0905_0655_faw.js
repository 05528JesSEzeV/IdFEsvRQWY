// 代码生成时间: 2025-09-05 06:55:27
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const os = require('os');
const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;

// 配置文件路径
const config = {
  backupDir: path.join(app.getPath('userData'), 'backup'),
  backupFile: path.join(app.getPath('userData'), 'backup.zip')
};

// 创建备份窗口的函数
function createBackupWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  win.loadFile('backup.html');
  win.on('closed', () => {
    win = null;
  });
}

// 初始化备份目录
function initBackupDir() {
  if (!fs.existsSync(config.backupDir)) {
    fs.mkdirSync(config.backupDir);
  }
}

// 备份数据到指定目录
function backupData() {
  try {
    // 假设我们备份的是app的userData目录
    const backupPath = path.join(config.backupDir, 'userData_backup');
    rimraf.sync(backupPath);
    fs.copyFileSync(app.getPath('userData'), backupPath);
    console.log('Data backup successful.');
  } catch (error) {
    console.error('Backup error:', error);
  }
}

// 从备份中恢复数据
function restoreData() {
  try {
    const backupPath = path.join(config.backupDir, 'userData_backup');
    rimraf.sync(app.getPath('userData'));
    fs.copyFileSync(backupPath, app.getPath('userData'));
    console.log('Data restore successful.');
  } catch (error) {
    console.error('Restore error:', error);
  }
}

// 监听备份事件
ipcMain.on('backup-data', (event) => {
  backupData();
  event.reply('backup-reply', 'Backup initiated.');
});

// 监听恢复事件
ipcMain.on('restore-data', (event) => {
  restoreData();
  event.reply('restore-reply', 'Restore initiated.');
});

// 主进程的入口函数
function main() {
  // 初始化备份目录
  initBackupDir();

  // 创建备份窗口
  createBackupWindow();
}

// Electron应用的主入口点
app.on('ready', () => {
  main();
});

// 退出时清理备份目录
app.on('will-quit', () => {
  rimraf.sync(config.backupDir);
});

// 注释：
// 此脚本是一个ELECTRON应用程序的主进程脚本，
// 它负责初始化备份目录，创建备份窗口，监听备份和恢复的IPC事件，并执行相应的操作。
// 它还确保在应用程序退出时清理备份目录。
// 错误处理是通过try-catch块实现的，确保任何异常都被捕捉和记录。