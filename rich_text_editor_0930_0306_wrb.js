// 代码生成时间: 2025-09-30 03:06:31
const { app, BrowserWindow, Menu } = require('electron');
const fs = require('fs');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) return;

// Main application window
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the devtools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the reference
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Preload script for electron security
const preload = `// Preload script content`;

fs.writeFileSync(path.join(__dirname, 'preload.js'), preload);

// Menu setup
const template = [
  // { role: 'appMenu' }
  // ... Other roles including appMenu, windowMenu, editMenu, viewMenu,
  // recentDocuments, window, help, about, etc.
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

/**
 * Load index.html and setup basic functionality.
 */
const indexHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Rich Text Editor</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
    }
    #editor {
      width: 100%;
      height: 500px;
      border: 1px solid #ccc;
    }
  </style>
</head>
<body>
  <h1>Rich Text Editor</h1>
  <div id="editor"></div>
  <script src="https://cdn.ckeditor.com/ckeditor5/36.0.0/classic/ckeditor.js"></script>
  <script>
    ClassicEditor
      .create(document.querySelector('#editor'))
      .then(editor => {
        console.log('Editor is ready to use!');
      })
      .catch(error => {
        console.error(error);
      });
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'index.html'), indexHtml);
