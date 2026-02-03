import React from 'react'
import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

// Layouts
import MainLayout from '@/containers/layout/MainLayout'

// Components
import { ProtectedRoute } from '@/routes/ProtectedRoute'

// Pages
import AuthPage from '@/pages/AuthPage'
import HomeView from '@/pages/HomeView'
import UploadPage from '@/pages/UploadPage'
import ArtistDashboard from '@/pages/ArtistDashboard'
import PlaylistPage from '@/pages/PlaylistPage'
import AlbumPage from '@/pages/AlbumPage'
import LikedSongsPage from '@/pages/LikedSongsPage'
import ProfilePage from '@/pages/ProfilePage'
import ArtistProfilePage from '@/pages/ArtistProfilePage'
import SettingsPage from '@/pages/SettingsPage'
import ManageSessionPage from '@/pages/ManageSessionPage'
import LanguagePage from '@/pages/LanguagePage'
import PremiumPage from '@/pages/PremiumPage'
import SearchPage from '@/pages/SearchPage'
import GuestPage from '@/pages/GuestPage'

/**
 * App Routes Configuration
 * Centralizes all route definitions.
 */
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/welcome" element={<GuestPage />} />

      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<HomeView />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="dashboard" element={<ArtistDashboard />} />
        <Route path="playlist/:id" element={<PlaylistPage />} />
        <Route path="album/:id" element={<AlbumPage />} />
        <Route path="artist/:id" element={<ArtistProfilePage />} />
        <Route path="library" element={<LikedSongsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="settings/sessions" element={<ManageSessionPage />} />
        <Route path="settings/language" element={<LanguagePage />} />
        <Route path="settings/premium" element={<PremiumPage />} />
        <Route path="search" element={<SearchPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
