import { create } from 'zustand'
import api from '@services/api'

/**
 * Favorite Store
 * Manages liked songs and albums logic
 */
export const useFavoriteStore = create((set, get) => ({
  favorites: [],
  favoriteAlbums: [],
  isLoading: false,

  fetchFavorites: async () => {
    set({ isLoading: true })
    try {
      const [songsRes, albumsRes] = await Promise.all([
        api.get('favorites'),
        api.get('favorites/albums')
      ])

      if (songsRes.data.success) {
        set({ favorites: songsRes.data.data })
      }
      if (albumsRes.data.success) {
        set({ favoriteAlbums: albumsRes.data.data })
      }
    } catch (err) {
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  clearFavorites: () => set({ favorites: [], favoriteAlbums: [] }),

  toggleFavorite: async (songId) => {
    try {
      const response = await api.post(`favorites/${songId}`)
      if (response.data.success) {
        await get().fetchFavorites()
        return response.data.data.isFavorite
      }
    } catch (err) {
      throw err
    }
  },

  toggleFavoriteAlbum: async (albumId) => {
    try {
      const response = await api.post(`favorites/albums/${albumId}`)
      if (response.data.success) {
        await get().fetchFavorites()
        return response.data.data.isFavorite
      }
    } catch (err) {
      throw err
    }
  },

  isFavorite: (songId) => {
    const { favorites } = get()
    return favorites.some(song => song.id === songId)
  },

  isFavoriteAlbum: (albumId) => {
    const { favoriteAlbums } = get()
    return favoriteAlbums.some(album => album.id === albumId)
  }
}))
