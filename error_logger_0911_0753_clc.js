// 代码生成时间: 2025-09-11 07:53:35
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * ErrorLogger class to handle error logging in Electron app.
 * @class ErrorLogger
 */
class ErrorLogger {
  /**
   * Initialize the ErrorLogger instance.
   * @param {string} logDirectory - Directory where logs will be stored.
   */
  constructor(logDirectory) {
    this.logDirectory = logDirectory;
    this.setupLogDirectory();
  }

  /**
   * Ensures the log directory exists, if not, creates it.
   * @private
   */
  setupLogDirectory() {
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }
  }

  /**
   * Logs an error to a file.
   * @param {Error} error - Error object to log.
   */
  logError(error) {
    const logFileName = `error_${uuidv4()}.log`;
    const logFilePath = path.join(this.logDirectory, logFileName);
    const errorDetails = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack
    };
    const logContent = JSON.stringify(errorDetails, null, 2);

    fs.writeFileSync(logFilePath, logContent, 'utf8');
  }

  /**
   * Retrieves all log files and sends them to the renderer process.
   * @param {Function} callback - Callback to handle the log files.
   */
  getAllLogFiles(callback) {
    const files = fs.readdirSync(this.logDirectory).filter((file) => file.endsWith('.log'));
    const logFiles = files.map((file) => {
      const filePath = path.join(this.logDirectory, file);
      return {
        name: file,
        contents: fs.readFileSync(filePath, 'utf8')
      };
    });
    callback(logFiles);
  }
}

// Set up error logging
const errorLogger = new ErrorLogger(path.join(app.getPath('userData'), 'logs'));

// Handle writing logs on IPC message
ipcMain.on('log-error', (event, error) => {
  try {
    errorLogger.logError(error);
  } catch (writeError) {
    console.error('Failed to write error log:', writeError);
  }
});

// Handle getting logs on IPC message
ipcMain.on('get-logs', (event, arg) => {
  try {
    errorLogger.getAllLogFiles((logFiles) => {
      event.reply('logs-retrieved', logFiles);
    });
  } catch (getLogsError) {
    console.error('Failed to retrieve logs:', getLogsError);
  }
});

// Example usage in the main process:
// errorLogger.logError(new Error('Example error message'));

// Example usage in the renderer process (e.g., in an error handler):
// ipcRenderer.send('log-error', new Error('Error in renderer'));

// Example of requesting logs from the renderer process:
// ipcRenderer.send('get-logs');
// ipcRenderer.on('logs-retrieved', (event, logs) => {
//   console.log('Retrieved logs:', logs);
// });