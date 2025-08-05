// 代码生成时间: 2025-08-05 14:56:23
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// 定义数据库迁移工具类
class DatabaseMigrationTool {
  // 构造函数，初始化数据库连接
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('数据库连接失败:', err);
      } else {
        console.log('数据库连接成功');
      }
    });
  }

  // 执行迁移操作
  migrate(migrationFunction) {
    migrationFunction(this.db, (err) => {
      if (err) {
        console.error('迁移失败:', err);
      } else {
        console.log('迁移成功');
        this.db.close();
      }
    });
  }
}

// 定义迁移函数模板
function migrationFunction(db, callback) {
  // 这里编写具体的迁移逻辑，例如创建表、更新数据等
  // 示例：创建一个新表
  const createTableQuery = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)';
  db.run(createTableQuery, (err) => {
    if (err) {
      callback(err);
    } else {
      console.log('用户表创建成功');
      callback(null);
    }
  });
}

// 创建一个迁移实例并执行迁移
function startMigration(dbPath) {
  const migrationTool = new DatabaseMigrationTool(dbPath);
  migrationTool.migrate(migrationFunction);
}

// Electron 主进程
app.on('ready', () => {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({ width: 800, height: 600 });
  mainWindow.loadFile('index.html');

  // 打开开发者工具
  mainWindow.webContents.openDevTools();

  // 当窗口关闭时退出应用
  mainWindow.on('closed', () => {
    app.quit();
  });

  // 设置数据库路径
  const dbPath = path.join(app.getPath('userData'), 'database.sqlite');
  // 启动迁移
  startMigration(dbPath);
});