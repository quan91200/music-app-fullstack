import songRoutes from '../features/songs/song.routes.js';
import playlistRoutes from '../features/playlists/playlist.routes.js';
import favoriteRoutes from '../features/favorites/favorite.routes.js';
import authRoutes from '../features/auth/auth.routes.js';
import playerRoutes from '../features/player/player.routes.js';
import paymentRoutes from '../features/payments/payment.routes.js';
import { HTTP_STATUS } from '../shared/constants/index.js';

/**
 * Setup API routes for the express application.
 * @param {express.Application} app 
 */
export const setupRoutes = (app) => {
  app.use('/api/songs', songRoutes);
  app.use('/api/playlists', playlistRoutes);
  app.use('/api/favorites', favoriteRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/player', playerRoutes);
  app.use('/api/payments', paymentRoutes);

  // Health Check
  app.get('/health', (_req, res) => {
    res.status(HTTP_STATUS.OK).json({
      status: 'UP',
      timestamp: new Date().toISOString()
    });
  });
};
