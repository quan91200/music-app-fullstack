/**
 * @fileoverview Auth Controller for user profile management.
 * @module features/auth/auth.controller
 */

import { BaseController } from '../../core/index.js';

import AuthService from './auth.service.js';

import AuthValidator from './auth.validator.js';

import { UserDTO } from '../../shared/dtos/auth.dto.js';

/**
 * Controller class for Authentication.
 */
class AuthController extends BaseController {
  /**
   * Sync Supabase user with local MySQL database.
   * @param {Object} req - Express request.
   * @param {Object} res - Express response.
   * @param {Function} next - Express next middleware.
   */
  syncProfile = async (req, res, next) => {
    try {
      AuthValidator.validateSync(req.body);
      const { id, email, fullName, avatarUrl } = req.body;

      // Security check: only sync own profile
      if (req.user.id !== id) {
        return this.sendError(res, 'Cannot sync profile for another user.', 403);
      }

      const { user, created } = await AuthService.syncProfile({ id, email, fullName, avatarUrl });

      return this.sendSuccess(
        res,
        UserDTO.fromModel(user),
        created ? 'Profile created successfully.' : 'Profile synced successfully.'
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get current user profile.
   * @param {Object} req - Express request.
   * @param {Object} res - Express response.
   * @param {Function} next - Express next middleware.
   */
  getProfile = async (req, res, next) => {
    try {
      const user = await AuthService.getProfile(req.user.id);
      return this.sendSuccess(res, UserDTO.fromModel(user));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get any user profile by ID.
   * @param {Object} req - Express request.
   * @param {Object} res - Express response.
   * @param {Function} next - Express next middleware.
   */
  getProfileById = async (req, res, next) => {
    try {
      const user = await AuthService.getProfile(req.params.id);
      return this.sendSuccess(res, UserDTO.fromModel(user));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update current user profile.
   * @param {Object} req - Express request.
   * @param {Object} res - Express response.
   * @param {Function} next - Express next middleware.
   */
  updateProfile = async (req, res, next) => {
    try {
      const user = await AuthService.updateProfile(req.user.id, req.body, req.file);
      return this.sendSuccess(res, UserDTO.fromModel(user), 'Profile updated successfully.');
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();
