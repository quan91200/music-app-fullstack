/**
 * Payment Constants
 * Configuration for payment providers (PayPal, etc.)
 */

export const PAYPAL_LOCALE_MAP = {
  vi: 'vi_VN',
  en: 'en_US',
  es: 'es_ES',
  ko: 'ko_KR',
  ja: 'ja_JP',
  fr: 'fr_FR',
  de: 'de_DE'
};

export const DEFAULT_PAYPAL_LOCALE = 'vi_VN';

/**
 * Get PayPal options based on current language
 * @param {string} lng - Current language code
 * @returns {Object} PayPal script options
 */
export const getPaypalOptions = (lng) => {
  return {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
    locale: PAYPAL_LOCALE_MAP[lng] || DEFAULT_PAYPAL_LOCALE
  };
};
