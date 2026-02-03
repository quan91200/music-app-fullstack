/**
 * @fileoverview Base Controller for HTTP response abstraction.
 * @module core/controllers/BaseController
 */

import { HTTP_STATUS } from '../../shared/constants/index.js';

/**
 * Base Controller class.
 */
class BaseController {
  /**
   * Send success response.
   */
  sendSuccess(res, data, message = 'Success', statusCode = HTTP_STATUS.OK) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  /**
   * Send error response (usually handled by global error handler, but available here).
   */
  sendError(res, message = 'Error', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    return res.status(statusCode).json({
      success: false,
      message
    });
  }

  /**
   * Send created response.
   */
  sendCreated(res, data, message = 'Created successfully') {
    return this.sendSuccess(res, data, message, HTTP_STATUS.CREATED);
  }
}

export default BaseController;
