// 代码生成时间: 2025-10-11 18:27:03
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const userDataPath = app.getPath('userData');

// 定义会员积分系统类
class MemberPointsSystem {
  constructor() {
    this.pointsFile = path.join(userDataPath, 'points.json');
    this.pointsData = {};
  }

  // 初始化会员积分数据
  initPoints() {
    try {
      const data = fs.readFileSync(this.pointsFile, 'utf8');
      this.pointsData = JSON.parse(data);
    } catch (error) {
      console.error('Error initializing points data:', error);
      this.pointsData = {};
    }
  }

  // 添加会员积分
  addPoints(memberId, points) {
    if (!this.pointsData[memberId]) {
      this.pointsData[memberId] = 0;
    }
    this.pointsData[memberId] += points;
    this.savePoints();
  }

  // 获取会员积分
  getPoints(memberId) {
    if (this.pointsData[memberId]) {
      return this.pointsData[memberId];
    } else {
      return 0;
    }
  }

  // 保存会员积分数据到文件
  savePoints() {
    try {
      const data = JSON.stringify(this.pointsData, null, 2);
      fs.writeFileSync(this.pointsFile, data);
    } catch (error) {
      console.error('Error saving points data:', error);
    }
  }
}

// 创建Electron主窗口
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 此脚本在Electron主进程中运行
app.whenReady().then(createWindow);

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

// Preload脚本，用于在渲染进程中使用Node.js功能
const preloadScript = `
  // 定义会员积分系统类
  class MemberPointsSystem {
    constructor() {
      this.pointsFile = require('electron').remote.app.getPath('userData') + '/points.json';
      this.pointsData = {};
    }

    // 初始化会员积分数据
    initPoints() {
      try {
        const data = require('fs').readFileSync(this.pointsFile, 'utf8');
        this.pointsData = JSON.parse(data);
      } catch (error) {
        console.error('Error initializing points data:', error);
        this.pointsData = {};
      }
    }

    // 添加会员积分
    addPoints(memberId, points) {
      if (!this.pointsData[memberId]) {
        this.pointsData[memberId] = 0;
      }
      this.pointsData[memberId] += points;
      this.savePoints();
    }

    // 获取会员积分
    getPoints(memberId) {
      if (this.pointsData[memberId]) {
        return this.pointsData[memberId];
      } else {
        return 0;
      }
    }

    // 保存会员积分数据到文件
    savePoints() {
      try {
        const data = JSON.stringify(this.pointsData, null, 2);
        require('fs').writeFileSync(this.pointsFile, data);
      } catch (error) {
        console.error('Error saving points data:', error);
      }
    }
  }

  // 创建会员积分系统实例
  const pointsSystem = new MemberPointsSystem();
  pointsSystem.initPoints();

  // 导出会员积分系统实例
  module.exports = pointsSystem;
`;

// 将Preload脚本保存到文件
fs.writeFileSync(path.join(__dirname, 'preload.js'), preloadScript);

// HTML文件，用于渲染Electron窗口
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset='UTF-8'>
  <title>会员积分系统</title>
</head>
<body>
  <h1>会员积分系统</h1>
  <button id='addPoints'>添加积分</button>
  <p>会员积分: <span id='memberPoints'>0</span></p>
  <script>
    // 导入会员积分系统实例
    const pointsSystem = require('./preload');

    // 添加积分事件处理
    document.getElementById('addPoints').addEventListener('click', () => {
      pointsSystem.addPoints('member1', 10);
      document.getElementById('memberPoints').textContent = pointsSystem.getPoints('member1');
    });
  </script>
</body>
</html>
`;

// 将HTML内容保存到文件
fs.writeFileSync(path.join(__dirname, 'index.html'), htmlContent);