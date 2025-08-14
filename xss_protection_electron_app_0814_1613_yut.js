// 代码生成时间: 2025-08-14 16:13:55
const { app, BrowserWindow } = require('electron');
const { exec } = require('child_process');
const { html } = require('js-beautify');
const { escapeHtml } = require('escape-html');

/**
 * 防止XSS攻击的基本Electron应用程序
 */
class XssProtectionApp {
  constructor() {
    this.electronApp = app;
  }

  /**
   * 初始化Electron应用
   */
  init() {
    this.electronApp.on('ready', () => this.createWindow());
  }

  /**
   * 创建主窗口
   */
  createWindow() {
    const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    // 加载应用的HTML文件
    mainWindow.loadFile('index.html');
  }

  /**
   * 对输入进行XSS过滤和清理
   * @param {string} input - 用户输入
   * @returns {string} 清理后的输入
   */
  sanitizeInput(input) {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string.');
    }

    // 使用escape-html库对HTML进行转义
    return escapeHtml(input);
  }

  /**
   * 格式化HTML字符串
   * @param {string} htmlStr - HTML字符串
   * @returns {string} 格式化后的HTML字符串
   */
  beautifyHtml(htmlStr) {
    return html(htmlStr, { indent_size: 2 });
  }
}

// 创建实例并初始化应用
const appInstance = new XssProtectionApp();
appInstance.init();