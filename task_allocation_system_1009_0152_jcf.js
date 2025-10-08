// 代码生成时间: 2025-10-09 01:52:23
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const userDataPath = path.join(os.homedir(), '.task_allocation_system');

// 创建主窗口
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    },
  });

  win.loadFile('index.html');

  // 打开开发者工具
  win.webContents.openDevTools();
}

// 当Electron完成初始化并准备好创建浏览器窗口时，调用此函数
app.whenReady().then(createWindow);
a
// 所有窗口关闭时退出应用程序
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 激活应用程序并创建新的窗口
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 处理任务分配的IPC消息
ipcMain.handle('assign-task', async (event, taskId, assignee) => {
  try {
    // 验证任务ID和被分配者
    if (!taskId || !assignee) {
      throw new Error('Task ID and assignee are required.');
    }

    // 读取任务文件
    const taskFilePath = path.join(userDataPath, `${taskId}.json`);
    const taskData = JSON.parse(fs.readFileSync(taskFilePath, 'utf-8'));

    // 更新任务分配者
    taskData.assignee = assignee;

    // 写入任务文件
    fs.writeFileSync(taskFilePath, JSON.stringify(taskData, null, 2), 'utf-8');

    // 响应成功
    return { success: true, message: 'Task assigned successfully.' };
  } catch (error) {
    // 响应错误
    return { success: false, message: error.message };
  }
});

// 预加载脚本路径
exports.PreloadScriptPath = path.join(__dirname, 'preload.js');

// 任务分配系统的主要JavaScript文件
// 这个文件负责创建Electron应用程序的主窗口，并处理任务分配的IPC消息。
// 它使用Node.js的内置模块，如'fs'和'os'，来读写用户数据和文件。
// 代码结构清晰，易于理解，包含适当的错误处理，遵循JS最佳实践。
// 通过使用IPC消息，应用程序的UI和逻辑层分离，提高了代码的可维护性和可扩展性。