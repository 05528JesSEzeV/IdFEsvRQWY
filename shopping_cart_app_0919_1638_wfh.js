// 代码生成时间: 2025-09-19 16:38:50
const { app, BrowserWindow } = require('electron');

// CartItem class to represent a shopping cart item
class CartItem {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

// ShoppingCart class to manage cart operations
class ShoppingCart {
  constructor() {
    this.items = [];
  }

  // Add an item to the cart
  addItem(item) {
    this.items.push(item);
  }

  // Remove an item from the cart by ID
  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
  }

  // Get the total cost of items in the cart
  getTotalCost() {
    return this.items.reduce((total, item) => total + item.price, 0);
  }
}

// Create a BrowserWindow for the app
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the index.html of the app
  win.loadFile('index.html');

  // Open the DevTools for debugging
  win.webContents.openDevTools();
}

// Check if the app is running as the primary instance
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('ready', createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}

// Event to handle additional instances of the app
app.on('second-instance', (event, commandLine, workingDirectory) => {
  // Focus on the first window if it is minimized or not visible
  if (BrowserWindow.getAllWindows().length) {
    BrowserWindow.getAllWindows()[0].restore();
  }
});

// Export ShoppingCart class for use in renderer process
module.exports = ShoppingCart;