// 代码生成时间: 2025-09-10 18:47:31
 * It takes JSON input and outputs a formatted JSON string.
 */

// Import necessary Electron modules
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

// Create a class to handle JSON formatting
class JsonFormatter {
  /**
   * Formats the given JSON data.
   * @param {string} jsonData - The JSON data to be formatted.
   * @returns {string} - The formatted JSON string.
   */
  formatJson(jsonData) {
    try {
      // Parse the JSON data
      const parsedJson = JSON.parse(jsonData);
      // Format the JSON data
      return JSON.stringify(parsedJson, null, 2);
    } catch (error) {
      throw new Error('Invalid JSON data provided.');
    }
  }
}

// Create a function to create the Electron window
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow).then(() => {
  // Initialize the JSON formatter class
  const jsonFormatter = new JsonFormatter();

  // Function to handle JSON formatting
  const handleJsonFormatting = (jsonData) => {
    try {
      // Format the JSON data
      const formattedJson = jsonFormatter.formatJson(jsonData);
      // Send the formatted JSON back to the renderer process
      mainWindow.webContents.send('formatted-json', formattedJson);
    } catch (error) {
      // Handle errors
      mainWindow.webContents.send('formatting-error', error.message);
    }
  };
});

// Define the main process message event listener
app.on('main-process-message', (event, message) => {
  if (message.type === 'format-json') {
    // Handle JSON formatting request from renderer process
    handleJsonFormatting(message.data);
  }
});

// All of the Node.js APIs are available in the preload script.
// It has the same sandbox as a Chrome extension.
// Place any Electron-specific logic here.
const preload = `
  // This file is loaded by the browser window when the app starts.
  // It handles communication between the renderer process and the main process.
  
  window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('format-json').addEventListener('click', () => {
      const jsonData = document.getElementById('json-input').value;
      // Send the JSON data to the main process for formatting
      window.api.send('format-json', jsonData);
    });
  });

  // Receive formatted JSON from the main process
  window.api.receive('formatted-json', (event, formattedJson) => {
    document.getElementById('json-output').value = formattedJson;
  });
  
  // Handle formatting errors
  window.api.receive('formatting-error', (event, errorMessage) => {
    document.getElementById('error-message').textContent = errorMessage;
  });
  
  // Expose the send and receive functions to the renderer process
  window.api.send = (channel, data) => { ipcRenderer.send(channel, data); };
  window.api.receive = (channel, callback) => { ipcRenderer.on(channel, callback); };
`;

module.exports = preload;
