import React from 'react'

import { useTranslation } from 'react-i18next'

import {
  Play,
  X,
} from 'lucide-react'

import { usePlayer } from '@hooks/usePlayer'

import Artwork from '@components/Artwork'

/**
 * Queue List Component for Playing View
 */
const QueueView = () => {
  const { t } = useTranslation()
  const {
    queue,
    currentIndex,
    currentSong,
    isPlaying,
    playSong,
    removeFromQueue,
    clearQueue
  } = usePlayer()

  // Calculate "Next Up" - songs after current index
  const nextInQueue = queue.slice(currentIndex + 1)

  // Calculate "Played" - songs before current index (optional, could be added later)

  const handleClearQueue = () => {
    clearQueue(true) // Keep current song
  }

  const handleRemove = (e, song, idx) => {
    e.stopPropagation()
    // The index in the full queue is currentIndex + 1 + idx
    removeFromQueue(song.id, currentIndex + 1 + idx)
  }

  return (
    <div className="pv-queue">
      <div className="pv-queue-section">
        <h3 className="section-title">{t('playing.now_playing')}</h3>
        {currentSong && (
          <div className="pv-queue-item playing">
            <div className="artwork">
              <Artwork
                src={currentSong.coverUrl || currentSong.cover_url}
                alt=""
                className={!currentSong.coverUrl && !currentSong.cover_url ? 'placeholder' : ''}
              />
              <div className="overlay">
                <div className={`playing-bars ${isPlaying ? 'active' : 'paused'}`}>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                </div>
              </div>
            </div>
            <div className="info">
              <div className="song-name">{currentSong.title}</div>
              <div className="artist-name">{currentSong.artist?.name || t('playing.artist_label')}</div>
            </div>
          </div>
        )}
      </div>

      <div className="pv-queue-section next-up">
        <div className="section-header-row">
          <h3 className="section-title">{t('playing.next_up')}</h3>
          {nextInQueue.length > 0 && (
            <button className="clear-btn" onClick={handleClearQueue}>
              {t('common.clear_queue')}
            </button>
          )}
        </div>

        <div className="list">
          {nextInQueue.length > 0 ? (
            nextInQueue.map((song, idx) => (
              <div
                key={`${song.id}-${idx}`}
                className="pv-queue-item"
                onClick={() => playSong(song)}
              >
                <div className="artwork">
                  <Artwork
                    src={song.coverUrl || song.cover_url}
                    alt=""
                    className={!song.coverUrl && !song.cover_url ? 'placeholder' : ''}
                  />
                  <div className="overlay">
                    <Play size={16} fill="white" color="white" />
                  </div>
                </div>
                <div className="info">
                  <div className="song-name">{song.title}</div>
                  <div className="artist-name">{song.artist?.name || t('playing.artist_label')}</div>
                </div>
                <button
                  className="remove-btn"
                  onClick={(e) => handleRemove(e, song, idx)}
                  title={t('common.remove')}
                >
                  <X size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="empty-message">{t('playing.queue_empty')}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default QueueView
