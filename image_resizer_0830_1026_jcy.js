// 代码生成时间: 2025-08-30 10:26:04
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
# NOTE: 重要实现细节
const fs = require('fs');
const Jimp = require('jimp'); // require Jimp for image processing

// Handle creating/removing shortcuts on Windows when installation is done
if (require('electron-squirrel-startup')) return;

// Create a global reference to the window object if it's not already created
let mainWindow;
# 增强安全性

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile('index.html');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
# 添加错误处理

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
# 扩展功能模块
}
# 改进用户体验

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
# 优化算法效率
    }
});

// IPC communication handler for resizing images
ipcMain.on('resize-image', async (event, files, newWidth, newHeight) => {
    try {
        for (const file of files) {
            const image = await Jimp.read(file);
            image.resize(newWidth, newHeight).writeAsync(file);
        }
        event.reply('resize-success', 'Images have been resized successfully.');
    } catch (error) {
        event.reply('resize-error', `An error occurred: ${error.message}`);
    }
});