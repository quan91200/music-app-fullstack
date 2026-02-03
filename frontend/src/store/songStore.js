import { create } from 'zustand'

import api from '@services/api'

/**
 * Song Store
 * Manages song list, fetching, and search logic
 */
export const useSongStore = create((set, get) => ({
  songs: [],
  mySongs: [],
  myAlbums: [],
  allAlbums: [],
  isLoading: false,
  error: null,

  /**
   * Fetch all albums
   */
  fetchAllAlbums: async () => {
    try {
      const response = await api.get('songs/albums')
      if (response.data.success) {
        set({ allAlbums: response.data.data })
      }
    } catch (err) {
      throw err
    }
  },

  /**
   * Fetch all songs from the backend
   */
  fetchSongs: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get('songs')
      if (response.data.success) {
        set({ songs: response.data.data })
      }
    } catch (err) {
      set({ error: err.message || 'Failed to load songs.' })
    } finally {
      set({ isLoading: false })
    }
  },

  /**
   * Fetch only songs owned by the current user
   */
  fetchMySongs: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get('songs/me')
      if (response.data.success) {
        set({ mySongs: response.data.data })
      }
    } catch (err) {
      set({ error: err.message || 'Failed to load your songs.' })
    } finally {
      set({ isLoading: false })
    }
  },

  /**
   * Delete a song
   */
  deleteSong: async (songId) => {
    try {
      const response = await api.delete(`songs/${songId}`)
      if (response.data.success) {
        set((state) => ({
          mySongs: state.mySongs.filter(s => s.id !== songId),
          songs: state.songs.filter(s => s.id !== songId)
        }))
        return true
      }
      return false
    } catch (err) {
      throw err
    }
  },

  /**
   * Update a song
   */
  updateSong: async (songId, data) => {
    try {
      let payload = data
      const hasFile = data.coverFile instanceof File
      const wantsRemove = data.coverFile === null

      if (hasFile || wantsRemove) {
        const formData = new FormData()
        Object.keys(data).forEach(key => {
          if (key === 'coverFile') {
            if (hasFile) {
              formData.append('cover', data[key])
            } else if (wantsRemove) {
              formData.append('removeCover', true)
            }
          } else if (data[key] !== undefined && data[key] !== null) {
            formData.append(key, data[key])
          }
        })
        payload = formData
      }

      const response = await api.patch(`songs/${songId}`, payload)
      if (response.data.success) {
        const updatedSong = response.data.data
        set((state) => ({
          mySongs: state.mySongs.map(s => s.id === songId ? updatedSong : s),
          songs: state.songs.map(s => s.id === songId ? updatedSong : s)
        }))
        return true
      }
      return false
    } catch (err) {
      throw err
    }
  },

  /**
   * Album (Artist Folders) Actions
   */
  fetchMyAlbums: async () => {
    try {
      const response = await api.get('songs/albums/me')
      if (response.data.success) {
        set({ myAlbums: response.data.data })
      }
    } catch (err) {
      throw err
    }
  },

  createAlbum: async (data) => {
    try {
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

      const response = await api.post('songs/albums', payload)
      if (response.data.success) {
        set((state) => ({ myAlbums: [response.data.data, ...state.myAlbums] }))
        return true
      }
    } catch (err) {
      throw err
    }
  },

  deleteAlbum: async (albumId) => {
    try {
      const response = await api.delete(`songs/albums/${albumId}`)
      if (response.data.success) {
        set((state) => ({
          myAlbums: state.myAlbums.filter(a => a.id !== albumId),
          allAlbums: state.allAlbums.filter(a => a.id !== albumId)
        }))
        return true
      }
    } catch (err) {
      throw err
    }
  },

  updateAlbum: async (albumId, data) => {
    try {
      let payload = data
      const hasFile = data.coverFile instanceof File
      const wantsRemove = data.coverFile === null

      if (hasFile || wantsRemove || (data && typeof data === 'object' && !(data instanceof FormData))) {
        const formData = new FormData()
        Object.keys(data).forEach(key => {
          if (key === 'coverFile') {
            if (hasFile) {
              formData.append('cover', data[key])
            } else if (wantsRemove) {
              formData.append('removeCover', true)
            }
          } else if (data[key] !== undefined && data[key] !== null) {
            formData.append(key, data[key])
          }
        })
        payload = formData
      }

      const response = await api.patch(`songs/albums/${albumId}`, payload)

      if (response.data && response.data.success) {
        const updated = response.data.data
        set((state) => ({
          myAlbums: state.myAlbums.map(a => (a.id === albumId ? updated : a)),
          allAlbums: state.allAlbums.map(a => (a.id === albumId ? updated : a)),
        }))
        return updated
      } else {
        throw new Error(response.data?.message || 'Failed to update album')
      }
    } catch (err) {
      throw err
    }
  },

  /**
   * Refresh song list
   */
  refreshSongs: async () => {
    await get().fetchSongs()
    await get().fetchMySongs()
    await get().fetchMyAlbums()
    await get().fetchAllAlbums()
  }
}))
