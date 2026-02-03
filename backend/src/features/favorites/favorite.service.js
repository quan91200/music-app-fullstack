/**
 * @fileoverview Favorite Service handling favorite business logic.
 * @module features/favorites/favorite.service
 */

import { BaseService } from '../../core/index.js';
import FavoriteRepository from './favorite.repository.js';
import SupabaseStorage from '../../shared/utils/SupabaseStorage.js';

/**
 * Service class for Favorite management.
 */
class FavoriteService extends BaseService {
  constructor() {
    super(FavoriteRepository);
  }

  /**
   * Toggle favorite status for a song.
   * @param {string} userId 
   * @param {string} songId 
   * @returns {Promise<Object>} - Status and message.
   */
  async toggleFavorite(userId, songId) {
    const existing = await FavoriteRepository.findOne({ where: { userId, songId } });

    if (existing) {
      await existing.destroy();
      return { isFavorite: false, message: 'Removed from favorites.' };
    }

    await FavoriteRepository.create({ userId, songId });
    return { isFavorite: true, message: 'Added to favorites.' };
  }

  /**
   * Get all favorite songs for a user.
   * @param {string} userId 
   * @returns {Promise<Array>}
   */
  async getUserFavorites(userId) {
    const favorites = await FavoriteRepository.findByUserWithSongs(userId);

    const signedSongs = await Promise.all(favorites.map(async (fav) => {
      const plainFav = fav.get({ plain: true });
      const songData = plainFav.Song || plainFav.song; // Handle potential casing differences

      if (songData) {
        return await SupabaseStorage.signSongUrls(songData);
      }
      return null;
    }));

    return signedSongs.filter(song => song !== null);
  }
}

export default new FavoriteService();
