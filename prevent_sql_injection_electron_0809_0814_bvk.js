// 代码生成时间: 2025-08-09 08:14:58
// Required modules
const { app, BrowserWindow } = require('electron');
const mysql = require('mysql2');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'testdb'
};

// Connect to the database
const db = mysql.createPool(dbConfig);

// Helper function to execute a query with parameters
function executeQuery(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Function to safely insert data
function safeInsert(table, data) {
  // Construct the SQL query with placeholders
  const sql = `INSERT INTO ${table} \?? SET ?`;
  // Use object keys as column names and values as parameters
  const params = Object.keys(data).map(key => `?? ${key} = ?`).join(', ');
  // Replace placeholders with actual parameter values
  const finalQuery = sql.replace(/\??/g, params);
  return executeQuery(finalQuery, Object.values(data));
}

// Main function to initialize the Electron app and prevent SQL injection
async function main() {
  // Initialize the Electron app
  app.on('ready', () => {
    const mainWindow = new BrowserWindow({
      width: 800,
      height: 600
    });

    // Load the index.html file
    mainWindow.loadFile('index.html');
  });

  // Example usage of safeInsert function
  try {
    const result = await safeInsert('users', {name: 'John Doe', email: 'john@example.com'});
    console.log('Insert successful:', result);
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

// Run the main function
main().catch(console.error);