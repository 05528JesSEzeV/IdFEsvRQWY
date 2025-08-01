// 代码生成时间: 2025-08-01 23:23:43
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

// 创建窗口并加载应用
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // 加载index.html页面
  mainWindow.loadFile('index.html');

  // 开启开发者工具
  mainWindow.webContents.openDevTools();
}

// 在Electron完成初始化后创建窗口
app.whenReady().then(createWindow);

// 处理错误
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

// 预加载脚本：用于暴露表单验证函数
const preload = `
  <script>
    window.addEventListener('DOMContentLoaded', () => {
      const validateForm = () => {
        // 获取表单数据
        const formData = {
          username: document.querySelector('#username').value,
          password: document.querySelector('#password').value,
          email: document.querySelector('#email').value,
        };

        // 简单的表单验证逻辑
        if (!formData.username || !formData.username.trim()) {
          return { isValid: false, message: 'Username is required.' };
        }
        if (!formData.password || !formData.password.trim()) {
          return { isValid: false, message: 'Password is required.' };
        }
        if (!formData.email || !formData.email.trim() || !formData.email.includes('@')) {
          return { isValid: false, message: 'Email is invalid.' };
        }

        // 所有验证通过
        return { isValid: true };
      };

      // 绑定表单提交事件
      document.querySelector('#myForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const validationResult = validateForm();
        if (!validationResult.isValid) {
          alert(validationResult.message);
        } else {
          // 可以在这里处理表单提交逻辑
          alert('Form is valid!');
        }
      });
    });
  </script>`;

// 将预加载脚本保存为preload.js文件
fs.writeFileSync(path.join(__dirname, 'preload.js'), preload, 'utf8');

// 注释和文档：
// 该脚本实现了一个简单的表单验证器功能，适用于Electron应用。
// 它包括基本的用户名、密码和电子邮件验证，并在表单提交时进行验证。
// 如果验证失败，将显示相应的错误消息；如果验证通过，则显示成功消息。
// 预加载脚本中的validateForm函数可以按照需要进行扩展和自定义。