// 代码生成时间: 2025-08-12 01:00:33
// csv_batch_processor.js
// 一个使用JS和ELECTRON框架的CSV文件批量处理器

const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { Transform } = require('stream');

// 处理CSV文件的函数
function processCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    let errorOccurred = false;
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('error', (err) => {
        errorOccurred = true;
        reject(err);
      })
      .on('end', () => {
        if (!errorOccurred) {
          resolve(results);
        }
      });
  });
}

// 主函数，用于启动Electron应用
function main() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
  });
  win.loadFile('index.html');
}

// 从对话框选择CSV文件
function openFileDialog() {
  dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'CSV Files', extensions: ['csv'] }]
  }).then(result => {
    if (result.canceled) return;
    
    const filePaths = result.filePaths;
    filePaths.forEach((filePath, index) => {
      processCSVFile(filePath)
        .then(data => {
          console.log(`Processed ${filePath}: ${JSON.stringify(data)}`);
        })
        .catch(err => {
          console.error(`Error processing ${filePath}: ${err.message}`);
        });
    });
  });
}

// 应用准备就绪时，创建窗口
app.whenReady().then(main);

// 所有窗口关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 应用激活时，如果没有创建窗口，则创建一个新的窗口
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    main();
  }
});