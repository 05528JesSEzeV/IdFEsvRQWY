// 代码生成时间: 2025-08-12 21:23:46
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

// 认证配置文件路径
const authConfigPath = path.join(__dirname, 'authConfig.json');

// 权限配置结构
const authConfig = {
    // 用户名和密码
    username: 'admin',
    password: 'password123',
    // 访问权限列表
    permissions: ['read', 'write', 'delete']
};

// 保存权限配置到文件
function saveAuthConfig() {
    fs.writeFileSync(authConfigPath, JSON.stringify(authConfig, null, 2));
}

// 读取权限配置
function loadAuthConfig() {
    try {
        const data = fs.readFileSync(authConfigPath);
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading auth config:', error);
        return null;
    }
}

// 检查用户是否有权限
function hasPermission(username, password, permission) {
    const config = loadAuthConfig();
    if (!config) return false;
    return config.username === username && config.password === password && config.permissions.includes(permission);
}

// 创建主窗口
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile('index.html');
}

// 初始化Electron应用
app.whenReady().then(createWindow).catch(console.error);

// 监听IPC消息
ipcMain.on('check-access', (event, args) => {
    try {
        const { username, password, permission } = args;
        if (hasPermission(username, password, permission)) {
            event.reply('check-access-response', {
                success: true,
                message: 'Access granted'
            });
        } else {
            event.reply('check-access-response', {
                success: false,
                message: 'Access denied'
            });
        }
    } catch (error) {
        event.reply('check-access-response', {
            success: false,
            message: 'Error checking access',
            error: error.message
        });
    }
});

// 应用将关闭时保存权限配置
app.on('will-quit', () => {
    saveAuthConfig();
});

// 防止未定义的IPC消息错误
app.on('will-finish-launching', () => {
    app.on('open-file', (e, path) => {
        e.preventDefault();
    });
});

// 错误处理
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});