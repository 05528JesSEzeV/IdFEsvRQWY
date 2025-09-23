// 代码生成时间: 2025-09-24 01:07:35
const { app, BrowserWindow } = require('electron');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Function to create main application window
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // Load the main HTML file of the app
  win.loadFile('index.html');
}

// Function to encrypt a password using AES-256-CBC
function encryptPassword(password, secretKey) {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let encrypted = cipher.update(password);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
}

// Function to decrypt a password using AES-256-CBC
function decryptPassword(encryptedPassword, secretKey) {
  try {
    const [iv, encryptedText] = encryptedPassword.split(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(Buffer.from(encryptedText, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
}

// Function to handle the encryption in the preload script
function handleEncryption(event, password, secretKey) {
  try {
    const encrypted = encryptPassword(password, secretKey);
    event.sender.send('encryption-success', encrypted);
  } catch (error) {
    event.sender.send('encryption-error', error.message);
  }
}

// Function to handle the decryption in the preload script
function handleDecryption(event, encryptedPassword, secretKey) {
  try {
    const decrypted = decryptPassword(encryptedPassword, secretKey);
    event.sender.send('decryption-success', decrypted);
  } catch (error) {
    event.sender.send('decryption-error', error.message);
  }
}

// Function to set up IPC listeners
function setupIPCListeners() {
  ipcMain.on('encrypt-password', (event, password, secretKey) => {
    handleEncryption(event, password, secretKey);
  });

  ipcMain.on('decrypt-password', (event, encryptedPassword, secretKey) => {
    handleDecryption(event, encryptedPassword, secretKey);
  });
}

// Function to initialize the application
function initializeApp() {
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

  setupIPCListeners();
}

// Main entry point of the application
initializeApp();