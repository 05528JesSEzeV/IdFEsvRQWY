// 代码生成时间: 2025-10-04 03:09:28
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const { debounce } = require('lodash');

// Function to create the window
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load index.html of the app
  mainWindow.loadFile('index.html');
}

// Electron app ready event
app.whenReady().then(createWindow);

// Event when window is closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Event when app is activated
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Preload script to expose Node.js and Electron APIs
const preload = `<script>
  // Expose Node.js and Electron APIs to the renderer process
  window.nodeAPI = {
    getVirtualScrollListData: async () => {
      // Simulate fetching data from an API or async operation
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(Array.from({ length: 10000 }, (_, index) => ({ id: index, text: `Item ${index}` })));
        }, 500);
      });
    },
  };
</script>`;

// Write the preload script to a file
fs.writeFileSync(path.join(__dirname, 'preload.js'), preload);

// Renderer script for the virtual scroll list
const rendererScript = `
<!DOCTYPE html>
<html>
<head>
  <title>Virtual Scroll List</title>
  <style>
    /* Basic styles for the list and items */
    #scrollContainer {
      height: 100vh;
      overflow: auto;
    }
    .listItem {
      height: 50px;
      display: flex;
      align-items: center;
      padding: 0 10px;
    }
  </style>
</head>
<body>
  <div id='scrollContainer'></div>
  <script>
    // Debounce function to limit the rate of scroll events
    const debouncedScroll = debounce(() => {
      const container = document.getElementById('scrollContainer');
      const start = container.scrollTop;
      const end = start + container.clientHeight;
      const visibleItems = Math.ceil(container.clientWidth / 100); // Assuming each item is 100px wide
      
      window.nodeAPI.getVirtualScrollListData().then(data => {
        const itemsToRender = data.slice(Math.max(0, Math.floor(start / 50)), Math.min(data.length, Math.ceil(end / 50) + visibleItems));
        
        const fragment = document.createDocumentFragment();
        itemsToRender.forEach(item => {
          const div = document.createElement('div');
          div.className = 'listItem';
          div.textContent = item.text;
          fragment.appendChild(div);
        });
        
        const container = document.getElementById('scrollContainer');
        container.innerHTML = '';
        container.appendChild(fragment);
      });
    }, 100);
    
    document.getElementById('scrollContainer').addEventListener('scroll', debouncedScroll);
  </script>
</body>
</html>`;

// Write the renderer script to a file
fs.writeFileSync(path.join(__dirname, 'index.html'), rendererScript);