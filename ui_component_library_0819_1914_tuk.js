// 代码生成时间: 2025-08-19 19:14:21
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const { createWindow } = require('./windowCreator');

// 定义UI组件库
class UIComponentLibrary {
  constructor() {
    this.components = [];
  }

  // 添加组件
  addComponent(component) {
    if (!component.name || !component.render) {
      throw new Error('Component must have a name and a render function');
    }
    this.components.push(component);
  }

  // 渲染所有组件
  renderAllComponents(window) {
    this.components.forEach(component => {
      try {
        component.render(window);
      } catch (error) {
        console.error(`Error rendering component ${component.name}: ${error}`);
      }
    });
  }
}

// 创建Electron主窗口
function createMainWindow() {
  // 创建窗口
  const mainWindow = createWindow('main', { width: 800, height: 600 });

  // 加载UI组件库
  const uiLibrary = new UIComponentLibrary();
  // 添加组件示例
  uiLibrary.addComponent({
    name: 'Button',
    render: (window) => {
      // 按钮组件的渲染逻辑
      // 可以在这里添加按钮的样式和事件处理
      const button = document.createElement('button');
      button.innerHTML = 'Click me';
      button.onclick = () => {
        console.log('Button clicked');
      };
      window.document.body.appendChild(button);
    }
  });
  
  // 渲染所有组件
  uiLibrary.renderAllComponents(mainWindow);

  // 创建菜单
  const menu = Menu.buildFromTemplate([
    { label: 'Electron', submenu: [
      { label: 'Quit', role: 'quit' }
    ]}
  ]);
  Menu.setApplicationMenu(menu);
}

// Electron主进程入口
function main() {
  // 初始化Electron应用
  app.whenReady().then(createMainWindow);

  // 处理未捕获的异常
  process.on('uncaughtException', error => {
    console.error('Uncaught Exception:', error);
  });
}

// 调用主函数
main();

// 导出UI组件库类，以便在其他文件中使用
module.exports = UIComponentLibrary;