/**
 * @fileoverview Centralized Caching Service using In-Memory Cache.
 * Designed to be easily swappable with Redis in the future.
 * @module shared/services/cache.service
 */

import NodeCache from 'node-cache';

class CacheService {
  constructor() {
    // Standard TTL: 5 minutes, Check period: 2 minutes
    this.cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });
    console.log('✅ CacheService Initialized (In-Memory)');
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {any} - Cached value or undefined
   */
  get(key) {
    return this.cache.get(key);
  }

  /**
   * Set value in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to store
   * @param {number} [ttl] - Time to live in seconds (optional)
   * @returns {boolean} - true on success
   */
  set(key, value, ttl) {
    return this.cache.set(key, value, ttl);
  }

  /**
   * Delete value from cache
   * @param {string} key - Cache key
   * @returns {number} - Number of deleted entries
   */
  del(key) {
    return this.cache.del(key);
  }

  /**
   * Flush all data from cache
   */
  flush() {
    this.cache.flushAll();
  }

  /**
   * Get cache stats
   * @returns {Object}
   */
  getStats() {
    return this.cache.getStats();
  }
}

export const cacheService = new CacheService();
export default cacheService;
