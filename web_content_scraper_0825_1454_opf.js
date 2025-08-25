// 代码生成时间: 2025-08-25 14:54:27
const { app, BrowserWindow } = require('electron');
const axios = require('axios');
const cheerio = require('cheerio');

/**
 * 创建一个新的 BrowserWindow 实例，用于加载和显示网页内容
 */
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
  });

  win.loadFile('index.html');
  win.on('closed', () => {
    win = null;
  });
}

/**
 * 网页内容抓取函数
 * @param {string} url - 需要抓取内容的网页地址
 * @returns {Promise<any>} - 抓取到的网页内容
 */
async function scrapeWebContent(url) {
  try {
    const response = await axios.get(url);
    if (response.status !== 200) {
      throw new Error(`Failed to fetch the page. Status: ${response.status}`);
    }
    const $ = cheerio.load(response.data);
    const content = $('#content').text(); // 假设网页中有一个id为'content'的元素包含我们需要的数据
    return content;
  } catch (error) {
    console.error('Error in scraping web content:', error);
    throw error;
  }
}

// Electron主进程
app.on('ready', createWindow);

// 确保当Electron窗口全部关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 激活应用时，如果有其他实例运行，则聚焦到该实例上
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 导出抓取函数，以便在渲染器进程中使用
module.exports = { scrapeWebContent };