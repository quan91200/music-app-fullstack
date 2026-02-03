/**
 * @fileoverview Date formatting utilities with locale awareness
 * @module shared/utils/date.utils
 */

import i18n from '@i18n/i18n.js';

import { LOCALE_MAPPINGS } from '@constants/app.constants.js';

/**
 * Get current language from i18n
 * Maps i18n language codes to Intl locale codes
 * @returns {string} Current locale string
 */
const getCurrentLocale = () => {
  const lang = i18n.language || 'vi';
  return LOCALE_MAPPINGS[lang] || lang;
};

/**
 * Format date to dd-mm-yy format (day-month-year, 2-digit year)
 * @param {Date|string|number} date - Date to format
 * @param {string} locale - Locale string (optional, defaults to current i18n language)
 * @returns {string} Formatted date string
 * @example
 * formatDateDMY(new Date('2024-01-15')) // "15-01-24"
 */
export const formatDateDMY = (date, _locale) => {
  // Note: locale parameter kept for API consistency, but this function
  // always returns dd-mm-yy format regardless of locale
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear().toString().slice(-2);

  return `${day}-${month}-${year}`;
};

/**
 * Format date to mm-dd-yy format (month-day-year, 2-digit year)
 * @param {Date|string|number} date - Date to format
 * @param {string} locale - Locale string (optional, defaults to current i18n language)
 * @returns {string} Formatted date string
 * @example
 * formatDateMDY(new Date('2024-01-15')) // "01-15-24"
 */
export const formatDateMDY = (date, _locale) => {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const year = d.getFullYear().toString().slice(-2);

  return `${month}-${day}-${year}`;
};

/**
 * Format date to "dd, Mmm yyyy" format (e.g., "15, Jan 2024")
 * Uses 3-letter month abbreviation and full 4-digit year
 * @param {Date|string|number} date - Date to format
 * @param {string} locale - Locale string (optional, defaults to current i18n language)
 * @returns {string} Formatted date string
 * @example
 * formatDateLong(new Date('2024-01-15')) // "15, Jan 2024"
 */
export const formatDateLong = (date, locale) => {
  const currentLocale = locale || getCurrentLocale();

  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const day = d.getDate().toString().padStart(2, '0');
  const year = d.getFullYear();

  // Get month abbreviation (3 letters) based on locale
  const monthAbbr = d.toLocaleDateString(currentLocale, { month: 'short' });

  return `${day}, ${monthAbbr} ${year}`;
};

/**
 * Format date using Intl.DateTimeFormat for locale-aware formatting
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @param {string} locale - Locale string (default: 'en-US')
 * @returns {string} Formatted date string
 * @example
 * formatDateIntl(new Date('2024-01-15'), { day: '2-digit', month: '2-digit', year: '2-digit' })
 * // "01/15/24" (for en-US)
 */
export const formatDateIntl = (date, options = {}, locale) => {
  const currentLocale = locale || getCurrentLocale();

  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };

  const formatter = new Intl.DateTimeFormat(currentLocale, { ...defaultOptions, ...options });
  return formatter.format(d);
};

/**
 * Get relative time string (e.g., "2 days ago", "just now")
 * @param {Date|string|number} date - Date to format
 * @param {string} locale - Locale string (optional, defaults to current i18n language)
 * @returns {string} Relative time string
 * @example
 * formatRelativeTime(new Date(Date.now() - 86400000)) // "1 day ago"
 */
export const formatRelativeTime = (date, locale) => {
  const currentLocale = locale || getCurrentLocale();

  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const now = new Date();
  const diffInSeconds = Math.floor((now - d) / 1000);

  const rtf = new Intl.RelativeTimeFormat(currentLocale, { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
  }
};

/**
 * Format duration in seconds to mm:ss or hh:mm:ss
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string
 * @example
 * formatDuration(125) // "2:05"
 * formatDuration(3665) // "1:01:05"
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Parse date string safely
 * @param {string|Date|number} dateString - Date string to parse
 * @returns {Date|null} Parsed Date object or null if invalid
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;

  if (dateString instanceof Date) {
    return isNaN(dateString.getTime()) ? null : dateString;
  }

  const parsed = new Date(dateString);
  return isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * Check if a value is a valid date
 * @param {any} value - Value to check
 * @returns {boolean} True if valid date
 */
export const isValidDate = (value) => {
  if (!value) return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
};

/**
 * Default export with all date utilities
 */
export default {
  formatDateDMY,
  formatDateMDY,
  formatDateLong,
  formatDateIntl,
  formatRelativeTime,
  formatDuration,
  parseDate,
  isValidDate
};
