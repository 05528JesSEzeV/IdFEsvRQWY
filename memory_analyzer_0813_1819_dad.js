// 代码生成时间: 2025-08-13 18:19:05
// memory_analyzer.js
// This Electron app provides a simple memory usage analysis functionality.

const { app, BrowserWindow } = require('electron');
const os = require('os');
const pidusage = require('pidusage');

class MemoryAnalyzer {
    constructor() {
        this.win = null;
    }

    // Initialize the BrowserWindow and load the index.html file
    init() {
        this.createWindow();
    }

    // Create the main BrowserWindow
    createWindow() {
        this.win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });

        // Load index.html of the current app
        this.win.loadFile('index.html');

        // Open DevTools for easier debugging
        this.win.webContents.openDevTools();

        // Handle window closed event
        this.win.on('closed', () => {
            this.win = null;
        });
    }

    // Get the memory usage of the current process
    getMemoryUsage() {
        return new Promise((resolve, reject) => {
            pidusage(process.pid, (err, stats) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(stats);
                }
            });
        });
    }

    // Log memory usage details
    logMemoryUsage() {
        this.getMemoryUsage().then(stats => {
            console.log(`Memory Usage: ${stats.memory} MB`);
        }).catch(err => {
            console.error('Error fetching memory usage:', err);
        });
    }
}

// Create an instance of MemoryAnalyzer when app is ready
app.whenReady().then(() => {
    new MemoryAnalyzer().init();
});

// Handle window close event
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    });// Ensure the app stays open if running on macOS

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        new MemoryAnalyzer().init();
    }});
