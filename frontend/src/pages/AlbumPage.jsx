import React, {
  useEffect,
  useState
} from 'react'

import { useParams } from 'react-router-dom'

import toast from 'react-hot-toast'

import {
  Play,
  MoreHorizontal,
  Folder,
  Heart,
  Camera
} from 'lucide-react'

import api from '@services/api'

import SongListCard from '@components/SongListCard'
import SongListHeader from '@components/SongListHeader'
import FilePicker from '@components/FilePicker'
import { ALBUM_SONG_LIST_HEADER_ORDER } from '@constants/app.constants'

import { usePlayer } from '@hooks/usePlayer'

import { useFavoriteStore } from '@store/favoriteStore'
import { useAuthStore } from '@store/authStore'
import { useSongStore } from '@store/songStore'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tooltip
} from '@mui/material'

import { useTranslation } from 'react-i18next'

const AlbumPage = () => {
  const { t } = useTranslation()
  const { id } = useParams()

  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)

  const { user } = useAuthStore()

  const { updateAlbum } = useSongStore()

  const { playSong } = usePlayer()

  const {
    toggleFavoriteAlbum,
    isFavoriteAlbum
  } = useFavoriteStore()

  // Edit states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [coverPreview, setCoverPreview] = useState(null)
  const [coverFile, setCoverFile] = useState(undefined)

  const isOwner = user && album && user.id === album.artistId

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await api.get(`songs/albums/${id}`)
        if (response.data.success) {
          setAlbum(response.data.data)
        }
      } catch (err) {
        toast.error('Failed to fetch album:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAlbum()
  }, [id])

  const handleOpenEdit = () => {
    if (!isOwner) return
    setTitle(album.title)
    setDescription(album.description || '')
    setCoverPreview(album.coverUrl || album.cover_url || null)
    setCoverFile(undefined)
    setIsEditOpen(true)
  }

  const handleCoverSelect = (file) => {
    if (coverPreview && coverPreview.startsWith('blob:')) {
      URL.revokeObjectURL(coverPreview)
    }
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleCoverRemove = () => {
    if (coverPreview && coverPreview.startsWith('blob:')) {
      URL.revokeObjectURL(coverPreview)
    }
    setCoverFile(null)
    setCoverPreview(null)
  }

  const handleSubmit = async () => {
    if (!title.trim()) return toast.error(t('toast.album_title_required'))

    setIsUpdating(true)
    const loadingToast = toast.loading(t('toast.album_updating'))

    try {
      const updated = await updateAlbum(id, {
        title,
        description,
        coverFile
      })
      setAlbum(prev => ({ ...prev, ...updated }))
      toast.success(t('toast.album_updated'), { id: loadingToast })
      setIsEditOpen(false)
    } catch (error) {
      toast.error(t('toast.album_update_failed'), { id: loadingToast })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePlayAll = () => {
    if (album?.songs?.length > 0) {
      playSong(album.songs[0], album.songs)
    }
  }

  const handleToggleLike = async () => {
    if (album) {
      await toggleFavoriteAlbum(album.id)
    }
  }

  if (loading) return <div className="loading-state">{t('common.loading_album')}</div>
  if (!album) return <div className="error-state">{t('common.error')}</div>

  const isLiked = isFavoriteAlbum(album.id)

  const coverUrl = album.coverUrl || album.cover_url
  const artistName = album.artist?.fullName || album.artist?.full_name || 'Nghệ sĩ ẩn danh'

  return (
    <div className="collection-page album-view">
      <header className="page-header">
        <div className="header-content">
          <div className={`artwork-wrapper ${isOwner ? 'editable' : ''}`} onClick={handleOpenEdit}>
            {coverUrl || coverPreview ? (
              <img src={coverPreview || coverUrl} alt={album.title} />
            ) : (
              <div className="placeholder-artwork album">
                <Folder size={64} fill="currentColor" />
              </div>
            )}
            {isOwner && (
              <div className="edit-overlay">
                <Camera size={48} />
                <span>Chọn ảnh</span>
              </div>
            )}
          </div>
          <div className="text-content">
            <span className="type">Album</span>
            <h1 className={isOwner ? 'editable-title' : ''} onClick={handleOpenEdit}>{album.title}</h1>
            <p className="description">{album.description}</p>
            <div className="meta">
              <span className="artist">{artistName}</span>
              <span className="dot">•</span>
              <span className="year">{new Date(album.releaseDate || album.release_date || Date.now()).getFullYear()}</span>
              <span className="dot">•</span>
              <span className="songs-count">{album.songs?.length || 0} bài hát</span>
            </div>
          </div>
        </div>
      </header>

      <div className="page-actions">
        <button className="play-btn primary" onClick={handlePlayAll}>
          <Play fill="black" />
        </button>
        <button className="action-btn" onClick={handleToggleLike}>
          <Heart
            size={32}
            fill={isLiked ? "#1db954" : "none"}
            color={isLiked ? "#1db954" : "#a1a1aa"}
          />
        </button>
        {isOwner && (
          <Tooltip title={t('common.edit')}>
            <button className="action-btn" onClick={handleOpenEdit}>
              <Camera size={24} />
            </button>
          </Tooltip>
        )}
        <button className="action-btn">
          <MoreHorizontal size={32} />
        </button>
      </div>

      <div className="songs-container">
        {album.songs?.length > 0 && (
          <>
            <SongListHeader headers={ALBUM_SONG_LIST_HEADER_ORDER} />
            <div className="song-list">
              {album.songs.map((song, index) => (
                <SongListCard
                  key={song.id}
                  song={song}
                  index={index + 1}
                  showArtist={false}
                  showDuration={true}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Dialog
        open={isEditOpen}
        onClose={() => !isUpdating && setIsEditOpen(false)}
        className="premium-dialog"
        PaperProps={{
          className: 'premium-dialog-paper'
        }}
      >
        <DialogTitle sx={{ fontWeight: 850, fontSize: '24px', letterSpacing: '-0.5px' }}>
          Chỉnh sửa thông tin
        </DialogTitle>
        <DialogContent>
          <div className="create-item-form">
            <FilePicker
              shape="square"
              preview={coverPreview}
              onChange={handleCoverSelect}
              onClear={handleCoverRemove}
              label="Bìa"
              accept="image/*"
              className="create-thumb-picker"
            />
            <div className="song-fields-layout">
              <TextField
                label="Tiêu đề"
                fullWidth
                variant="filled"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                label="Mô tả"
                fullWidth
                multiline
                rows={3}
                variant="filled"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ p: '24px 32px 32px' }}>
          <Button
            onClick={() => setIsEditOpen(false)}
            sx={{ color: '#fff', fontWeight: 700, textTransform: 'none', mr: 2 }}
            disabled={isUpdating}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isUpdating}
            sx={{
              bgcolor: '#fff',
              color: '#000',
              fontWeight: 800,
              borderRadius: '500px',
              px: 6,
              py: 1.5,
              textTransform: 'none',
              fontSize: '16px',
              '&:hover': { bgcolor: '#e2e2e2', transform: 'scale(1.02)' },
              '&:active': { transform: 'scale(0.98)' },
              transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
            }}
          >
            {isUpdating ? '...' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AlbumPage
