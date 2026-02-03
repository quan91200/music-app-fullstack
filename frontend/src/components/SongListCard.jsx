import React, {
  useState,
  useEffect
} from 'react'

import {
  useNavigate,
  Link
} from 'react-router-dom'

import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material'

import {
  Heart,
  Ellipsis,
  Trash2,
  Play,
  Pause,
  ListMusic,
  User,
  Disc
} from 'lucide-react'

import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { usePlayer } from '@hooks/usePlayer'
import { useFavoriteStore } from '@store/favoriteStore'
import { usePlaylistStore } from '@store/playlistStore'

import { formatDateLong } from '@utils/date.utils'

import Artwork from '@components/Artwork'

/**
 * Compact horizontal song list card component
 */
const SongListCard = ({
  song,
  index,
  variant = 'default',
  onMoreClick,
  showArtist = true,
  showAlbum = false,
  showDateAdded = false,
  showDuration = true,
  className = ''
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const isMenuOpen = Boolean(anchorEl)
  const [isHovered, setIsHovered] = useState(false)

  const {
    currentSong,
    isPlaying,
    toggle,
    playSong,
    addToQueue,
    playNext
  } = usePlayer()

  const {
    isFavorite,
    toggleFavorite
  } = useFavoriteStore()

  const {
    playlists,
    fetchPlaylists
  } = usePlaylistStore()

  const isCurrentSong = currentSong?.id === song?.id
  const isSongPlaying = isCurrentSong && isPlaying
  const liked = isFavorite(song?.id)

  // Fetch playlists when menu opens
  useEffect(() => {
    if (isMenuOpen && playlists.length === 0) {
      fetchPlaylists()
    }
  }, [isMenuOpen, playlists.length, fetchPlaylists])

  const handleFavoriteClick = async (e) => {
    e.stopPropagation()
    await toggleFavorite(song.id)
    if (!liked) {
      toast.success(t('toast.added_to_favorites'))
    } else {
      toast(t('toast.removed_from_favorites'), {
        icon: <Trash2 size={18} color="#ef4444" />
      })
    }
  }

  const handleMoreClick = (e) => {
    e.stopPropagation()
    setAnchorEl(e.currentTarget)
    if (onMoreClick) {
      onMoreClick(song, e)
    }
  }

  const handleCloseMenu = (e) => {
    if (e) e.stopPropagation()
    setAnchorEl(null)
  }

  const handleAddToQueue = (e) => {
    e.stopPropagation()
    addToQueue(song)
    toast.success(t('playing.added_to_queue'))
    handleCloseMenu()
  }

  const handlePlayNext = (e) => {
    e.stopPropagation()
    playNext(song)
    toast.success(t('playing.play_next_added'))
    handleCloseMenu()
  }

  const handleItemClick = () => {
    if (isCurrentSong) {
      toggle()
    } else {
      playSong(song)
    }
  }

  const formatDuration = (seconds) => {
    if (!seconds) return '--:--'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const itemClasses = [
    'song-list-item',
    variant,
    isCurrentSong ? 'active' : '',
    showAlbum ? 'has-album' : '',
    showDateAdded ? 'has-date' : '',
    className
  ].filter(Boolean).join(' ')


  return (
    <>
      <div
        className={itemClasses}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleItemClick}
      >
        {/* Index column with Play/Pause icon */}
        <div className="song-list-index">
          {isSongPlaying ? (
            <Pause size={14} fill="#1db954" color="#1db954" />
          ) : isCurrentSong ? (
            <Play size={14} fill="#1db954" color="#1db954" />
          ) : isHovered ? (
            <Play size={14} fill="#fff" color="#fff" />
          ) : (
            <span>{index}</span>
          )}
        </div>

        {/* Thumbnail */}
        <div className="song-list-thumb">
          <Artwork
            src={song?.coverUrl || song?.cover_url}
            alt={song?.title}
            className="thumb-image"
          />
        </div>

        {/* Song info */}
        <div className="song-list-info">
          <div className="song-title" title={song?.title}>
            {song?.title || t('common.song')}
          </div>
          {showArtist && (
            <div className="song-artist" title={song?.artist?.name}>
              {song?.artist?.id ? (
                <Link
                  to={`/artist/${song.artist.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="artist-link"
                >
                  {song?.artist?.name || t('common.anonymous_artist')}
                </Link>
              ) : (
                song?.artist?.name || t('common.anonymous_artist')
              )}
            </div>
          )}
        </div>

        {/* Album column */}
        {showAlbum && (
          <div className="song-list-album" title={song?.album?.title}>
            {song?.album?.title || t('common.album')}
          </div>
        )}

        {/* Date added column */}
        {showDateAdded && (
          <div className="song-list-date" title={song?.createdAt || song?.created_at}>
            {formatDateLong(song?.createdAt || song?.created_at) || '-'}
          </div>
        )}

        {/* Actions */}
        <div className="song-list-actions">
          {/* Favorite button */}
          <button
            className={`action-btn favorite-btn ${liked ? 'liked' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={liked ? t('toast.removed_from_favorites') : t('toast.added_to_favorites')}
          >
            <Heart
              size={16}
              fill={liked ? "#1db954" : "none"}
              color={liked ? "#1db954" : "#a1a1aa"}
            />
          </button>

          {/* Duration */}
          {showDuration && (
            <span className="duration">
              {formatDuration(song?.duration)}
            </span>
          )}

          {/* More options - visible on hover */}
          <button
            className="action-btn more-btn"
            onClick={handleMoreClick}
            aria-label={t('song_actions.more_options')}
          >
            <Ellipsis size={16} color="#a1a1aa" />
          </button>
        </div>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleCloseMenu}
        onClick={(e) => e.stopPropagation()}
        className="premium-menu"
        PaperProps={{
          className: 'premium-menu-paper',
          sx: {
            bgcolor: '#282828',
            color: '#fff',
            minWidth: 200,
            boxShadow: '0 16px 24px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }}
      >
        <MenuItem onClick={handleAddToQueue}>
          <ListItemIcon><ListMusic size={18} color="#b3b3b3" /></ListItemIcon>
          <ListItemText>{t('song_actions.add_to_queue')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handlePlayNext}>
          <ListItemIcon><Play size={18} color="#b3b3b3" /></ListItemIcon>
          <ListItemText>{t('song_actions.play_next')}</ListItemText>
        </MenuItem>

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 1 }} />

        {song.artist?.id && (
          <MenuItem onClick={() => { navigate(`/artist/${song.artist.id}`); handleCloseMenu(); }}>
            <ListItemIcon><User size={18} color="#b3b3b3" /></ListItemIcon>
            <ListItemText>{t('song_actions.go_to_artist')}</ListItemText>
          </MenuItem>
        )}

        {song.album?.id && (
          <MenuItem onClick={() => { navigate(`/album/${song.album.id}`); handleCloseMenu(); }}>
            <ListItemIcon><Disc size={18} color="#b3b3b3" /></ListItemIcon>
            <ListItemText>{t('song_actions.go_to_album')}</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  )
}

export default SongListCard
