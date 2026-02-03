import React, {
  useState
} from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

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
  Play,
  Pause,
  Heart,
  Trash2,
  Ellipsis,
  ListMusic,
  User,
} from 'lucide-react'

import { usePlayer } from '@hooks/usePlayer'

import { useFavoriteStore } from '@store/favoriteStore'

import Artwork from '@components/Artwork'

const SongGridCard = ({
  song,
  albumMode = false,
  playlistMode = false
}) => {
  const isCollection = albumMode || playlistMode;
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState(null)
  const isMenuOpen = Boolean(anchorEl)

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

  const isCurrentSong = !isCollection && currentSong?.id === song.id
  const isSongPlaying = isCurrentSong && isPlaying
  const liked = !isCollection && isFavorite(song.id)

  const handlePlayClick = (e) => {
    e.stopPropagation()
    if (isCollection) return

    if (isCurrentSong) {
      toggle()
    } else {
      playSong(song)
    }
  }

  const handleFavoriteClick = async (e) => {
    e.stopPropagation()
    if (isCollection) return

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

  const handleCardClick = () => {
    if (albumMode) {
      navigate(`/album/${song.id}`)
    } else if (playlistMode) {
      navigate(`/playlist/${song.id}`)
    } else {
      if (isCurrentSong) {
        toggle()
      } else {
        playSong(song)
      }
    }
  }

  return (
    <>
      <div
        className={`song-card group ${albumMode ? 'album-card' : ''} ${playlistMode ? 'playlist-card' : ''} ${isCurrentSong ? 'active' : ''}`}
        onClick={handleCardClick}
      >
        <div className="card-artwork">
          <Artwork
            src={song.coverUrl || song.cover_url}
            alt={song.title}
            className={!song.coverUrl && !song.cover_url ? 'placeholder-logo' : ''}
          />

          {/* Play Button Overlay */}
          <div
            className={`play-button-overlay ${isSongPlaying ? 'playing' : ''}`}
            onClick={isCollection ? undefined : handlePlayClick}
          >
            {isSongPlaying ? (
              <Pause size={24} fill="#1db954" color="#1db954" />
            ) : (
              <Play size={24} fill="#1db954" color="#1db954" />
            )}
          </div>

          <div className="card-actions-overlay">
            {/* Favorite Button Overlay - Only for Songs */}
            {!isCollection && (
              <button
                className={`action-icon-btn ${liked ? 'liked' : ''}`}
                onClick={handleFavoriteClick}
              >
                <Heart
                  size={18}
                  fill={liked ? "#1db954" : "none"}
                  color={liked ? "#1db954" : "#fff"}
                />
              </button>
            )}

            {/* More Options Button */}
            {!isCollection && (
              <button
                className="action-icon-btn more-btn"
                onClick={handleMoreClick}
              >
                <Ellipsis size={18} color="#fff" />
              </button>
            )}
          </div>
        </div>

        <div className="card-title" title={song.title}>{song.title}</div>
        <div className="card-subtitle">
          {albumMode ? (
            t('common.album')
          ) : playlistMode ? (
            t('common.playlist')
          ) : (
            <span
              className="artist-link"
              onClick={(e) => {
                e.stopPropagation();
                if (song.artist?.id) navigate(`/artist/${song.artist.id}`);
              }}
            >
              {song.artist?.name || t('common.anonymous_artist')}
            </span>
          )}
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
      </Menu>
    </>
  )
}

export default SongGridCard
