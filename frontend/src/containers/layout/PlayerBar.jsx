import React from 'react'

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume2,
  Maximize2,
  Repeat1,
  ListMusic,
  VolumeX,
  Volume1,
  Minimize2
} from 'lucide-react'

import { useUIStore } from '@store/appStore'
import { usePlayer } from '@hooks/usePlayer'

import Artwork from '@components/Artwork'

/**
 * Premium Player Bar Component
 */
const PlayerBar = () => {
  const {
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    progress,
    repeatMode,
    isShuffle,
    toggle,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
    cycleRepeat,
    toggleShuffle
  } = usePlayer()

  const {
    isPlayingViewVisible,
    togglePlayingView,
    setPlayingViewVisible,
    showQueue,
    toggleQueue
  } = useUIStore()

  const handleToggleQueue = () => {
    if (!isPlayingViewVisible) {
      setPlayingViewVisible(true)
    }
    toggleQueue()
  }

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={18} color="#a1a1aa" className="icon-btn" onClick={toggleMute} />
    if (volume < 0.5) return <Volume1 size={18} color="#a1a1aa" className="icon-btn" onClick={toggleMute} />
    return <Volume2 size={18} color="#a1a1aa" className="icon-btn" onClick={toggleMute} />
  }

  return (
    <>
      {/* Mobile Mini Progress Bar */}
      <div className="mobile-mini-progress">
        <div
          className="progress-inner"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="pb-song-info" onClick={() => window.innerWidth < 768 && setPlayingViewVisible(true)}>
        <div className="artwork-thumb">
          <Artwork
            src={currentSong?.coverUrl}
            alt="cover"
          />
        </div>
        <div className="text-info">
          <div className="title">{currentSong?.title || 'Not Playing'}</div>
          <div className="artist">{currentSong?.artist?.name || 'Unknown Artist'}</div>
        </div>
      </div>

      <div className="pb-controls">
        <div className="playback-buttons">
          <Shuffle
            size={18}
            className={`unit-btn ${isShuffle ? 'active' : ''}`}
            onClick={toggleShuffle}
          />
          <SkipBack
            size={20}
            className="unit-btn"
            onClick={prev}
          />

          <div onClick={(e) => {
            e.stopPropagation();
            toggle();
          }} className="play-pause-btn">
            {isPlaying ? (
              <Pause
                size={22}
                fill="black"
                color="black"
              />
            ) : (
              <Play
                size={22}
                fill="black"
                color="black"
                className="icon-play"
              />
            )}
          </div>

          <SkipForward
            size={20}
            className="unit-btn skip-forward-mobile"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          />

          <div className="repeat-wrapper" onClick={cycleRepeat}>
            {repeatMode === 'once' ? (
              <Repeat1
                size={18}
                className="unit-btn active"
              />
            ) : (
              <Repeat
                size={18}
                className={`unit-btn ${repeatMode !== 'none' ? 'active' : ''}`}
              />
            )}
          </div>
        </div>

        <div className="progress-section">
          <span className="time current">{formatTime(currentTime)}</span>
          <div className="slider-wrapper">
            <input
              type="range"
              className="unit-slider"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => seek((e.target.value / 100) * duration)}
              style={{ '--progress': `${progress}%` }}
            />
          </div>
          <span className="time">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="pb-extra">
        <ListMusic
          size={18}
          onClick={handleToggleQueue}
          className={`unit-btn ${showQueue && isPlayingViewVisible ? 'active' : ''}`}
        />
        {isPlayingViewVisible ? (
          <Minimize2
            size={18}
            onClick={togglePlayingView}
            className="unit-btn active"
          />
        ) : (
          <Maximize2
            size={18}
            onClick={togglePlayingView}
            className="unit-btn"
          />
        )}
        <div className="volume-section">
          {getVolumeIcon()}
          <div className="slider-wrapper">
            <input
              type="range"
              className="unit-slider"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={{ '--progress': `${volume * 100}%` }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default PlayerBar
