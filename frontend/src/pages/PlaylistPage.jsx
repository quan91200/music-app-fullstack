import React, {
  useEffect,
  useState
} from 'react'

import { useParams } from 'react-router-dom'

import {
  Play,
  MoreHorizontal,
  Camera,
} from 'lucide-react'

import api from '@/services/api'

import {
  DEFAULT_SONG_LIST_HEADER_ORDER
} from '@/constants/app.constants'

import { usePlayer } from '@/hooks/usePlayer'
import { useAuthStore } from '@/store/authStore'
import { usePlaylistStore } from '@/store/playlistStore'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tooltip
} from '@mui/material'

import toast from 'react-hot-toast'

import FilePicker from '@/components/FilePicker'
import Artwork from '@/components/Artwork'
import SongListCard from '@/components/SongListCard'
import SongListHeader from '@/components/SongListHeader'
import { useTranslation } from 'react-i18next'

const PlaylistPage = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const { user } = useAuthStore()
  const { updatePlaylist } = usePlaylistStore()
  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(true)
  const { playSong } = usePlayer()

  // Edit states
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [coverFile, setCoverFile] = useState(undefined)
  const [coverPreview, setCoverPreview] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const isOwner = user && playlist && user.id === playlist.userId

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await api.get(`playlists/${id}`)
        if (response.data.success) {
          setPlaylist(response.data.data)
        }
      } catch (err) {
        toast.error('Failed to fetch playlist:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPlaylist()
  }, [id])

  const handleOpenEdit = () => {
    if (!isOwner) return
    setTitle(playlist.title)
    setDescription(playlist.description || '')
    setCoverPreview(playlist.coverUrl || playlist.cover_url || null)
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
    if (!title.trim()) return toast.error(t('toast.playlist_title_required'))

    setIsUpdating(true)
    const loadingToast = toast.loading(t('toast.playlist_updating'))

    try {
      const updated = await updatePlaylist(id, {
        title,
        description,
        coverFile
      })
      setPlaylist(prev => ({ ...prev, ...updated }))
      toast.success(t('toast.playlist_updated'), { id: loadingToast })
      setIsEditOpen(false)
    } catch (_error) {
      toast.error(t('toast.playlist_update_failed'), { id: loadingToast })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePlayAll = () => {
    if (playlist?.songs?.length > 0) {
      playSong(playlist.songs[0], playlist.songs)
    }
  }

  if (loading) return <div className="loading-state">{t('common.loading_playlist')}</div>
  if (!playlist) return <div className="error-state">{t('common.error')}</div>

  const coverUrl = playlist.coverUrl || playlist.cover_url

  return (
    <div className="collection-page playlist-view">
      <header className="page-header">
        <div className="header-bg"></div>
        <div className="header-content">
          <div className={`artwork-wrapper ${isOwner ? 'editable' : ''}`} onClick={handleOpenEdit}>
            <Artwork
              src={coverPreview || coverUrl}
              alt={playlist.title}
              className="main-artwork"
            />
            {isOwner && (
              <div className="edit-overlay">
                <Camera size={48} />
                <span>Chọn ảnh</span>
              </div>
            )}
          </div>
          <div className="text-content">
            <span className="type">Danh sách phát</span>
            <h1 className={isOwner ? 'editable-title' : ''} onClick={handleOpenEdit}>{playlist.title}</h1>
            <p className="description">{playlist.description}</p>
            <div className="meta">
              <span className="owner">{isOwner ? 'Của bạn' : 'Người dùng'}</span>
              <span className="dot">•</span>
              <span className="songs-count">{playlist.songs?.length || 0} bài hát</span>
            </div>
          </div>
        </div>
      </header>

      <div className="page-actions">
        <button className="play-btn primary" onClick={handlePlayAll}>
          <Play fill="black" />
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
        {playlist.songs?.length > 0 && (
          <>
            <SongListHeader headers={DEFAULT_SONG_LIST_HEADER_ORDER} />
            <div className="song-list">
              {playlist.songs.map((song, index) => (
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

export default PlaylistPage
