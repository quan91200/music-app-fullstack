import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useNavigate } from 'react-router-dom'

import { useSongStore } from '@store/songStore'
import { useAuthStore } from '@store/authStore'
import { usePlaylistStore } from '@store/playlistStore'

import SongGridCard from '@components/SongGridCard'
import SongListCard from '@components/SongListCard'
import {
  SkeletonText,
  SkeletonSongCard
} from '@components/skeletons'

const HomeView = () => {
  const { t } = useTranslation()
  const { songs, allAlbums, fetchSongs, fetchAllAlbums, isLoading: isSongsLoading } = useSongStore()
  const { playlists, fetchPlaylists, isLoading: isPlaylistsLoading } = usePlaylistStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const isLoading = isSongsLoading || isPlaylistsLoading

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t('home.greeting.morning')
    if (hour < 18) return t('home.greeting.afternoon')
    return t('home.greeting.evening')
  }

  useEffect(() => {
    fetchSongs()
    fetchAllAlbums()
    fetchPlaylists()
  }, [fetchSongs, fetchAllAlbums, fetchPlaylists])

  // Show skeletons ONLY while loading
  if (isLoading) {
    return (
      <div className="home-content home-view">
        <header className="home-header">
          <SkeletonText variant="rounded" width={250} height={40} sx={{ mb: 2 }} />
        </header>

        <section className="home-section">
          <div className="section-header">
            <SkeletonText variant="rounded" width={180} height={32} />
          </div>
          <div className="grid-container">
            {[1, 2, 3, 4].map(i => <SkeletonSongCard key={i} />)}
          </div>
        </section>

        <section className="home-section">
          <div className="section-header">
            <SkeletonText variant="rounded" width={180} height={32} />
          </div>
          <div className="song-list-container">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton-song-list-item">
                <div className="skeleton-thumb" />
                <div className="skeleton-info">
                  <div className="skeleton-title" />
                  <div className="skeleton-artist" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="home-content home-view">
      <header className="home-header">
        <h1>{getGreeting()}{user?.fullName && `, ${user.fullName}`}</h1>
      </header>

      {/* Albums Section */}
      {allAlbums.length > 0 && (
        <section className="home-section">
          <div className="section-header">
            <h2>{t('home.featured_albums')}</h2>
            <button className="see-all">{t('common.see_all')}</button>
          </div>
          <div className="grid-container">
            {allAlbums.slice(0, 4).map((album) => (
              <SongGridCard
                key={album.id}
                song={album}
                albumMode={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* Playlists Section */}
      {playlists.length > 0 && (
        <section className="home-section">
          <div className="section-header">
            <h2>{t('home.featured_playlists')}</h2>
            <button className="see-all">{t('common.see_all')}</button>
          </div>
          <div className="grid-container">
            {playlists.slice(0, 4).map((playlist) => (
              <SongGridCard
                key={playlist.id}
                song={playlist}
                playlistMode={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* Songs Section */}
      <section className="home-section">
        <div className="section-header">
          <h2>{t('home.recently_played')}</h2>
          <button className="see-all">{t('common.see_all')}</button>
        </div>
        <div className="song-list-container">
          {songs.length > 0 ? (
            songs.map((song, index) => (
              <SongListCard
                key={song.id}
                song={song}
                index={index + 1}
              />
            ))
          ) : (
            <div className="empty-home-state">
              <p>{t('home.empty_library')}</p>
              <button
                onClick={() => navigate('/upload')}
                className="primary-action-btn"
              >
                {t('home.upload_first')}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default HomeView
