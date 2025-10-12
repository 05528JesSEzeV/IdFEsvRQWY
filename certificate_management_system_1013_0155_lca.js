// 代码生成时间: 2025-10-13 01:55:28
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Define a Certificate class to manage individual certificates
class Certificate {
  constructor(id, name, fileContent) {
    this.id = id;
    this.name = name;
    this.fileContent = fileContent;
  }

  // Serialize the Certificate object to JSON
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      fileContent: Buffer.from(this.fileContent).toString('base64')
    };
  }

  // Deserialize the Certificate object from JSON
  static fromJSON(json) {
    const fileContent = Buffer.from(json.fileContent, 'base64');
    return new Certificate(json.id, json.name, fileContent);
  }
}

// Helper function to show an error dialog
function showErrorDialog(errorMessage) {
  dialog.showErrorBox('Error', errorMessage);
}

// The main application logic
class CertificateManager {
  constructor() {
    this.certificates = [];
    this.currentCertificate = null;
  }

  // Load certificates from a file
  loadCertificates(filePath) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      this.certificates = data.map(Certificate.fromJSON);
    } catch (error) {
      showErrorDialog('Failed to load certificates: ' + error.message);
    }
  }

  // Save certificates to a file
  saveCertificates(filePath) {
    try {
      const data = this.certificates.map(cert => cert.toJSON());
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      showErrorDialog('Failed to save certificates: ' + error.message);
    }
  }

  // Add a new certificate
  addCertificate(id, name, fileContent) {
    const newCertificate = new Certificate(id, name, fileContent);
    this.certificates.push(newCertificate);
  }

  // Remove a certificate by its ID
  removeCertificate(certificateId) {
    this.certificates = this.certificates.filter(cert => cert.id !== certificateId);
  }

  // Update the current certificate
  updateCurrentCertificate(fileContent) {
    if (this.currentCertificate) {
      this.currentCertificate.fileContent = fileContent;
    } else {
      showErrorDialog('No certificate is currently selected.');
    }
  }

  // Set the current certificate by its ID
  setCurrentCertificate(certificateId) {
    this.currentCertificate = this.certificates.find(cert => cert.id === certificateId);
    if (!this.currentCertificate) {
      showErrorDialog('Certificate not found.');
    }
  }
}

// Electron app setup
class App {
  constructor() {
    this.win = null;
    this.certManager = new CertificateManager();
  }

  createWindow() {
    this.win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      },
    });

    this.win.loadFile('index.html');
  }

  init() {
    app.on('ready', this.createWindow);
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  }
}

const appInstance = new App();
appInstance.init();