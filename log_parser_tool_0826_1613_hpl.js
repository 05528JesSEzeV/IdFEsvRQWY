// 代码生成时间: 2025-08-26 16:13:56
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

// Function to parse log files
function parseLogFile(logFilePath) {
  try {
    // Read the log file
    const logData = fs.readFileSync(logFilePath, 'utf-8');
    // Implement parsing logic here
    // For demo, we'll just count the number of lines
    const lineCount = logData.split('
').length - 1;
    console.log(`Parsed log file: ${logFilePath}`);
    console.log(`Total lines: ${lineCount}`);

    // Return parsed data (for now, just the line count)
    return {
      filePath: logFilePath,
      lineCount: lineCount
    };
  } catch (error) {
    console.error(`Error parsing log file: ${error.message}`);
    throw error;
  }
}

// Create Electron BrowserWindow
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Load the index.html file
  win.loadFile('index.html');
}

// Create a directory for storing logs
const logDir = path.join(app.getPath('appData'), 'log-parser-tool');
fs.mkdirSync(logDir, { recursive: true });

// Handle file open dialog
app.on('ready', () => {
  createWindow();
  dialog.showOpenDialog({ properties: ['openFile'] }).then(result => {
    if (result.canceled) return;
    const logFilePath = result.filePaths[0];
    parseLogFile(logFilePath).then(parsedData => {
      console.log(parsedData);
      // You can update the UI with the parsed data here
    }).catch(error => {
      console.error(`Failed to parse log file: ${error.message}`);
      // Handle error in UI if needed
    });
  });
});

// Handle app closing
app.on('window-all-closed', () => {
  app.quit();
});