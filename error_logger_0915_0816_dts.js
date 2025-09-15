// 代码生成时间: 2025-09-15 08:16:49
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

// 错误日志收集器
class ErrorLogger {
    constructor() {
        this.logPath = path.join(app.getPath('userData'), 'logs');
        this.ensureLogDirectory();
    }

    // 确保日志目录存在
    ensureLogDirectory() {
        if (!fs.existsSync(this.logPath)) {
            fs.mkdirSync(this.logPath, { recursive: true });
        }
    }

    // 获取当前日志文件路径
    getCurrentLogFile() {
        const date = new Date().toISOString().replace(/:/g, '-');
        return path.join(this.logPath, `error-log-${date}.log`);
    }

    // 写入错误日志
    writeError(error) {
        const logFile = this.getCurrentLogFile();
        fs.appendFile(logFile, `${new Date().toISOString()} - ERROR: ${error}
`, (err) => {
            if (err) {
                console.error('Failed to write error log:', err);
            }
        });
    }

    // 显示错误对话框并收集错误日志
    showErrorDialog(error) {
        const logFile = this.getCurrentLogFile();
        fs.appendFile(logFile, `${new Date().toISOString()} - ERROR: ${error}
`, (err) => {
            if (err) {
                console.error('Failed to write error log:', err);
                return;
            }
            dialog.showErrorBox('Error', error.message);
        });
    }
}

// 使用示例
const logger = new ErrorLogger();

app.on('ready', () => {
    try {
        // 模拟错误
        throw new Error('Something went wrong!');
    } catch (error) {
        logger.showErrorDialog(error);
    }
});

// 捕获未处理的异常和拒绝的Promise
process.on('uncaughtException', (error) => {
    logger.writeError(error);
    console.error('Uncaught Exception:', error);
    app.exit(1);
});

process.on('unhandledRejection', (reason) => {
    logger.writeError(reason);
    console.error('Unhandled Rejection:', reason);
});
