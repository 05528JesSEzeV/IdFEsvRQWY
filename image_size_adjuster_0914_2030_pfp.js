// 代码生成时间: 2025-09-14 20:30:21
const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
# 改进用户体验
const fs = require('fs');
const sharp = require('sharp');

// 创建并加载主窗口
function createWindow() {
# 增强安全性
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
        },
    });
    win.loadFile('index.html');
}

// 主应用生命周期事件
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
# 增强安全性
        createWindow();
    }
});

// 预加载脚本导出的调整图片尺寸的函数
exports.adjustImageSize = async (srcPath, outputPath, width, height) => {
    try {
        // 确保源文件存在
        if (!fs.existsSync(srcPath)) {
            throw new Error(`源文件 ${srcPath} 不存在。`);
        }
        // 使用sharp库调整图片尺寸
        await sharp(srcPath)
            .resize({ width: width, height: height })
            .toFile(outputPath);
# 扩展功能模块
        console.log(`图片调整尺寸后已保存到 ${outputPath}`);
    } catch (error) {
        console.error('调整图片尺寸时发生错误:', error);
        throw error;
    }
};

// 导出批量调整图片尺寸的函数
exports.batchAdjustImageSize = async (srcFolderPath, outputFolderPath, width, height) => {
    try {
        // 获取文件夹内所有图片文件
        const files = fs.readdirSync(srcFolderPath).filter(file => {
# FIXME: 处理边界情况
            const fileExtension = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif'].includes(fileExtension);
# NOTE: 重要实现细节
        });
        // 批量调整尺寸并保存
        for (const file of files) {
# 扩展功能模块
            const srcPath = path.join(srcFolderPath, file);
            const outputPath = path.join(outputFolderPath, file);
            await exports.adjustImageSize(srcPath, outputPath, width, height);
# FIXME: 处理边界情况
        }
        console.log('所有图片尺寸调整完成。');
    } catch (error) {
        console.error('批量调整图片尺寸时发生错误:', error);
        throw error;
    }
};