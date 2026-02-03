/**
 * @fileoverview Main application entry point for CobhamMusic Backend (Refactored).
 * @module app
 */

import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './shared/config/database.js';
import { setupAssociations } from './shared/config/associations.js';

// Setup Imports
import { setupMiddlewares } from './setup/middleware.setup.js';
import { setupRoutes } from './setup/routes.setup.js';
import { setupErrorHandling } from './setup/error.setup.js';
import Logger from './shared/utils/logger/Logger.js';

dotenv.config();

/**
 * Main Server Class
 */
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 5000;

    // De-coupled setup
    setupMiddlewares(this.app);
    setupRoutes(this.app);
    setupErrorHandling(this.app);
  }

  /**
   * Start the application
   */
  async start() {
    try {
      await connectDB();
      setupAssociations();

      // Database sync (Disabled in prod, rely on migrations)
      if (process.env.NODE_ENV === 'development') {
        const db = (await import('./shared/config/database.js')).default;
        await db.sync();
        Logger.info('🔄 Database synced successfully (Development Mode).');
      }

      this.app.listen(this.port, () => {
        Logger.info(`🚀 CobhamMusic Server running on port ${this.port}`);
      });
    } catch (error) {
      Logger.error('❌ Failed to start server:', error.message || error);
      if (error.stack) {
        Logger.error(error.stack);
      }
      process.exit(1);
    }
  }
}

const server = new Server();
server.start();

export default server.app;
