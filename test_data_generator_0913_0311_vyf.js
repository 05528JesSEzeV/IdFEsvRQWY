// 代码生成时间: 2025-09-13 03:11:13
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const faker = require('faker');

// 定义一个函数来生成测试数据
function generateTestData(count) {
  let data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      id: i + 1,
      name: faker.name.findName(),
      email: faker.internet.email(),
      address: faker.address.streetAddress()
    });
  }
  return data;
}

// 定义一个函数来保存数据到文件
function saveTestData(data, filename) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filename, jsonData, 'utf8');
    console.log(`TestData saved successfully in ${filename}`);
  } catch (error) {
    console.error('Error saving test data:', error);
  }
}

// 创建并加载Electron窗口
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

// 应用程序启动时，当所有窗口都关闭时退出
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 导出生成和保存测试数据的函数，以便在主进程或渲染进程中使用
module.exports = {
  generateTestData,
  saveTestData
};
