import { create } from 'zustand'

import {
  getItem,
  setItem,
  removeItem
} from '@services/localStorage.service'

/**
 * UI Store
 * Handles layout states (sidebar, view visibility) with localStorage persistence
 */
const UI_STORAGE_KEY = 'musicApp_uiState'

const getUIInitialState = () => {
  const saved = getItem(UI_STORAGE_KEY)
  return saved || {
    isLibraryCollapsed: false,
    isPlayingViewVisible: true,
    showQueue: false,
    showSongActions: false,
    viewMode: 'default-grid',
    connectionMode: 'standard', // 'standard' | 'offline'
  }
}

const saveUIToStorage = (state) => {
  setItem(UI_STORAGE_KEY, {
    isLibraryCollapsed: state.isLibraryCollapsed,
    isPlayingViewVisible: state.isPlayingViewVisible,
    showQueue: state.showQueue,
    showSongActions: state.showSongActions,
    viewMode: state.viewMode,
    connectionMode: state.connectionMode,
  })
}

export const useUIStore = create((set, get) => {
  const initialState = getUIInitialState()

  return {
    ...initialState,

    toggleLibrary: () => {
      set((state) => ({ isLibraryCollapsed: !state.isLibraryCollapsed }))
      saveUIToStorage(get())
    },

    togglePlayingView: () => {
      set((state) => ({ isPlayingViewVisible: !state.isPlayingViewVisible }))
      saveUIToStorage(get())
    },

    toggleQueue: () => {
      set((state) => ({ showQueue: !state.showQueue }))
      saveUIToStorage(get())
    },

    toggleSongActions: () => {
      set((state) => ({ showSongActions: !state.showSongActions }))
      saveUIToStorage(get())
    },

    setShowQueue: (show) => {
      set({ showQueue: show })
      saveUIToStorage(get())
    },

    setViewMode: (mode) => {
      set({ viewMode: mode })
      saveUIToStorage(get())
    },

    setConnectionMode: (mode) => {
      set({ connectionMode: mode })
      saveUIToStorage(get())
    },

    // Additional methods for direct state setting
    setLibraryCollapsed: (collapsed) => {
      set({ isLibraryCollapsed: collapsed })
      saveUIToStorage(get())
    },

    setPlayingViewVisible: (visible) => {
      set({ isPlayingViewVisible: visible })
      saveUIToStorage(get())
    },

    // Restore state from localStorage
    restoreUIState: () => {
      const saved = getUIInitialState()
      set(saved)
    },

    // Clear localStorage
    clearStoredUIState: () => {
      removeItem(UI_STORAGE_KEY)
    }
  }
})
