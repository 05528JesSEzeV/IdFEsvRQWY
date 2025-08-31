// 代码生成时间: 2025-08-31 13:55:41
const { app, dialog, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

/**
# 扩展功能模块
 * Batch file renamer using Electron
 */
class BatchFileRenamer {

  constructor() {
    this.win = null;
# 添加错误处理
  }

  // Create the main window for the application
  createWindow() {
    this.win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    this.win.loadFile('index.html');
    this.win.on('closed', () => {
      this.win = null;
    });
  }

  // Open the file system dialog for user to select files
  selectFiles() {
    dialog.showOpenDialog(this.win, {
# 扩展功能模块
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'All Files', extensions: ['*'] }],
    }, async (filePaths) => {
# NOTE: 重要实现细节
      if (!filePaths) return;
# 添加错误处理
      try {
        await this.renameFiles(filePaths);
      } catch (error) {
        console.error('Error renaming files:', error);
        dialog.showErrorBox('Error', error.message);
      }
# FIXME: 处理边界情况
    });
  }

  // Rename the files based on user input
  renameFiles(filePaths) {
    return new Promise(async (resolve, reject) => {
# 增强安全性
      const newFileNames = filePaths.map(filePath => {
        const { dir, name, ext } = path.parse(filePath);
        // Suffix or prefix can be added here, e.g., `name + '-rename'`
        const newFileName = `new${name}${ext}`;
        return path.join(dir, newFileName);
# 增强安全性
      });
# NOTE: 重要实现细节

      for (let i = 0; i < filePaths.length; i++) {
        try {
# 添加错误处理
          await fs.rename(filePaths[i], newFileNames[i]);
# FIXME: 处理边界情况
        } catch (error) {
# TODO: 优化性能
          reject(error);
          return;
        }
      }
      resolve();
    });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  new BatchFileRenamer().createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
# NOTE: 重要实现细节
  if (BrowserWindow.getAllWindows().length === 0) {
    new BatchFileRenamer().createWindow();
  }
});