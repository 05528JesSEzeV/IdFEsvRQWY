// 代码生成时间: 2025-08-15 17:22:12
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

/**
 * ConfigManager class to handle configuration file operations.
 */
class ConfigManager {
  #configFilePath;

  constructor(configFilePath) {
    this.#configFilePath = configFilePath;
  }

  /**
   * Loads the configuration file.
   * @returns {Promise<Object>} The configuration object.
   */
  async loadConfig() {
    try {
      const fileContent = await fs.promises.readFile(this.#configFilePath, 'utf8');
      return JSON.parse(fileContent);
    } catch (error) {
      throw new Error(`Failed to load configuration: ${error.message}`);
    }
  }

  /**
   * Saves the configuration file.
   * @param {Object} config - The configuration object to save.
   * @returns {Promise<void>}
   */
  async saveConfig(config) {
    try {
      const configJson = JSON.stringify(config, null, 2);
      await fs.promises.writeFile(this.#configFilePath, configJson);
    } catch (error) {
      throw new Error(`Failed to save configuration: ${error.message}`);
    }
  }

  /**
   * Opens the configuration file for editing.
   * @returns {Promise<void>}
   */
  async openConfig() {
    try {
      const win = new BrowserWindow({ width: 800, height: 600 });
      win.loadFile(path.join(__dirname, 'config_editor.html'));
      await win.webContents.send('config-data', await this.loadConfig());
    } catch (error) {
      dialog.showErrorBox('Error', `Failed to open configuration editor: ${error.message}`);
    }
  }
}

// Initialize the application
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