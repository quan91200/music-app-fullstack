/**
 * @fileoverview Favorite routes definition (Class-based).
 * @module features/favorites/favorite.routes
 */

import express from 'express';
import FavoriteController from './favorite.controller.js';
import { authenticate } from '../../shared/middlewares/auth.middleware.js';

/**
 * Routes for Favorite songs management.
 */
class FavoriteRoutes {
  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  /**
   * Initialize all favorite related routes.
   */
  setupRoutes() {
    this.router.use(authenticate);

    /**
     * @route POST /api/favorites/albums/:albumId
     * @desc Toggle favorite album
     */
    this.router.post('/albums/:albumId', FavoriteController.toggleAlbum);

    /**
     * @route GET /api/favorites/albums
     * @desc Get user's favorite albums
     */
    this.router.get('/albums', FavoriteController.getUserFavoriteAlbums);

    /**
     * @route POST /api/favorites/:songId
     * @desc Toggle favorite status
     */
    this.router.post('/:songId', FavoriteController.toggle);

    /**
     * @route GET /api/favorites
     * @desc Get user's favorite songs
     */
    this.router.get('/', FavoriteController.getUserFavorites);
  }

  /**
   * Get the configured router instance.
   * @returns {express.Router}
   */
  getRouter() {
    return this.router;
  }
}

export default new FavoriteRoutes().getRouter();
