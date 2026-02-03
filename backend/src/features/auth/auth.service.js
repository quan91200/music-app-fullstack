/**
 * @fileoverview Auth Service handling user profile logic.
 * @module features/auth/auth.service
 */

import { BaseService, AppError } from '../../core/index.js';
import UserRepository from './user.repository.js';
import SupabaseStorage from '../../shared/utils/SupabaseStorage.js';
import { cacheService } from '../../shared/services/cache.service.js';

import Subscription from '../payments/models/subscription.model.js';

/**
 * Service class for Authentication/User profile management.
 */
class AuthService extends BaseService {
  constructor() {
    super(UserRepository);
  }

  /**
   * Sync a user profile between Supabase and MySQL.
   * @param {Object} userData - The user data to sync.
   * @returns {Promise<Object>} - The synced user model and a boolean indicating if it was created.
   * @throws {AppError} - If email conflict occurs.
   */
  async syncProfile(userData) {
    const { id, email, fullName, avatarUrl } = userData;

    // Check for email conflict
    const existingUserWithEmail = await UserRepository.findByEmail(email);
    if (existingUserWithEmail && existingUserWithEmail.id !== id) {
      throw AppError.badRequest('This email is already linked to another account.');
    }

    const [user, created] = await UserRepository.findOrCreate({
      where: { id },
      defaults: {
        email,
        fullName,
        avatarUrl
      }
    });

    if (!created) {
      await user.update({ email });
    }

    // Invalidate cache on sync
    cacheService.del(`profile:${id}`);

    // console.log('Synced Profile User:', user.toJSON()); // Debug Log
    return { user, created };
  }

  /**
   * Get user profile by ID with subscription status.
   * @param {string} userId - User UUID.
   * @returns {Promise<Object>}
   */
  async getProfile(userId) {
    const cacheKey = `profile:${userId}`;
    const cachedProfile = cacheService.get(cacheKey);

    if (cachedProfile) {
      return cachedProfile;
    }

    // Fetch user
    const user = await this.getById(userId);
    if (!user) return null;

    // Fetch active subscription
    const subscription = await Subscription.findOne({
      where: {
        userId,
        status: 'active'
      },
      order: [['endDate', 'DESC']]
    });

    const signedUser = await SupabaseStorage.signUserUrls(user);

    // Normalize data
    const profileData = signedUser;
    profileData.subscription = subscription ? (subscription.get ? subscription.get({ plain: true }) : subscription) : null;

    // Cache the result for 5 minutes
    cacheService.set(cacheKey, profileData, 300);

    return profileData;
  }

  /**
   * Update user profile.
   * @param {string} userId - User UUID.
   * @param {Object} data - Update data (fullName).
   * @param {Object} avatarFile - Optional avatar file from multer.
   * @returns {Promise<Object>} - Updated user model.
   */
  async updateProfile(userId, data, avatarFile) {
    const user = await this.getById(userId);
    const { fullName, removeAvatar } = data;

    if (fullName) user.fullName = fullName;

    const bucket = process.env.SUPABASE_BUCKET_ARTWORK;

    // Handle File Update or Removal
    if (avatarFile || removeAvatar === 'true' || removeAvatar === true) {
      // 1. Delete old file if exists
      if (user.avatarUrl) {
        try {
          await SupabaseStorage.delete(user.avatarUrl, bucket);
        } catch (_delError) {
          // Log but continue
        }
      }

      if (avatarFile) {
        // 2. Upload new file
        const fileName = `avatars/${userId}-${Date.now()}`;
        const uploadPath = await SupabaseStorage.upload(
          avatarFile.buffer,
          fileName,
          avatarFile.mimetype,
          bucket
        );
        user.avatarUrl = uploadPath;
      } else {
        // 3. Clear from DB
        user.avatarUrl = null;
      }
    }

    await user.save();

    // Invalidate cache on update
    cacheService.del(`profile:${userId}`);

    return await SupabaseStorage.signUserUrls(user);
  }
}

export default new AuthService();
