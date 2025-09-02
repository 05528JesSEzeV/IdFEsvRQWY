// 代码生成时间: 2025-09-03 02:07:36
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

// 购物车类
class ShoppingCart {
  constructor() {
    this.items = [];
  }

  // 添加商品到购物车
  addItem(item) {
    if (!item || typeof item !== 'object' || item.id === undefined) {
      throw new Error('Invalid item added to cart');
    }
    this.items.push(item);
  }

  // 获取购物车中的商品
  getItems() {
    return this.items;
  }

  // 移除购物车中的指定商品
  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
  }

  // 清空购物车
  clear() {
    this.items = [];
  }
}

// 创建和加载购物车窗口
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  win.loadFile('index.html');

  win.on('closed', () => {
    win = null;
  });
}

// 此预加载脚本用于在渲染器和主进程之间安全地传递信息
const preload = `<script>
  // 预加载脚本示例，可以根据需要添加更多功能
  window.addEventListener('DOMContentLoaded', () => {
    const cart = new ShoppingCart();
    // 可以根据需要在此添加更多预加载逻辑
  });
</script>`;

// 将预加载脚本保存到文件
fs.writeFile(path.join(__dirname, 'preload.js'), preload, (err) => {
  if (err) {
    console.error('Failed to write preload script:', err);
    return;
  }
  console.log('Preload script written successfully');
});

app.whenReady().then(createWindow).on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});