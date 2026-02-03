import api from './api'

/**
 * Sync Supabase user with local MySQL database via Backend
 * @param {Object} userData - User data from Supabase
 * @returns {Promise<Object>} Response data
 */
export const syncProfile = async (userData) => {
  const response = await api.post('auth/sync', userData)
  return response.data
}

/**
 * Get current profile from local MySQL
 * @returns {Promise<Object>} Response data
 */
export const getProfile = async () => {
  const response = await api.get('auth/me')
  return response.data
}

/**
 * Update profile
 * @param {Object} data - Profile data to update
 * @returns {Promise<Object>} Response data
 */
export const updateProfile = async (data) => {
  let payload = data
  // Explicitly init empty headers - Axios will set Content-Type: multipart/form-data with boundary
  const headers = {}

  const formData = new FormData()
  if (data.fullName !== undefined) formData.append('fullName', data.fullName)

  if (data.avatar === null) {
    formData.append('removeAvatar', true)
  } else if (data.avatar) {
    formData.append('avatar', data.avatar)
  }

  payload = formData

  const response = await api.put('auth/update', payload, { headers })
  return response.data
}
