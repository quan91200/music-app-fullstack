/**
 * @fileoverview Multer configuration for handling file uploads (Class-based).
 * @module shared/middlewares/upload.middleware
 */

import multer from 'multer';

import Logger from '../utils/logger/Logger.js';

/**
 * Middleware class for File Uploads.
 */
class UploadMiddleware {
  constructor() {
    this.storage = multer.memoryStorage();
  }

  /**
   * Filter for audio and image files.
   */
  fileFilter = (req, file, cb) => {
    Logger.debug(`[Multer] Processing file: ${file.fieldname} (${file.mimetype})`);

    if (file.fieldname === 'audio') {
      if (file.mimetype.startsWith('audio/')) {
        cb(null, true);
      } else {
        Logger.warn(`[Multer] Rejected audio file: ${file.mimetype}`);
        cb(new Error('Only audio files are allowed for the audio field.'), false);
      }
    } else if (file.fieldname === 'cover' || file.fieldname === 'avatar') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        Logger.warn(`[Multer] Rejected image file: ${file.mimetype}`);
        cb(new Error(`Only image files are allowed for the ${file.fieldname} field.`), false);
      }
    } else {
      Logger.warn(`[Multer] Unexpected field: ${file.fieldname}`);
      cb(new Error('Unexpected field.'), false);
    }
  };

  /**
   * Get the configured multer instance.
   */
  getUpload() {
    return multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
      }
    });
  }
}

export const upload = new UploadMiddleware().getUpload();
