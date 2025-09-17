// 代码生成时间: 2025-09-18 06:05:20
// Import necessary Electron modules
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

// Import ExcelJS library for creating Excel files
const ExcelJS = require('exceljs');

// Create a new Excel workbook
const workbook = new ExcelJS.Workbook();

// Create a new worksheet
const worksheet = workbook.addWorksheet('My Sheet');

// Function to generate an Excel file
function generateExcel(data) {
  // Check if data is valid
  if (!data || !Array.isArray(data)) {
    throw new Error('Invalid data provided for Excel generation.');
  }

  // Iterate over the data and add rows to the worksheet
  for (const row of data) {
    const excelRow = worksheet.addRow();
    for (const value of row) {
      excelRow.add(value);
    }
  }

  // Write the workbook to a file
  const date = new Date().toLocaleDateString();
  const filePath = path.join(app.getPath('desktop'), `generated_excel_${date}.xlsx`);

  // Error handling for file writing
  try {
    workbook.xlsx.writeFile(filePath)
      .then(() => console.log(`Excel file created at: ${filePath}`))
      .catch(err => console.error('Error writing Excel file:', err));
  } catch (err) {
    console.error('Error generating Excel file:', err);
  }
}

// Electron setup
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Load the index.html of the app
  win.loadFile('index.html');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow);
a
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// If the app is running as the main process,
// then the app is not running in a browser context.
if (process.argv.includes('--generate')) {
  const data = [
    ['ID', 'Name', 'Age'],
    [1, 'John Doe', 30],
    [2, 'Jane Doe', 25]
  ];
  generateExcel(data);
}

// In this Electron app, we listen for the command line argument '--generate'
// to generate an Excel file without opening the GUI.
// This is useful for automated scripts or testing.
