/**
 * @fileoverview Favorite Album Service.
 * @module features/favorites/album.favorite.service
 */

import { BaseService } from '../../core/index.js';
import FavoriteAlbumRepository from './album.favorite.repository.js';
import SupabaseStorage from '../../shared/utils/SupabaseStorage.js';

/**
 * Service class for Favorite Album management.
 */
class FavoriteAlbumService extends BaseService {
  constructor() {
    super(FavoriteAlbumRepository);
  }

  /**
   * Toggle favorite status for an album.
   * @param {string} userId
   * @param {string} albumId
   * @returns {Promise<Object>}
   */
  async toggleFavorite(userId, albumId) {
    const existing = await FavoriteAlbumRepository.findOne({ where: { userId, albumId } });

    if (existing) {
      await existing.destroy();
      return { isFavorite: false, message: 'Removed from favorites.' };
    }

    await FavoriteAlbumRepository.create({ userId, albumId });
    return { isFavorite: true, message: 'Added to favorites.' };
  }

  /**
   * Get user's favorite albums.
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async getUserFavoriteAlbums(userId) {
    const favorites = await FavoriteAlbumRepository.findByUserWithAlbums(userId);

    const signedAlbums = await Promise.all(favorites.map(async (fav) => {
      const plainFav = fav.get({ plain: true });
      const albumData = plainFav.Album || plainFav.album;

      if (albumData) {
        // Sign cover URL for album
        albumData.coverUrl = await SupabaseStorage.getSignedUrl(
          albumData.coverUrl,
          process.env.SUPABASE_BUCKET_ARTWORK
        );
        return albumData;
      }
      return null;
    }));

    return signedAlbums.filter(a => a !== null);
  }
}

export default new FavoriteAlbumService();
