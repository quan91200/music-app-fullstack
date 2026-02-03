/**
 * @fileoverview Sanitization middleware to clean request body, query, and params.
 * @module shared/middlewares/sanitize.middleware
 */

import Sanitizer from '../utils/Sanitizer.js';

/**
 * Middleware to sanitize all incoming request data.
 * @param {Object} req - Request.
 * @param {Object} res - Response.
 * @param {Function} next - Next middleware.
 */
export const sanitizeRequest = (req, _res, next) => {
  if (req.body) {
    req.body = Sanitizer.sanitize(req.body);
  }

  if (req.query) {
    req.query = Sanitizer.sanitize(req.query);
  }

  if (req.params) {
    req.params = Sanitizer.sanitize(req.params);
  }

  next();
};
