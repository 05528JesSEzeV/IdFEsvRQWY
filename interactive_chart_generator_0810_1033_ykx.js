// 代码生成时间: 2025-08-10 10:33:32
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const Chart = require('chart.js'); // 引入 Chart.js 库
const ChartJSNodeCanvas = require('chartjs-node-canvas'); // 用于 Electron 环境下的渲染
const { JSDOM } = require('jsdom'); // 用于解析 HTML 文档

// 定义图表生成函数
function generateChart(data, type, options) {
  return new Promise((resolve, reject) => {
    const canvas = new ChartJSNodeCanvas({ width: 800, height: 600 });
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
      type: type,
      data: data,
      options: options,
    });

    // 当图表渲染完成时
    canvas.renderToBuffer((err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
}

// 创建 Electron 应用窗口
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // 加载应用的主页面
  win.loadFile('index.html');
}

// 当 Electron 应用准备好时
app.whenReady().then(createWindow);

// 处理所有窗口关闭事件
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 在应用程序激活时重新创建窗口
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 预加载脚本，用于向渲染进程暴露渲染图表的方法
const preload = path.join(__dirname, 'preload.js');

// index.html 的内容，用于提供交互式图表生成器的界面
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Chart Generator</title>
</head>
<body>
  <h1>Interactive Chart Generator</h1>
  <!-- 表单用于输入图表数据和配置 -->
  <form id="chartForm">
    <label for="chartType">Chart Type:</label>
    <select id="chartType">
      <option value="bar">Bar</option>
      <option value="line">Line</option>
      <option value="pie">Pie</option>
    </select>

    <label for="chartData">Chart Data:</label>
    <textarea id="chartData"></textarea>

    <button type="button" id="generateButton">Generate Chart</button>
  </form>

  <canvas id="chartCanvas"></canvas>

  <script src="renderer.js"></script>
</body>
</html>`;

// renderer.js 的内容，用于处理图表生成的逻辑
const rendererJs = `document.addEventListener('DOMContentLoaded', () => {
  const generateButton = document.getElementById('generateButton');
  const chartType = document.getElementById('chartType');
  const chartData = document.getElementById('chartData');
  const chartCanvas = document.getElementById('chartCanvas');

  generateButton.addEventListener('click', async () => {
    try {
      const type = chartType.value;
      const data = JSON.parse(chartData.value);

      // 调用 preload.js 中暴露的 generateChart 方法
      const buffer = await window.generateChart(data, type);

      // 使用 JSDOM 渲染 canvas 元素，并插入到 DOM 中
      const dom = new JSDOM();
      const canvas = dom.window.document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`;
      img.onload = () => { ctx.drawImage(img, 0, 0); };
      chartCanvas.appendChild(canvas);
    } catch (error) {
      console.error('Error generating chart:', error);
    }
  });
});`;

// 将 index.html 和 renderer.js 写入文件系统
fs.writeFileSync(path.join(__dirname, 'index.html'), indexHtml);
fs.writeFileSync(path.join(__dirname, 'renderer.js'), rendererJs);

// preload.js 的内容，用于在渲染进程中暴露图表生成方法
const preloadJs = `window.generateChart = async (data, type) => {
  return new Promise((resolve, reject) => {
    const { ipcRenderer } = require('electron');
    ipcRenderer.invoke('generate-chart', data, type)
      .then(resolve)
      .catch(reject);
  });
};`;

// 将 preload.js 写入文件系统
fs.writeFileSync(path.join(__dirname, 'preload.js'), preloadJs);

// 注册 IPC 事件以处理图表生成请求
const { ipcMain } = require('electron');
ipcMain.handle('generate-chart', async (event, data, type) => {
  try {
    return await generateChart(data, type);
  } catch (error) {
    console.error('Error in generate-chart IPC handler:', error);
    throw error;
  }
});
