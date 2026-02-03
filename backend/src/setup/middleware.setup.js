import morgan from 'morgan';
import Logger from '../shared/utils/logger/Logger.js';
import { sanitizeRequest } from '../shared/middlewares/sanitize.middleware.js';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import express from 'express';

/**
 * Setup global middlewares for the express application.
 * @param {express.Application} app 
 */
export const setupMiddlewares = (app) => {
  // Request Logging for Development (Moved to Top)
  app.use((req, res, next) => {
    if (req.url !== '/health') {
      const msg = `🌍 [Global Hit] ${req.method} ${req.url} (Time: ${Date.now()})`;
      console.log(msg); // Force console
      Logger.debug(msg);
    }
    next();
  });

  app.use(helmet());
  app.use(compression());
  app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use(sanitizeRequest);

  // Use Winston for Morgan logging
  app.use(morgan('combined', { stream: Logger.stream }));
};
