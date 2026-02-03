/**
 * @fileoverview Authentication middleware (Class-based).
 * @module shared/middlewares/auth.middleware
 */

import Logger from '../utils/logger/Logger.js';
import supabase from '../config/SupabaseClient.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';

/**
 * Middleware class for Authorization and Authentication.
 */
class AuthMiddleware {
  /**
   * Verify Supabase JWT Token.
   * @param {Object} req - Request.
   * @param {Object} res - Response.
   * @param {Function} next - Next middleware.
   */
  authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      Logger.debug('🔐 Verifying Supabase token...');
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        Logger.warn(`❌ Auth verify failed: ${error?.message || 'No user'}`);
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: 'Invalid or expired token.'
        });
      }

      req.user = user;
      next();
    } catch (err) {
      Logger.error('Auth Middleware Error:', err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    }
  };
}

const authMiddleware = new AuthMiddleware();
export const authenticate = authMiddleware.authenticate;
export default authMiddleware;
