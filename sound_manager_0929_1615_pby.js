// 代码生成时间: 2025-09-29 16:15:27
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { dialog } = require('@electron/remote');

// SoundManager class
class SoundManager {
    constructor() {
        this.sounds = {};
    }

    // Load a sound file
    loadSound(filename) {
        try {
            this.sounds[filename] = new Audio(path.join(__dirname, filename));
        } catch (error) {
            console.error('Error loading sound:', error);
        }
    }

    // Play a sound
    playSound(filename) {
        if (this.sounds[filename]) {
            this.sounds[filename].play();
        } else {
            console.error('Sound file not found:', filename);
        }
    }

    // Stop a sound
    stopSound(filename) {
        if (this.sounds[filename]) {
            this.sounds[filename].pause();
            this.sounds[filename].currentTime = 0;
        } else {
            console.error('Sound file not found:', filename);
        }
    }
}

// Create a SoundManager instance
const soundManager = new SoundManager();

// Set up IPC listeners
ipcMain.on('load-sound', (event, filename) => {
    soundManager.loadSound(filename);
    event.reply('sound-loaded', { filename });
});

ipcMain.on('play-sound', (event, filename) => {
    soundManager.playSound(filename);
    event.reply('sound-played', { filename });
});

ipcMain.on('stop-sound', (event, filename) => {
    soundManager.stopSound(filename);
    event.reply('sound-stopped', { filename });
});

// Create a simple UI for the Sound Manager
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: false,
        },
    });

    win.loadFile('index.html');
    win.on('closed', () => {
        win = null;
    });
};

// Handle creating/removing windows
app.on('ready', createWindow);
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

// Preload script for Electron
const preloadScript = 'const { contextBridge, ipcRenderer } = require('electron');' +
    'contextBridge.exposeInMainWorld(' +
    '    "soundManager",' +
    '    {' +
    '        loadSound: () => ipcRenderer.send("load-sound"),' +
    '        playSound: () => ipcRenderer.send("play-sound"),' +
    '        stopSound: () => ipcRenderer.send("stop-sound")' +
    '    });';

// Write the preload script to a file
fs.writeFile('preload.js', preloadScript, (err) => {
    if (err) {
        console.error('Error writing preload script:', err);
    } else {
        console.log('Preload script written successfully');
    }
});