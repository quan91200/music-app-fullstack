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
      loading: true, // Start as true to avoid "redirect flicker" during boot

      setSession: (session) => set({
        session,
        user: session?.user || null,
        loading: false
      }),

      signOut: async () => {
        try {
          // Clear state immediately to provide instant feedback
          set({ user: null, session: null, loading: false })

          // Clear local storage managed by persist middleware
          localStorage.removeItem('auth-storage')

          // Attempt to sign out from Supabase (don't let it block local cleanup)
          supabase.auth.signOut().catch(err => console.error('Supabase signout error:', err))

          // Clear PWA caches if available
          if ('caches' in window) {
            try {
              const cacheNames = await caches.keys()
              await Promise.all(
                cacheNames.map(name => caches.delete(name))
              )
            } catch (cacheErr) {
              console.error('Cache clear error:', cacheErr)
            }
          }
        } catch (error) {
          console.error('Sign out error:', error)
          // Ensure state is cleared even on error
          set({ user: null, session: null })
        }
      },

      initialize: async () => {
        // Background validation - don't block UI if we have data
        const { data: { session } } = await supabase.auth.getSession()

        let user = session?.user || null

        if (session?.user) {
          try {
            // 1. Sync to ensure user exists (backend won't overwrite profile fields now)
            await syncProfile({
              id: session.user.id,
              email: session.user.email,
              fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
              avatarUrl: session.user.user_metadata?.avatar_url || ''
            })

            // 2. Fetch fresh profile from DB
            const profileRes = await getProfile()

            if (profileRes?.success) {
              user = { ...user, ...profileRes.data }
            }
          } catch (error) {
            console.error('Auth initialization error:', error)
          }
        } else {
          // No session from Supabase, clear state if it was persisted but invalid
          if (get().session) {
            set({ user: null, session: null })
          }
        }

        set({ session, user, loading: false })

        supabase.auth.onAuthStateChange(async (event, session) => {
          let updatedUser = session?.user || null

          if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION') && session?.user) {
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
            } catch (err) {
              //
            }
          } else if (event === 'SIGNED_OUT') {
            set({ user: null, session: null })
          }

          set({ session, user: updatedUser, loading: false })
        })
      },

      updateProfile: async (data) => {
        try {
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
        } catch (error) {
          throw error
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
