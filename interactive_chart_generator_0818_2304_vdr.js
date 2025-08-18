// 代码生成时间: 2025-08-18 23:04:42
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const Chart = require('chart.js');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

// 设置 Chart.js 使用 Node.js 环境的渲染器
Chart.register(ChartJSNodeCanvas);

// 创建一个函数来生成图表
function createChart(options) {
  try {
    // 确保提供必要的选项
    if (!options.type || !options.data) {
      throw new Error('图表类型和数据是必需的');
    }

    // 创建一个新的图表实例
    const chart = new Chart.ChartJSNodeCanvas({
      type: options.type,
      data: options.data,
      options: options.options ? options.options : {},
    });

    // 渲染图表并返回图片缓冲区
    return chart.toBuffer('image/png');
  } catch (error) {
    console.error('生成图表时出错:', error.message);
    throw error;
  }
}

// Electron 主进程入口点
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // 加载应用的 index.html 文件
  mainWindow.loadFile('index.html');

  // 打开开发者工具
  mainWindow.webContents.openDevTools();
}

// 这个预加载脚本用于在渲染器和主进程之间安全地传递信息
const preload = `
  // 预加载脚本的代码
  // 例如：暴露 createChart 函数到渲染器进程
  window.createChart = async (options) => {
    return new Promise((resolve, reject) => {
      try {
        const chartBuffer = await window.electronAPI.createChart(options);
        resolve(chartBuffer);
      } catch (error) {
        reject(error);
      }
    });
  };
`;

// 将预加载脚本保存到文件系统
fs.writeFileSync(path.join(__dirname, 'preload.js'), preload);

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

// 定义一个 Electron API 用于渲染器进程调用
exports.createChart = createChart;

// 注释和文档：
// 这个脚本创建了一个 Electron 应用，其中包含一个交互式图表生成器。
// 用户可以通过应用界面输入图表的选项，然后通过预加载脚本调用主进程中的 createChart 函数来生成图表。
// createChart 函数使用 Chart.js 库来生成图表，并返回一个 PNG 图片缓冲区。
// 这个应用遵循最佳实践，包括清晰的代码结构、错误处理、注释和文档，以及可维护性和可扩展性。