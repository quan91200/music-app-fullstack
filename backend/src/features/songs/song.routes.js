/**
 * @fileoverview Song routes definition (Class-based).
 * @module features/songs/song.routes
 */

import express from 'express';
import SongController from './song.controller.js';
import AlbumController from './album.controller.js';
import { upload } from '../../shared/middlewares/upload.middleware.js';
import { authenticate } from '../../shared/middlewares/auth.middleware.js';
import cache from '../../shared/middlewares/cache.middleware.js';
import Logger from '../../shared/utils/logger/Logger.js';

/**
 * Routes for Song and Album features.
 */
class SongRoutes {
  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  /**
   * Initialize all song and album related routes.
   */
  setupRoutes() {
    // --- Album (Folder) routes for Dashboard ---
    this.router.get('/albums', cache.handle(60), AlbumController.getAll);

    // User albums needs to be BEFORE generic ID route
    this.router.get('/albums/me', authenticate, cache.handle(30), AlbumController.getArtistAlbums);

    this.router.get('/albums/:id', cache.handle(60), AlbumController.getById);

    this.router.post('/albums', authenticate, (req, res, next) => {
      cache.clear('/api/songs/albums');
      next();
    }, AlbumController.create);

    this.router.delete('/albums/:id', authenticate, (req, res, next) => {
      cache.clear('/api/songs/albums');
      next();
    }, AlbumController.delete);

    this.router.patch('/albums/:id', authenticate, (req, res, next) => {
      cache.clear('/api/songs/albums');
      next();
    }, upload.single('cover'), AlbumController.update);

    this.router.put('/albums/:id', authenticate, (req, res, next) => {
      cache.clear('/api/songs/albums');
      next();
    }, upload.single('cover'), AlbumController.update);

    // --- Song routes ---
    /**
     * @route POST /api/songs/upload
     * @desc Upload a new song with metadata and files
     */
    this.router.post(
      '/upload',
      (req, res, next) => {
        const msg = `[Upload Route Hit] Headers: Content-Length=${req.headers['content-length']}`;
        console.log(msg);
        Logger.info(msg);
        next();
      },
      authenticate,
      (req, res, next) => { cache.clear('/api/songs'); next(); },
      upload.fields([
        { name: 'audio', maxCount: 1 },
        { name: 'cover', maxCount: 1 }
      ]),
      SongController.upload
    );

    /**
     * @route GET /api/songs/me
     * @desc Get all songs by the current artist
     */
    this.router.get('/me', authenticate, cache.handle(30), SongController.getMySongs);

    /**
     * @route DELETE /api/songs/:id
     * @desc Delete a song
     */
    this.router.delete('/:id', authenticate, (req, res, next) => { cache.clear('/api/songs'); next(); }, SongController.delete);

    /**
     * @route PATCH /api/songs/:id
     * @desc Update a song
     */
    this.router.patch(
      '/:id',
      authenticate,
      (req, res, next) => { cache.clear('/api/songs'); next(); },
      upload.fields([{ name: 'cover', maxCount: 1 }]),
      SongController.update
    );

    /**
     * @route GET /api/songs
     * @desc Get all songs
     */
    this.router.get('/', cache.handle(120), SongController.getAll);

    /**
     * @route GET /api/songs/:id
     * @desc Get a single song
     */
    this.router.get('/:id', cache.handle(60), SongController.getById);

    /**
     * @route GET /api/songs/artist-profile/:id
     * @desc Get artist profile for a specific user ID
     */
    this.router.get('/artist-profile/:id', cache.handle(60), SongController.getArtistProfile);

    /**
     * @route GET /api/songs/artist/:id
     * @desc Get all songs by artist ID
     */
    this.router.get('/artist/:id', cache.handle(30), SongController.getSongsByArtist);

    /**
     * @route GET /api/songs/albums/artist/:id
     * @desc Get all albums by artist ID
     */
    this.router.get('/albums/artist/:id', cache.handle(30), AlbumController.getAlbumsByArtist);
  }

  /**
   * Get the configured router instance.
   * @returns {express.Router}
   */
  getRouter() {
    return this.router;
  }
}

export default new SongRoutes().getRouter();
