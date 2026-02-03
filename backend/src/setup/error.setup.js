import { HTTP_STATUS } from '../shared/constants/index.js';
import Logger from '../shared/utils/logger/Logger.js';

/**
 * Setup error handling middlewares for the express application.
 * @param {express.Application} app 
 */
export const setupErrorHandling = (app) => {
  // 404 Handler
  app.use((req, res) => {
    Logger.warn(`🔍 [404] Not Found: ${req.method} ${req.url}`);
    res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: `Path not found: ${req.url}`
    });
  });

  // Global Error Handler
  app.use((err, req, res, next) => {
    let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message = err.message || 'Internal Server Error';
    let status = err.status || 'error';

    if (err.name === 'MulterError') {
      statusCode = HTTP_STATUS.BAD_REQUEST;
      if (err.code === 'LIMIT_FILE_SIZE') message = 'File is too large (max 50MB).';
    }

    Logger.error(message, {
      name: err.name,
      statusCode,
      path: req.url,
      method: req.method,
      stack: err.stack
    });

    res.status(statusCode).json({
      success: false,
      status,
      message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  });
};
