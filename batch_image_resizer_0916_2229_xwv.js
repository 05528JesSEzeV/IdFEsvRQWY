// 代码生成时间: 2025-09-16 22:29:56
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

// 配置文件路径
const configPath = path.join(app.getPath('userData'), 'settings.json');

// 创建BrowserWindow的构造函数
class BatchImageResizer extends BrowserWindow {
    constructor() {
        super({
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });
        this.loadFile('index.html');
    }

    // 打开文件夹对话框
    openFileDialog() {
        dialog.showOpenDialog(this, {
            properties: ['openDirectory']
        }).then((result) => {
            if (!result.canceled && result.filePaths.length > 0) {
                this.resizeImages(result.filePaths[0]);
            }
        });
    }

    // 调整图片尺寸
    async resizeImages(directoryPath) {
        try {
            const files = fs.readdirSync(directoryPath);
            for (const file of files) {
                if (path.extname(file).toLowerCase() === '.jpg' || path.extname(file).toLowerCase() === '.png') {
                    const imagePath = path.join(directoryPath, file);
                    await Jimp.read(imagePath)
                        .then(image => {
                            image.resize(800, Jimp.AUTO) // Resize to 800px wide while maintaining aspect ratio
                                .write(imagePath); // Overwrite the original file
                        }).catch(error => {
                            console.error(`Error resizing ${file}:`, error);
                        });
                }
            }
        } catch (error) {
            console.error('Error reading directory:', error);
        }
    }
}

// 程序入口点，创建并显示窗口
function createWindow() {
    // 创建BatchImageResizer实例
    const win = new BatchImageResizer();
    win.on('ready-to-show', () => {
        win.show();
        win.openFileDialog();
    });
}

app.whenReady().then(createWindow);