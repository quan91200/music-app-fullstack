import { create } from 'zustand'

import {
  persist,
  createJSONStorage
} from 'zustand/middleware'

import { supabase } from '@services/supabase'

import {
  syncProfile,
  getProfile,
  updateProfile
} from '@services/auth.service'

/**
 * Auth Store for managing user session and profile
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: true,
      _initialized: false,

      setSession: (session) => set({
        session,
        user: session?.user || null,
        loading: false
      }),

      signOut: async () => {
        try {
          // Attempt to sign out from Supabase
          await supabase.auth.signOut()

          // State will be cleared by the onAuthStateChange listener
          // But we clear it here too for immediate UI update
          set({ user: null, session: null, loading: false })

          // Clear PWA caches
          if ('caches' in window) {
            try {
              const cacheNames = await caches.keys()
              await Promise.all(cacheNames.map(name => caches.delete(name)))
            } catch (_err) { /* ignore */ }
          }
        } catch (error) {
          console.error('Sign out error:', error)
          set({ user: null, session: null })
        }
      },

      initialize: async () => {
        if (get()._initialized) return
        set({ _initialized: true })

        // 1. Initial manual check
        const { data: { session } } = await supabase.auth.getSession()
        let user = session?.user || null

        if (session?.user) {
          try {
            await syncProfile({
              id: session.user.id,
              email: session.user.email,
              fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
              avatarUrl: session.user.user_metadata?.avatar_url || ''
            })

            const profileRes = await getProfile()
            if (profileRes?.success) {
              user = { ...user, ...profileRes.data }
            }
          } catch (error) {
            console.error('Auth sync error:', error)
          }
        }

        set({ session, user, loading: false })

        // 2. Continuous listener
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_OUT') {
            set({ user: null, session: null, loading: false })
            return
          }

          if (session?.user) {
            let updatedUser = session.user

            // Only sync/fetch on major changes to avoid loops
            if (['SIGNED_IN', 'TOKEN_REFRESHED', 'USER_UPDATED'].includes(event)) {
              try {
                await syncProfile({
                  id: session.user.id,
                  email: session.user.email,
                  fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
                  avatarUrl: session.user.user_metadata?.avatar_url || ''
                })

                const profileRes = await getProfile()
                if (profileRes?.success) {
                  updatedUser = { ...updatedUser, ...profileRes.data }
                }
              } catch (_err) { /* ignore */ }
            }

            set({ session, user: updatedUser, loading: false })
          } else {
            set({ session: null, user: null, loading: false })
          }
        })
      },

      updateProfile: async (data) => {
        const response = await updateProfile(data)
        if (response && response.success) {
          // Fetch fresh profile to ensure all derived data is correct
          const profileRes = await getProfile()
          if (profileRes && profileRes.success) {
            const updatedUser = {
              ...get().user,
              ...profileRes.data
            }
            set({ user: updatedUser })
            return profileRes.data
          }
        } else {
          throw new Error(response?.data?.message || 'Failed to update profile')
        }
      }
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ user: state.user, session: state.session }), // Persist only user and session
    }
  )
)
