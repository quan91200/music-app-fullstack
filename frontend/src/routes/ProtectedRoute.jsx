import { Navigate, Outlet } from 'react-router-dom'

import { useAuthStore } from '@/store/authStore'

import { SkeletonLayout } from '@/components/skeletons'

/**
 * Protected Route Component
 * Wraps routes that require authentication.
 * Shows SkeletonLayout while checking auth state.
 */
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore()

  if (loading) {
    return <SkeletonLayout />
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  // If used as a wrapper for Routes
  return children ? children : <Outlet />
}
