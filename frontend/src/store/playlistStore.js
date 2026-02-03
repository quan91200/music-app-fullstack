import { create } from 'zustand'

import api from '@services/api'

/**
 * Playlist Store
 * Managed user playlists (folders for Your Library)
 */
export const usePlaylistStore = create((set) => ({
  playlists: [],
  isLoading: false,
  error: null,

  fetchPlaylists: async () => {
    set({ isLoading: true })
    try {
      const response = await api.get('playlists')
      if (response.data.success) {
        set({ playlists: response.data.data })
      }
    } catch (err) {
      set({ error: err.message })
    } finally {
      set({ isLoading: false })
    }
  },

  createPlaylist: async (data) => {
    let payload = data
    const hasFile = data.coverFile instanceof File

    if (hasFile) {
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          if (key === 'coverFile') {
            formData.append('cover', data[key])
          } else {
            formData.append(key, data[key])
          }
        }
      })
      payload = formData
    }

    const response = await api.post('playlists', payload)
    if (response.data.success) {
      set((state) => ({ playlists: [response.data.data, ...state.playlists] }))
      return response.data.data
    }
  },

  updatePlaylist: async (id, data) => {
    let payload = data
    let headers = {}

    const hasFile = data.coverFile instanceof File
    const isRemovingCover = data.coverFile === null

    if (hasFile || isRemovingCover || (data && typeof data === 'object' && !(data instanceof FormData))) {
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        if (key === 'coverFile') {
          if (data[key] instanceof File) {
            formData.append('cover', data[key])
          } else if (data[key] === null) {
            formData.append('removeCover', true)
          }
        } else if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key])
        }
      })
      payload = formData
    }

    const response = await api.patch(`playlists/${id}`, payload, { headers })

    if (response.data && response.data.success) {
      const updated = response.data.data
      set((state) => ({
        playlists: state.playlists.map(p => (p.id === id ? updated : p))
      }))
      return updated
    } else {
      throw new Error(response.data?.message || 'Failed to update playlist')
    }
  },

  deletePlaylist: async (id) => {
    const response = await api.delete(`playlists/${id}`)
    if (response.data.success) {
      set((state) => ({
        playlists: state.playlists.filter(p => p.id !== id)
      }))
      return true
    }
  },
}))
