// 代码生成时间: 2025-08-14 02:54:31
const { app, BrowserWindow, ipcMain } = require('electron');
const { resolve } = require('path');
const { format } = require('util');
const paymentService = require('./payment_service'); // Assuming a payment_service module

// Create a function to create window
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the index.html of the app
  mainWindow.loadFile('index.html');

  // Open the DevTools if in development
  if (app.isInDevelopment()) mainWindow.webContents.openDevTools();
}

// Handle payment process
ipcMain.on('process-payment', async (event, paymentDetails) => {
  try {
    // Validate payment details
    if (!paymentDetails || typeof paymentDetails !== 'object') {
      throw new Error('Invalid payment details');
    }

    // Process payment using the payment service
    const paymentResult = await paymentService.processPayment(paymentDetails);

    // Send back the result to the renderer process
    event.reply('process-payment-response', paymentResult);
  } catch (error) {
    // Handle errors and send back to the renderer process
    event.reply('process-payment-response', {
      success: false,
      message: error.message,
    });
  }
});

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window
    if (BrowserWindow.getAllWindows().length) {
      BrowserWindow.getAllWindows()[0].focus();
    }
  });

  app.on('ready', createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}

// Export functions for testing
module.exports = {
  createWindow,
  processPayment: paymentService.processPayment,
};