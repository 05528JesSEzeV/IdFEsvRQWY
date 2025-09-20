// 代码生成时间: 2025-09-20 17:30:27
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

// 功能：创建主窗口
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  
  // 加载HTML页面
  win.loadFile('index.html');
  
  // 打开开发者工具
  win.webContents.openDevTools();
}

// 功能：错误处理
function handleError(error) {
  console.error('An error occurred:', error.message);
  app.quit();
}

// 功能：数据清洗函数
function cleanData(data) {
  // 检查数据类型
  if (!Array.isArray(data)) {
    throw new Error('Data must be an array.');
  }
  
  // 清洗数据
  return data.map(item => {
    // 去除前后空格
    return item.trim();
  }).filter(item => {
    // 移除空字符串
    return item !== '';
  });
}

// 功能：读取文件并清洗数据
function processData(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    
    try {
      const cleanedData = cleanData(JSON.parse(data));
      // 将清洗后的数据保存到新文件中
      fs.writeFile('cleaned_data.json', JSON.stringify(cleanedData), 'utf8', (err) => {
        if (err) throw err;
        console.log('Data cleaned successfully.');
      });
    } catch (error) {
      handleError(error);
    }
  });
}

// 功能：ELECTRON主程序入口
app.whenReady().then(createWindow).catch(handleError);

// 功能：监听文件路径参数
app.on('command', (event, filePath) => {
  if (!filePath) {
    console.log('No file path provided.');
    return;
  }
  
  try {
    processData(filePath);
  } catch (error) {
    handleError(error);
  }
});

// 功能：所有窗口关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
