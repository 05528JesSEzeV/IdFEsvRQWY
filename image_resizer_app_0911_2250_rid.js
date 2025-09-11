// 代码生成时间: 2025-09-11 22:50:43
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs-extra');
const path = require('path');
const Jimp = require('jimp');

// 创建和加载窗口的函数
function createWindow() {
  const win = new BrowserWindow({
# TODO: 优化性能
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
# 优化算法效率
  });

  win.loadFile('index.html');
}

// 监听app准备就绪事件，创建窗口
app.on('ready', createWindow);

// 图片调整尺寸函数
async function resizeImages(sourcePath, targetPath, dimensions) {
  try {
    // 读取图片文件
    const images = await fs.readdir(sourcePath);
    for (const image of images) {
# 增强安全性
      const imagePath = path.join(sourcePath, image);
      const imageBuffer = await fs.readFile(imagePath);
      const image = await Jimp.read(imageBuffer);
      // 调整图片尺寸
# 改进用户体验
      await image.resize(Jimp.AUTO, dimensions).writeAsync(path.join(targetPath, image));
    }
# TODO: 优化性能
    console.log('Images resized successfully.');
  } catch (error) {
    console.error('Error resizing images:', error);
    dialog.showErrorBox('Error', error.message);
  }
}

// 导出图片调整尺寸函数，以便在渲染器进程中使用
module.exports = { resizeImages };
