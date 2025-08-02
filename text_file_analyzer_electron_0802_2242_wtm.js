// 代码生成时间: 2025-08-02 22:42:40
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

// 定义一个函数来打开文件对话框并分析文件内容
function analyzeTextFile() {
  const mainWindow = BrowserWindow.getFocusedWindow();
  if (mainWindow) {
    dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [{ name: 'Text Files', extensions: ['txt'] }],
    }).then((result) => {
      if (result.canceled || !result.filePaths.length) return;
      
      const filePath = result.filePaths[0];
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          dialog.showMessageBox(mainWindow, {
            type: 'error',
            message: 'Error reading file: ' + err.message,
          });
          return;
        }
        
        // 分析文本内容（示例：计算词频）
        const wordCounts = analyzeWordFrequency(data);
        
        // 显示结果
        dialog.showMessageBox(mainWindow, {
          type: 'info',
          message: `Word Frequencies:
${JSON.stringify(wordCounts, null, 2)}`,
        });
      });
    });
  }
}

// 文本内容分析函数（简单示例：计算词频）
function analyzeWordFrequency(text) {
  const words = text.split(/\s+/);
  const wordCounts = words.reduce((counts, word) => {
    const trimmedWord = word.trim().toLowerCase();
    if (trimmedWord) {
      counts[trimmedWord] = (counts[trimmedWord] || 0) + 1;
    }
    return counts;
  }, {});
  return wordCounts;
}

// 创建主窗口
app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile('index.html');
  
  // 添加菜单项来调用分析函数
  const menu = new Menu();
  menu.append(new MenuItem({
    label: 'Analyze Text File',
    click: analyzeTextFile,
  }));
  Menu.setApplicationMenu(menu);
});

// 确保所有窗口关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 重启事件来处理重新启动
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});