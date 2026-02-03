/**
 * @fileoverview Sanitizer utility to prevent XSS and clean inputs.
 * @module shared/utils/Sanitizer
 */

/**
 * Utility class for data sanitization.
 */
class Sanitizer {
  /**
   * Escape HTML special characters to prevent XSS.
   * @param {string} str - String to escape.
   * @returns {string} - Escaped string.
   */
  escapeHTML(str) {
    if (typeof str !== 'string') return str;

    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      "/": '&#x2F;',
    };

    const reg = /[&<>"'/]/ig;
    return str.replace(reg, (match) => map[match]);
  }

  /**
   * Recursively sanitize an object or array.
   * @param {any} data - Data to sanitize.
   * @returns {any} - Sanitized data.
   */
  sanitize(data) {
    if (!data) return data;

    if (typeof data === 'string') {
      return this.escapeHTML(data.trim());
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitize(item));
    }

    if (typeof data === 'object') {
      const sanitizedObj = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          sanitizedObj[key] = this.sanitize(data[key]);
        }
      }
      return sanitizedObj;
    }

    return data;
  }
}

export default new Sanitizer();
