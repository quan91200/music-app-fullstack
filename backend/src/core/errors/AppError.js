/**
 * @fileoverview Custom Application Error class.
 * @module core/errors/AppError
 */

import { HTTP_STATUS } from '../../shared/constants/index.js';

/**
 * Enhanced Error class for operational errors.
 * @extends Error
 */
class AppError extends Error {
  /**
   * @param {string} message - Error message.
   * @param {number} statusCode - HTTP status code.
   * @param {boolean} isOperational - Whether error is operational (trusted).
   */
  constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Factory for 404 errors.
   */
  static notFound(message = 'Resource not found') {
    return new AppError(message, HTTP_STATUS.NOT_FOUND);
  }

  /**
   * Factory for 400 errors.
   */
  static badRequest(message = 'Bad request') {
    return new AppError(message, HTTP_STATUS.BAD_REQUEST);
  }

  /**
   * Factory for 401 errors.
   */
  static unauthorized(message = 'Unauthorized') {
    return new AppError(message, HTTP_STATUS.UNAUTHORIZED);
  }

  /**
   * Factory for 403 errors.
   */
  static forbidden(message = 'Forbidden') {
    return new AppError(message, HTTP_STATUS.FORBIDDEN);
  }
}

export default AppError;
