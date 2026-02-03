/**
 * @fileoverview Playlist routes definition (Class-based).
 * @module features/playlists/playlist.routes
 */

import express from 'express';
import PlaylistController from './playlist.controller.js';
import { authenticate } from '../../shared/middlewares/auth.middleware.js';
import { upload } from '../../shared/middlewares/upload.middleware.js';

/**
 * Routes for Playlist feature.
 */
class PlaylistRoutes {
  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  /**
   * Initialize all playlist related routes.
   */
  setupRoutes() {
    this.router.use(authenticate);

    /**
     * @route POST /api/playlists
     * @desc Create a new playlist
     */
    this.router.post('/', PlaylistController.create);

    /**
     * @route GET /api/playlists
     * @desc Get all playlists for current user
     */
    this.router.get('/', PlaylistController.getUserPlaylists);
    this.router.get('/:id', PlaylistController.getById);

    /**
     * @route POST /api/playlists/:playlistId/songs/:songId
     * @desc Add a song to a playlist
     */
    this.router.post('/:playlistId/songs/:songId', PlaylistController.addSong);

    /**
     * @route PATCH /api/playlists/:id
     * @desc Update a playlist
     */
    this.router.patch('/:id', upload.single('cover'), PlaylistController.update);
    this.router.put('/:id', upload.single('cover'), PlaylistController.update);

    /**
     * @route DELETE /api/playlists/:id
     * @desc Delete a playlist
     */
    this.router.delete('/:id', PlaylistController.delete);
  }

  /**
   * Get the configured router instance.
   * @returns {express.Router}
   */
  getRouter() {
    return this.router;
  }
}

export default new PlaylistRoutes().getRouter();
