/**
 * @fileoverview Player routes definition (Class-based).
 * @module features/player/player.routes
 */

import express from 'express';
import PlayerController from './player.controller.js';
import { authenticate } from '../../shared/middlewares/auth.middleware.js';

/**
 * Routes for Player state (Queue and History).
 */
class PlayerRoutes {
  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  /**
   * Initialize all player related routes.
   */
  setupRoutes() {
    this.router.use(authenticate);

    /**
     * @route POST /api/player/history
     * @desc Add a song to user history
     */
    this.router.post('/history', PlayerController.addToHistory);

    /**
     * @route GET /api/player/history
     * @desc Get user history
     */
    this.router.get('/history', PlayerController.getHistory);

    /**
     * @route POST /api/player/queue
     * @desc Update user queue
     */
    this.router.post('/queue', PlayerController.updateQueue);

    /**
     * @route GET /api/player/queue
     * @desc Get user current queue
     */
    this.router.get('/queue', PlayerController.getQueue);
  }

  /**
   * Get the configured router instance.
   * @returns {express.Router}
   */
  getRouter() {
    return this.router;
  }
}

export default new PlayerRoutes().getRouter();
