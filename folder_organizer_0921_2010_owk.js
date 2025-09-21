// 代码生成时间: 2025-09-21 20:10:47
const { app, BrowserWindow, dialog, shell } = require('electron');
const fs = require('fs-extra');
const path = require('path');

// 创建和加载主窗口的函数
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile('index.html');
}

// 程序启动时执行的操作
app.whenReady().then(createWindow).then(() => {
  // 窗口加载完成后的操作
});

// 监听所有窗口关闭事件，退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 激活应用时，如果无窗口显示，则重新创建窗口
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/**
 * 整理文件夹结构的函数
 * @param {string} targetPath - 需要整理的文件夹路径
 */
async function organizeFolderStructure(targetPath) {
  try {
    // 检查路径是否存在
    const exists = await fs.pathExists(targetPath);
    if (!exists) {
      throw new Error('目标文件夹不存在');
    }

    // 读取文件夹内所有文件和子文件夹
    const files = await fs.readdir(targetPath);

    // 遍历文件和子文件夹，进行整理
    for (const file of files) {
      const filePath = path.join(targetPath, file);
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        // 如果是文件夹，则递归整理
        await organizeFolderStructure(filePath);
      } else {
        // 如果是文件，根据需要进行处理，例如移动到特定目录
        // 这里仅作为示例，不做具体操作
        console.log(`文件 ${file} 已检查`);
      }
    }

    console.log(`文件夹 ${targetPath} 整理完成`);
  } catch (error) {
    console.error(`整理文件夹结构时发生错误: ${error.message}`);
  }
}

// 通过对话框选择文件夹并整理结构
async function chooseAndOrganizeFolder() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  if (canceled || filePaths.length === 0) {
    return;
  }
  const targetPath = filePaths[0];
  await organizeFolderStructure(targetPath);
}

// 在渲染进程中调用此函数时触发
ipcMain.on('organize-folder', () => {
  chooseAndOrganizeFolder();
});

// 主进程代码结束
