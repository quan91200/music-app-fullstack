/**
 * @fileoverview User Repository.
 * @module features/auth/user.repository
 */

import { BaseRepository } from '../../core/index.js';
import User from './user.model.js';

/**
 * Repository for User model.
 */
class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  /**
   * Find user by email.
   */
  async findByEmail(email) {
    return await this.findOne({ where: { email } });
  }
}

export default new UserRepository();
