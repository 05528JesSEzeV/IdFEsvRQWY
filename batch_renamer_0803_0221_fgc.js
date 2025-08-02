// 代码生成时间: 2025-08-03 02:21:10
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

// 定义批量重命名工具的类
class BatchRenamer {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
  }

  // 打开文件选择对话框
  openFileDialog() {
    dialog.showOpenDialog(this.mainWindow, {
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'All Files', extensions: ['*'] }]
    }).then(result => {
      if (!result.canceled && result.filePaths.length > 0) {
        this.renameFiles(result.filePaths);
      }
    }).catch(error => {
      console.error('Failed to open file dialog:', error);
    });
  }

  // 批量重命名文件
  renameFiles(filePaths) {
    const renamePattern = this.getRenamePattern();
    if (!renamePattern) {
      return;
    }
    
    filePaths.forEach((filePath, index) => {
      const newFileName = this.generateNewFileName(renamePattern, index);
      const newFilePath = path.join(path.dirname(filePath), newFileName);
      fs.rename(filePath, newFilePath, (err) => {
        if (err) {
          console.error(`Failed to rename ${filePath} to ${newFilePath}: `, err);
        } else {
          console.log(`Renamed ${filePath} to ${newFilePath}`);
        }
      });
    });
  }

  // 获取用户输入的重命名模式
  getRenamePattern() {
    return dialog.showInputBox(this.mainWindow, {
      prompt: 'Enter rename pattern (e.g., "file_#.ext"):',
      title: 'Batch Renamer'
    }).then(result => {
      return result.response;
    }).catch(error => {
      console.error('Failed to get input:', error);
      return null;
    });
  }

  // 生成新文件名
  generateNewFileName(pattern, index) {
    return pattern.replace(/#/g, index.toString().padStart(4, '0'));
  }
}

// 创建 Electron 主窗口
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html'); // 加载主页面

  // 打开文件选择对话框的事件监听器
  ipcMain.on('open-file-dialog', () => {
    batchRenamer.openFileDialog();
  });
}

// Electron 主进程
app.whenReady().then(createWindow);

// 全局变量：批量重命名工具实例
const batchRenamer = new BatchRenamer(null);

// 监听 Electron 应用关闭事件
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 监听 Electron 应用活动事件
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});