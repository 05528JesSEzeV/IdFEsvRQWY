// 代码生成时间: 2025-10-05 02:00:22
const { ipcMain, ipcRenderer } = require('electron');

// RPC Service Class
class RpcService {
  /**
   * Initializes the RPC service with a registry of methods.
   * @param {Object} methods - An object containing method names as keys and functions as values.
   */
  constructor(methods) {
    this.methods = methods;
  }

  /**
   * Registers the RPC service with Electron's IPC system.
   */
  register() {
    for (const [key, method] of Object.entries(this.methods)) {
      ipcMain.handle(`rpc:${key}`, async (event, ...args) => {
        try {
          return await method(...args);
        } catch (error) {
          console.error(`Error calling RPC method ${key}:`, error);
          throw error;
        }
      });
    }
  }
}

// Create an instance of the RPC service
const rpcService = new RpcService({
  /**
   * Example RPC method that adds two numbers.
   * @param {number} a - The first number.
   * @param {number} b - The second number.
   * @returns {Promise<number>} The sum of the two numbers.
   */
  add(a, b) {
    return new Promise((resolve, reject) => {
      try {
        resolve(a + b);
      } catch (error) {
        reject(error);
      }
    });
  },
});

// Register the RPC service
rpcService.register();

// Export the RPC service for use in other parts of the application
module.exports = rpcService;