import { BaseController } from '../../core/index.js';
import PlayerService from './player.service.js';
import PlayerValidator from './player.validator.js';
import { SongDTO } from '../../shared/dtos/song.dto.js';

/**
 * Controller class for Player state.
 */
class PlayerController extends BaseController {
  addToHistory = async (req, res, next) => {
    try {
      PlayerValidator.validateHistory(req.body);
      const { songId } = req.body;
      await PlayerService.addToHistory(req.user.id, songId);
      return this.sendSuccess(res, null, 'Added to history.');
    } catch (error) {
      next(error);
    }
  };

  getHistory = async (req, res, next) => {
    try {
      const history = await PlayerService.getHistory(req.user.id);
      const formattedHistory = history.map(item => ({
        playedAt: item.playedAt,
        song: SongDTO.fromModel(item.Song)
      }));
      return this.sendSuccess(res, formattedHistory);
    } catch (error) {
      next(error);
    }
  };

  updateQueue = async (req, res, next) => {
    try {
      const { items } = req.body;
      PlayerValidator.validateQueue(items);
      const queue = await PlayerService.updateQueue(req.user.id, items);
      return this.sendSuccess(res, queue);
    } catch (error) {
      next(error);
    }
  };

  getQueue = async (req, res, next) => {
    try {
      const queue = await PlayerService.getQueue(req.user.id);
      const formattedQueue = queue.map(item => ({
        position: item.position,
        song: SongDTO.fromModel(item.Song)
      }));
      return this.sendSuccess(res, formattedQueue);
    } catch (error) {
      next(error);
    }
  };
}

export default new PlayerController();
