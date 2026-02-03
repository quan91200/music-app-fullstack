/**
 * @fileoverview Winston Logger configuration (Class-based).
 * @module shared/utils/logger/Logger
 */

import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

/**
 * Custom log format for console.
 */
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

/**
 * Advanced Logger class using Winston.
 */
class Logger {
  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');

    // Define transports
    const transports = [
      // Console logging
      new winston.transports.Console({
        level: 'debug',
        format: combine(
          colorize(),
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          consoleFormat
        ),
      }),

      // Daily Rotate File - Combined Logs
      new winston.transports.DailyRotateFile({
        filename: path.join(this.logDir, 'combined-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        level: 'debug',
        format: combine(timestamp(), json()),
      }),

      // Daily Rotate File - Error Logs
      new winston.transports.DailyRotateFile({
        filename: path.join(this.logDir, 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '30d',
        level: 'error',
        format: combine(timestamp(), errors({ stack: true }), json()),
      }),
    ];

    /**
     * Winston Logger instance
     */
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: combine(
        errors({ stack: true }),
        timestamp(),
        json()
      ),
      defaultMeta: { service: 'cobham-music-backend' },
      transports,
      exitOnError: false, // Do not exit on handled exceptions
    });
  }

  /**
   * Log info level.
   * @param {string} message 
   * @param {Object} meta 
   */
  info(message, meta = {}) {
    this.logger.info(message, meta);
  }

  /**
   * Log error level.
   * @param {string|Error} message 
   * @param {Object} meta 
   */
  error(message, meta = {}) {
    this.logger.error(message, meta);
  }

  /**
   * Log warn level.
   * @param {string} message 
   * @param {Object} meta 
   */
  warn(message, meta = {}) {
    this.logger.warn(message, meta);
  }

  /**
   * Log debug level.
   * @param {string} message 
   * @param {Object} meta 
   */
  debug(message, meta = {}) {
    this.logger.debug(message, meta);
  }

  /**
   * Stream for Morgan integration.
   */
  get stream() {
    return {
      write: (message) => this.logger.info(message.trim()),
    };
  }
}

export default new Logger();
