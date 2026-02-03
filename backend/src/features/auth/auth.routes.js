/**
 * @fileoverview Auth routes definition (Class-based).
 * @module features/auth/auth.routes
 */

import express from 'express';

import AuthController from './auth.controller.js';

import { authenticate } from '../../shared/middlewares/auth.middleware.js';

import { upload } from '../../shared/middlewares/upload.middleware.js';

/**
 * Routes for Authentication and Profile management.
 */
class AuthRoutes {
  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  /**
   * Initialize all auth related routes.
   */
  setupRoutes() {
    this.router.use(authenticate); // All profile routes are private

    /**
     * @route POST /api/auth/sync
     * @desc Sync Supabase profile to MySQL
     */
    this.router.post('/sync', AuthController.syncProfile);

    /**
     * @route GET /api/auth/me
     * @desc Get current user profile
     */
    this.router.get('/me', AuthController.getProfile);

    /**
     * @route GET /api/auth/profile/:id
     * @desc Get any user profile by ID
     */
    this.router.get('/profile/:id', AuthController.getProfileById);

    /**
     * @route PUT /api/auth/update
     * @desc Update current user profile
     */
    this.router.put('/update', upload.single('avatar'), AuthController.updateProfile);
  }

  /**
   * Get the configured router instance.
   * @returns {express.Router}
   */
  getRouter() {
    return this.router;
  }
}

export default new AuthRoutes().getRouter();
