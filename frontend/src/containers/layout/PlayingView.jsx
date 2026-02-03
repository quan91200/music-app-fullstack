import React from 'react'

import { useTranslation } from 'react-i18next'

import { useUIStore } from '@store/appStore'
import { useFavoriteStore } from '@store/favoriteStore'

import { usePlayer } from '@hooks/usePlayer'

import { formatDuration } from '@utils/date.utils'

import {
  Shuffle,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Repeat,
  Repeat1,
  Monitor,
  ListMusic
} from 'lucide-react'

import {
  ArtworkDisplay,
  FavoriteButton,
  SongInfo,
  ArtistSection,
  PlayingViewHeader,
  EmptyPlayingView,
  QueueView,
  SongActions
} from '@components/playing'
import MobileOverlay from '@components/common/MobileOverlay'

/**
 * Enhanced Playing View component with Queue & Actions support
 */
const PlayingView = () => {
  const { t } = useTranslation()

  const {
    togglePlayingView,
    showQueue,
    toggleQueue,
    showSongActions,
    toggleSongActions
  } = useUIStore()

  const {
    currentSong,
    isPlaying,
    progress,
    currentTime,
    duration,
    repeatMode,
    isShuffle,
    toggle,
    next,
    prev,
    seek,
    toggleShuffle,
    cycleRepeat
  } = usePlayer()

  const { isFavorite } = useFavoriteStore()

  // Empty state component
  if (!currentSong) {
    return (
      <EmptyPlayingView
        onClose={togglePlayingView}
        message={t('playing.choose_song')}
      />
    )
  }

  const isLiked = isFavorite(currentSong.id)

  const handleAction = (actionId) => {
    // Close overlay after action
    toggleSongActions()

    // Custom handling for "Go to queue"
    if (actionId === 'queue') {
      toggleQueue()
    }
  }

  return (
    <div className={`pv-container ${showQueue ? 'overlay-active' : ''}`}>
      <PlayingViewHeader
        title={t('playing.now_playing')}
        onClose={togglePlayingView}
        onMore={toggleSongActions}
        showClose={true}
      />

      <div className="pv-scroll">
        {showQueue ? (
          <QueueView />
        ) : (
          <>
            {/* Artwork Section */}
            <div className="pv-artwork">
              <ArtworkDisplay
                coverUrl={currentSong.coverUrl}
                title={currentSong.title}
                size={64}
              />
            </div>

            {/* Song Info with Favorite Button */}
            <div className="pv-song-info">
              <SongInfo
                title={currentSong.title}
                artist={currentSong.artist?.name || t('playing.unknown_artist')}
                className="meta-text"
              />
              <FavoriteButton
                songId={currentSong.id}
                active={isLiked}
                size={24}
              />
            </div>

            {/* Mobile Progress Bar */}
            <div className="pv-mobile-progress">
              <input
                type="range"
                className="unit-slider"
                style={{ '--progress': `${progress}%` }}
                min="0"
                max={duration || 0}
                value={currentTime || 0}
                onChange={(e) => seek(parseFloat(e.target.value))}
              />
              <div className="time-info">
                <span>{formatDuration(currentTime)}</span>
                <span>{formatDuration(duration)}</span>
              </div>
            </div>

            {/* Mobile Playback Controls */}
            <div className="pv-mobile-controls">
              <Shuffle
                size={28}
                className={`unit-btn ${isShuffle ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleShuffle()
                }}
              />
              <SkipBack
                size={34}
                className="unit-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  prev()
                }}
              />
              <div
                className="play-pause-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  toggle()
                }}
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
              </div>
              <SkipForward
                size={34}
                className="unit-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  next()
                }}
              />
              <div
                className="repeat-btn-wrapper"
                onClick={(e) => {
                  e.stopPropagation()
                  cycleRepeat()
                }}
              >
                {repeatMode === 'once' ? (
                  <Repeat1
                    size={28}
                    className="unit-btn active"
                  />
                ) : (
                  <Repeat
                    size={28}
                    className={`unit-btn ${repeatMode !== 'none' ? 'active' : ''}`}
                  />
                )}
              </div>
            </div>

            {/* Mobile Bottom Actions */}
            <div className="pv-mobile-actions">
              <button className="unit-btn">
                <Monitor size={20} />
              </button>
              <button
                className="unit-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleQueue()
                }}
              >
                <ListMusic
                  size={20}
                  color={showQueue ? '#6366f1' : '#fff'}
                />
              </button>
            </div>

            {/* Artist Section (Visible on desktop by default, hidden on mobile) */}
            <ArtistSection
              artist={currentSong.artist}
            />
          </>
        )}
      </div>

      {/* Mobile Queue Slide-up */}
      <MobileOverlay
        isOpen={showQueue}
        onClose={toggleQueue}
        title={t('playing.queue')}
        height="75vh"
      >
        <QueueView />
      </MobileOverlay>

      {/* Mobile Actions More Menu Slide-up */}
      <MobileOverlay
        isOpen={showSongActions}
        onClose={toggleSongActions}
        height="auto" // Adjust to content
      >
        <SongActions
          song={currentSong}
          onAction={handleAction}
        />
      </MobileOverlay>
    </div>
  )
}

export default PlayingView
