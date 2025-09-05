// 代码生成时间: 2025-09-06 03:59:21
// Required modules
const { BrowserWindow } = require('electron');
const paymentService = require('./payment_service');

// Create a new payment processor instance
class PaymentProcessor {
  constructor() {
    this.window = null;
  }

  // Initialize the payment processor window
  init() {
    this.window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
     }
    });
    this.loadWindow();
  }

  // Load the payment window with the payment.html file
  loadWindow() {
    this.window.loadFile('payment.html');
  }

  // Process the payment
  processPayment(amount, paymentDetails) {
    try {
      if (typeof amount !== 'number' || typeof paymentDetails !== 'object') {
        throw new Error('Invalid payment details.');
      }
      const result = paymentService.processPayment(amount, paymentDetails);
      this.displayResult(result);
    } catch (error) {
      console.error('Payment processing error:', error);
      this.displayError(error.message);
    }
  }

  // Display the payment result on the payment window
  displayResult(result) {
    this.window.webContents.send('payment-completed', result);
  }

  // Display an error message on the payment window
  displayError(message) {
    this.window.webContents.send('payment-error', message);
  }
}

// Export the PaymentProcessor class
module.exports = PaymentProcessor;
