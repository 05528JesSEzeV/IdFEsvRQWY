// 代码生成时间: 2025-09-07 16:51:19
 * with the following features:
 * - Add inventory items
 * - Remove inventory items
 * - Update inventory items
 * - Display inventory items
 *
 * @author Your Name
 * @version 1.0
 */

// Importing necessary Electron modules
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { EventEmitter } = require('events');

// Inventory data is stored in a JSON file
const inventoryFilePath = path.join(app.getPath('userData'), 'inventory.json');

// InventoryManager class to handle inventory operations
class InventoryManager extends EventEmitter {
    constructor(file) {
        super();
        this.file = file;
        this.loadData();
    }

    // Load data from the JSON file
    loadData() {
        try {
            const data = fs.readFileSync(this.file, 'utf8');
            this.items = JSON.parse(data);
        } catch (error) {
            this.items = {};
            console.error('Failed to load inventory data:', error);
        }
    }

    // Save data to the JSON file
    saveData() {
        try {
            fs.writeFileSync(this.file, JSON.stringify(this.items, null, 2), 'utf8');
        } catch (error) {
            console.error('Failed to save inventory data:', error);
        }
    }

    // Add an item to the inventory
    addItem(id, item) {
        if (!id || !item) {
            throw new Error('Item ID and item details are required.');
        }
        if (this.items[id]) {
            throw new Error('Item with this ID already exists.');
        }
        this.items[id] = item;
        this.saveData();
        this.emit('itemAdded', id, item);
    }

    // Remove an item from the inventory
    removeItem(id) {
        if (!this.items[id]) {
            throw new Error('Item with this ID does not exist.');
        }
        delete this.items[id];
        this.saveData();
        this.emit('itemRemoved', id);
    }

    // Update an item in the inventory
    updateItem(id, item) {
        if (!id || !item) {
            throw new Error('Item ID and item details are required.');
        }
        if (!this.items[id]) {
            throw new Error('Item with this ID does not exist.');
        }
        this.items[id] = item;
        this.saveData();
        this.emit('itemUpdated', id, item);
    }

    // Get all inventory items
    getItems() {
        return this.items;
    }
}

// Electron application setup
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

app.whenReady().then(createWindow);

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

// Instantiate the InventoryManager with the inventory file path
const inventoryManager = new InventoryManager(inventoryFilePath);

// Export the InventoryManager for use in other parts of the application
module.exports = inventoryManager;
