/**
 * LocalStorage Service
 * Handles localStorage operations with error handling and fallbacks
 */

/**
 * Set item in localStorage with error handling
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export const setItem = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value)
    localStorage.setItem(key, serializedValue)
    return true
  } catch (_error) {
    return false
  }
}

/**
 * Get item from localStorage with error handling
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Stored value or default
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    if (item === null) return defaultValue
    return JSON.parse(item)
  } catch (_error) {
    return defaultValue
  }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (_error) {
    return false
  }
}

/**
 * Clear all localStorage items
 * @returns {boolean} Success status
 */
export const clear = () => {
  try {
    localStorage.clear()
    return true
  } catch (_error) {
    return false
  }
}

/**
 * Check if localStorage is available
 * @returns {boolean} Availability status
 */
export const isAvailable = () => {
  try {
    const test = '__localStorage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}
