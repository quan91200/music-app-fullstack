import React, {
  useEffect
} from 'react'

import {
  Heart,
  Play
} from 'lucide-react'

import { useTranslation } from 'react-i18next'

import { useFavoriteStore } from '@store/favoriteStore'
import { usePlayer } from '@hooks/usePlayer'

import SongListCard from '@components/SongListCard'
import SongListHeader from '@components/SongListHeader'

import { DEFAULT_SONG_LIST_HEADER_ORDER } from '@constants/app.constants'

const LikedSongsPage = () => {
  const { t } = useTranslation()

  const {
    favorites,
    fetchFavorites,
    isLoading
  } = useFavoriteStore()

  const { playSong } = usePlayer()

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  const handlePlayAll = () => {
    if (favorites.length > 0) {
      playSong(favorites[0], favorites)
    }
  }

  if (isLoading && favorites.length === 0) {
    return <div className="loading-state">{t('common.loading_songs')}</div>
  }

  return (
    <div
      className="collection-page liked-songs-view"
      style={{ '--header-color': '#7f1d1d' }}
    >
      <header className="page-header">
        <div className="header-content">
          <div className="artwork-wrapper liked">
            <Heart
              size={64}
              fill="white"
              color="white"
            />
          </div>
          <div className="text-content">
            <span className="type">{t('common.playlist')}</span>
            <h1>{t('sidebar.liked_songs')}</h1>
            <div className="meta">
              <span className="owner">{t('common.you')}</span>
              <span className="dot">•</span>
              <span className="songs-count">
                {t('common.songs_count', { count: favorites.length })}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="page-actions">
        {favorites.length > 0 && (
          <button
            className="play-btn primary"
            onClick={handlePlayAll}
          >
            <Play
              fill="black"
            />
          </button>
        )}
      </div>

      <div className="songs-container">
        {favorites.length > 0 ? (
          <>
            <SongListHeader headers={DEFAULT_SONG_LIST_HEADER_ORDER} />
            <div className="song-list">
              {favorites.map((song, index) => (
                <SongListCard
                  key={song.id}
                  song={song}
                  index={index + 1}
                  showArtist={true}
                  showAlbum={true}
                  showDateAdded={true}
                  showDuration={true}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state-songs">
            <h2>{t('playing.choose_song')}</h2>
            <p>{t('common.no_liked_songs')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LikedSongsPage
