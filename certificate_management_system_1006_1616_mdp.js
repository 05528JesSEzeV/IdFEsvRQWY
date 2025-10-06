// 代码生成时间: 2025-10-06 16:16:56
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

// Define the main window
let mainWindow;

// Function to create the main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // Load the index.html of the app
  mainWindow.loadFile('index.html');

  // Open the dev tools for debugging
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle adding a certificate
ipcMain.on('add-certificate', (event, certificateDetails) => {
  try {
    // Define the path for certificates storage
    const certificatesPath = path.join(app.getPath('documents'), 'Certificates');
    fs.mkdirSync(certificatesPath, { recursive: true });

    // Define the file path for the new certificate
    const certificateFilePath = path.join(certificatesPath, `${certificateDetails.name}.json`);

    // Write the certificate details to the file
    fs.writeFileSync(certificateFilePath, JSON.stringify(certificateDetails, null, 2));

    // Send a success message back to the renderer process
    event.reply('add-certificate-response', { success: true, message: 'Certificate added successfully.' });
  } catch (error) {
    // Send an error message back to the renderer process
    event.reply('add-certificate-response', { success: false, message: error.message });
  }
});

// Handle removing a certificate
ipcMain.on('remove-certificate', (event, certificateName) => {
  try {
    // Define the path for the certificate to be removed
    const certificateFilePath = path.join(app.getPath('documents'), 'Certificates', `${certificateName}.json`);

    // Remove the file from the file system
    fs.unlinkSync(certificateFilePath);

    // Send a success message back to the renderer process
    event.reply('remove-certificate-response', { success: true, message: 'Certificate removed successfully.' });
  } catch (error) {
    // Send an error message back to the renderer process
    event.reply('remove-certificate-response', { success: false, message: error.message });
  }
});

// Handle viewing certificate
ipcMain.on('view-certificate', (event, certificateName) => {
  try {
    // Define the path for the certificate to be viewed
    const certificateFilePath = path.join(app.getPath('documents'), 'Certificates', `${certificateName}.json`);

    // Read the certificate details from the file
    const certificateDetails = fs.readFileSync(certificateFilePath, 'utf8');

    // Send the certificate details back to the renderer process
    event.reply('view-certificate-response', { success: true, certificateDetails });
  } catch (error) {
    // Send an error message back to the renderer process
    event.reply('view-certificate-response', { success: false, message: error.message });
  }
});

// Preload script to expose Node.js and Electron functionality to the renderer process
const preloadScript = `
  // Preload script for Certificate Management System
  // This script acts as an intermediary between the renderer process and the main process.

  const { contextBridge, ipcRenderer } = require('electron');

  // Expose addCertificate function to the renderer process
  contextBridge.exposeInMainWorld('electronAPI', {
    addCertificate: (certificateDetails) => ipcRenderer.send('add-certificate', certificateDetails),
    removeCertificate: (certificateName) => ipcRenderer.send('remove-certificate', certificateName),
    viewCertificate: (certificateName) => ipcRenderer.send('view-certificate', certificateName),
  });
`;

// Write the preload script to a file
fs.writeFileSync(path.join(__dirname, 'preload.js'), preloadScript);
