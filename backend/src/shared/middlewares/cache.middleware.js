/**
 * @fileoverview Cache middleware for performance optimization.
 * @module shared/middlewares/cache.middleware
 */

/**
 * Simple In-memory cache for GET requests.
 * @param {number} duration - Cache duration in seconds.
 */
class CacheMiddleware {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Middleware to cache responses.
   * @param {number} duration - Seconds.
   */
  handle(duration) {
    return (req, res, next) => {
      // Only cache GET requests
      if (req.method !== 'GET') {
        return next();
      }

      const key = `__express__${req.originalUrl || req.url}`;
      const cachedResponse = this.cache.get(key);

      if (cachedResponse && cachedResponse.expires > Date.now()) {
        res.set('X-Cache', 'HIT');
        return res.status(200).json(cachedResponse.body);
      }

      // Override res.json to capture the response body
      const originalJson = res.json;
      res.json = (body) => {
        if (res.statusCode === 200) {
          this.cache.set(key, {
            body,
            expires: Date.now() + duration * 1000
          });
        }
        res.json = originalJson;
        return res.json(body);
      };

      res.set('X-Cache', 'MISS');
      next();
    };
  }

  /**
   * Clear cache for a specific pattern (e.g., when a resource is updated).
   * @param {string} pattern 
   */
  clear(pattern) {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

export default new CacheMiddleware();
