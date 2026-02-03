import { BaseController } from '../../core/index.js';
import FavoriteService from './favorite.service.js';
import FavoriteAlbumService from './album.favorite.service.js';
import FavoriteValidator from './favorite.validator.js';
import { SongDTO } from '../../shared/dtos/song.dto.js';

/**
 * Controller class for Favorites.
 */
class FavoriteController extends BaseController {
  toggle = async (req, res, next) => {
    try {
      const { songId } = req.params;
      FavoriteValidator.validateToggle(songId);
      const result = await FavoriteService.toggleFavorite(req.user.id, songId);
      return this.sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  getUserFavorites = async (req, res, next) => {
    try {
      const signedSongs = await FavoriteService.getUserFavorites(req.user.id);
      const formatted = signedSongs.map(song => SongDTO.fromModel(song));
      return this.sendSuccess(res, formatted);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Toggle favorite album.
   */
  toggleAlbum = async (req, res, next) => {
    try {
      const { albumId } = req.params;
      // Validator check could be added here
      const result = await FavoriteAlbumService.toggleFavorite(req.user.id, albumId);
      return this.sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user favorite albums.
   */
  getUserFavoriteAlbums = async (req, res, next) => {
    try {
      const signedAlbums = await FavoriteAlbumService.getUserFavoriteAlbums(req.user.id);
      return this.sendSuccess(res, signedAlbums);
    } catch (error) {
      next(error);
    }
  };
}

export default new FavoriteController();
