import React, {
  useEffect,
  useState
} from 'react'

import {
  X,
  Save,
  Music,
  Users,
  Play,
  Trash2,
  Plus,
  TrendingUp,
  Edit,
  BarChart2,
  FolderPlus,
  AlertTriangle
} from 'lucide-react'

import {
  AnimatePresence,
  // eslint-disable-next-line no-unused-vars
  motion
} from 'framer-motion'

import { useSongStore } from '@/store/songStore'
import { useAuthStore } from '@/store/authStore'

import {
  Link
} from 'react-router-dom'

import toast from 'react-hot-toast'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material'

import {
  DashboardList,
  DashboardListItem
} from '@/components/DashboardList'
import FilePicker from '@/components/FilePicker'

import { MUSIC_GENRES } from '@/constants/app.constants'

import { useTranslation } from 'react-i18next'

/**
 * Artist Dashboard Page
 * High-end analytics and management for creators
 */
const ArtistDashboard = () => {
  const { t } = useTranslation()
  const {
    mySongs = [],
    myAlbums = [],
    fetchMySongs,
    fetchMyAlbums,
    createAlbum,
    deleteAlbum,
    deleteSong,
    updateSong
  } = useSongStore()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('songs')

  // Edit State
  const [editingSong, setEditingSong] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', genre: '', artistName: '' })
  const [editCoverFile, setEditCoverFile] = useState(undefined)
  const [editCoverPreview, setEditCoverPreview] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  // Album Creation State
  const [showAlbumModal, setShowAlbumModal] = useState(false)
  const [newAlbumTitle, setNewAlbumTitle] = useState('')
  const [albumCoverFile, setAlbumCoverFile] = useState(undefined)
  const [albumCoverPreview, setAlbumCoverPreview] = useState(null)
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false)

  // Confirmation Dialog State
  const [confirmConfig, setConfirmConfig] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
    loading: false
  })

  useEffect(() => {
    fetchMySongs()
    fetchMyAlbums()
  }, [fetchMySongs, fetchMyAlbums])

  const handleConfirmAction = async () => {
    if (confirmConfig.onConfirm) {
      setConfirmConfig(prev => ({ ...prev, loading: true }))
      try {
        await confirmConfig.onConfirm()
        setConfirmConfig(prev => ({ ...prev, open: false }))
      } catch (error) {
        toast.error('Action failed:', error)
      } finally {
        setConfirmConfig(prev => ({ ...prev, loading: false }))
      }
    }
  }

  const handleDelete = (id) => {
    setConfirmConfig({
      open: true,
      title: t('artist_dashboard.confirm.delete_song_title'),
      message: t('artist_dashboard.confirm.delete_song_msg'),
      onConfirm: async () => {
        const loadingToast = toast.loading(t('artist_dashboard.confirm.deleting_song'))
        try {
          await deleteSong(id)
          toast.success(t('artist_dashboard.confirm.delete_success'), { id: loadingToast })
        } catch (err) {
          toast.error(t('artist_dashboard.confirm.delete_failed'), { id: loadingToast })
          throw err
        }
      }
    })
  }

  const handleDeleteAlbum = (id) => {
    setConfirmConfig({
      open: true,
      title: t('artist_dashboard.confirm.delete_album_title'),
      message: t('artist_dashboard.confirm.delete_album_msg'),
      onConfirm: async () => {
        const loadingToast = toast.loading(t('artist_dashboard.confirm.deleting_album'))
        try {
          await deleteAlbum(id)
          toast.success(t('artist_dashboard.confirm.delete_success'), { id: loadingToast })
        } catch (err) {
          toast.error(t('artist_dashboard.confirm.delete_failed'), { id: loadingToast })
          throw err
        }
      }
    })
  }

  const openEditModal = (song) => {
    setEditingSong(song)
    setEditForm({
      title: song.title,
      genre: song.genre,
      artistName: song.artistName || user.fullName || ''
    })
    setEditCoverPreview(song.coverUrl)
    setEditCoverFile(undefined)
  }

  const closeEditModal = () => {
    setEditingSong(null)
    if (editCoverPreview && editCoverPreview.startsWith('blob:')) {
      URL.revokeObjectURL(editCoverPreview)
    }
    setEditCoverFile(undefined)
    setEditCoverPreview(null)
  }

  const closeAlbumModal = () => {
    setShowAlbumModal(false)
    setNewAlbumTitle('')
    setAlbumCoverFile(undefined)
    if (albumCoverPreview && albumCoverPreview.startsWith('blob:')) {
      URL.revokeObjectURL(albumCoverPreview)
    }
    setAlbumCoverPreview(null)
  }

  const handleEditCoverSelect = (file) => {
    if (editCoverPreview && editCoverPreview.startsWith('blob:')) {
      URL.revokeObjectURL(editCoverPreview)
    }
    setEditCoverFile(file)
    setEditCoverPreview(URL.createObjectURL(file))
  }

  const handleEditCoverRemove = () => {
    if (editCoverPreview && editCoverPreview.startsWith('blob:')) {
      URL.revokeObjectURL(editCoverPreview)
    }
    setEditCoverFile(null)
    setEditCoverPreview(null)
  }

  const handleAlbumCoverSelect = (file) => {
    if (albumCoverPreview && albumCoverPreview.startsWith('blob:')) {
      URL.revokeObjectURL(albumCoverPreview)
    }
    setAlbumCoverFile(file)
    setAlbumCoverPreview(URL.createObjectURL(file))
  }

  const handleAlbumCoverRemove = () => {
    if (albumCoverPreview && albumCoverPreview.startsWith('blob:')) {
      URL.revokeObjectURL(albumCoverPreview)
    }
    setAlbumCoverFile(null)
    setAlbumCoverPreview(null)
  }

  const handleSaveEdit = async () => {
    setIsSaving(true)
    const loadingToast = toast.loading(t('artist_dashboard.messages.saving_changes'))

    try {
      const data = {
        title: editForm.title,
        genre: editForm.genre,
        artistName: editForm.artistName,
        coverFile: editCoverFile
      }

      await updateSong(editingSong.id, data)
      toast.success(t('artist_dashboard.messages.changes_saved'), { id: loadingToast })
      closeEditModal()
    } catch (_error) {
      toast.error(t('artist_dashboard.messages.save_failed'), { id: loadingToast })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateAlbum = async (e) => {
    e.preventDefault()
    if (!newAlbumTitle.trim()) return

    setIsCreatingAlbum(true)
    const loadingToast = toast.loading(t('artist_dashboard.messages.creating_album'))
    try {
      await createAlbum({
        title: newAlbumTitle,
        description: '',
        coverFile: albumCoverFile
      })
      toast.success(t('artist_dashboard.messages.album_created'), { id: loadingToast })
      closeAlbumModal()
    } catch (_error) {
      toast.error(t('artist_dashboard.messages.create_album_failed'), { id: loadingToast })
    } finally {
      setIsCreatingAlbum(false)
    }
  }

  // Safe stats calc
  const stats = [
    {
      label: t('artist_dashboard.stats.total_songs'),
      value: mySongs?.length || 0,
      icon: <Music size={20} />,
      color: '#6366f1'
    },
    {
      label: t('artist_dashboard.stats.total_streams'),
      value: '1.2M', // Placeholder
      icon: <Play size={20} />,
      color: '#22c55e'
    },
    {
      label: t('artist_dashboard.stats.followers'),
      value: '8.4K', // Placeholder
      icon: <Users size={20} />,
      color: '#ec4899'
    },
    {
      label: t('artist_dashboard.stats.trending'),
      value: '+12%', // Placeholder
      icon: <TrendingUp size={20} />,
      color: '#eab308'
    },
  ]

  return (
    <div className="artist-dashboard">

      {/* Album Creation Modal */}
      <AnimatePresence>
        {showAlbumModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={closeAlbumModal}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="edit-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{t('artist_dashboard.modals.create_album_title')}</h2>
                <button onClick={closeAlbumModal} className="close-btn"><X size={24} /></button>
              </div>
              <form onSubmit={handleCreateAlbum} className="modal-form">
                <div className="album-form-layout">
                  <FilePicker
                    preview={albumCoverPreview}
                    onChange={handleAlbumCoverSelect}
                    onClear={handleAlbumCoverRemove}
                    label={t('artist_dashboard.modals.album_name_label')}
                    accept="image/*"
                    className="modal-thumb-picker"
                  />
                  <div className="form-field">
                    <label>{t('artist_dashboard.modals.album_name_label')}</label>
                    <input
                      type="text"
                      value={newAlbumTitle}
                      onChange={(e) => setNewAlbumTitle(e.target.value)}
                      placeholder={t('artist_dashboard.modals.album_name_placeholder')}
                      autoFocus
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isCreatingAlbum}
                  className="save-btn"
                >
                  {isCreatingAlbum ? t('artist_dashboard.modals.creating') : <><FolderPlus size={18} /> {t('artist_dashboard.modals.create_album_btn')}</>}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal Overlay */}
      <AnimatePresence>
        {editingSong && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="edit-modal"
            >
              <div className="modal-header">
                <h2>{t('artist_dashboard.modals.edit_song_title')}</h2>
                <button onClick={closeEditModal} className="close-btn"><X size={24} /></button>
              </div>

              <div className="modal-form">
                <div className="album-form-layout">
                  <FilePicker
                    preview={editCoverPreview}
                    onChange={handleEditCoverSelect}
                    onClear={handleEditCoverRemove}
                    label={t('artist_dashboard.modals.artwork_label')}
                    accept="image/*"
                    className="modal-thumb-picker"
                  />

                  <div className="song-fields-layout">
                    {/* Fields */}
                    <div className="form-field">
                      <label>{t('artist_dashboard.modals.song_title_label')}</label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      />
                    </div>

                    <div className="form-field">
                      <label>{t('artist_dashboard.modals.artist_name_label')}</label>
                      <input
                        type="text"
                        value={editForm.artistName}
                        onChange={(e) => setEditForm({ ...editForm, artistName: e.target.value })}
                      />
                    </div>

                    <div className="form-field">
                      <label>{t('artist_dashboard.modals.genre_label')}</label>
                      <select
                        value={editForm.genre}
                        onChange={(e) => setEditForm({ ...editForm, genre: e.target.value })}
                      >
                        <option value="">{t('artist_dashboard.modals.select_genre')}</option>
                        {MUSIC_GENRES.map(genre => (
                          <option key={genre} value={genre}>{genre}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="save-btn"
                >
                  {isSaving ? t('artist_dashboard.modals.saving') : <><Save size={18} /> {t('artist_dashboard.modals.save_changes')}</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <header className="dashboard-header">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t('artist_dashboard.title')}
          </motion.h1>
          <p>{t('artist_dashboard.welcome_back', { name: user?.fullName || user?.email?.split('@')[0] || t('common.user_default') })}</p>
        </div>

        <div className="header-actions">
          <button
            onClick={() => setShowAlbumModal(true)}
            className="secondary-btn"
          >
            <FolderPlus size={18} /> {t('artist_dashboard.new_album')}
          </button>
          <Link
            to="/upload"
            className="new-release-btn"
          >
            <Plus size={18} /> {t('artist_dashboard.new_release')}
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="stat-card"
          >
            <div className="stat-icon" style={{ '--icon-color': stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <div className="label">{stat.label}</div>
              <div className="value">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        {['songs', 'albums', 'analytics', 'settings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
          >
            {t(`artist_dashboard.tabs.${tab}`)}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="tab-indicator"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'songs' ? (
          <motion.div
            key="songs-tab"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {mySongs.length > 0 ? (
              <DashboardList>
                {mySongs.map((song, idx) => (
                  <DashboardListItem
                    key={song.id}
                    index={idx + 1}
                    coverUrl={song.coverUrl}
                    title={song.title}
                    subtitle={`${song.artistName || t('common.you')} • ${song.genre}`}
                    stats={
                      <>
                        <BarChart2 size={14} />
                        <span>{t('artist_dashboard.stats.streams_count', { count: Math.floor(Math.random() * 10000).toLocaleString() })}</span>
                      </>
                    }
                    actions={
                      <>
                        <button
                          onClick={() => openEditModal(song)}
                          className="action-btn"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(song.id)}
                          className="action-btn delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    }
                  />
                ))}
              </DashboardList>
            ) : (
              <div className="empty-state">
                <Music size={48} className="empty-icon" />
                <h3>{t('artist_dashboard.empty_states.no_releases')}</h3>
                <p>{t('artist_dashboard.empty_states.no_releases_desc')}</p>
                <Link
                  to="/upload"
                  className="upload-btn"
                >
                  {t('artist_dashboard.empty_states.upload_first')}
                </Link>
              </div>
            )}
          </motion.div>
        ) : activeTab === 'albums' ? (
          <motion.div
            key="albums-tab"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {myAlbums.length > 0 ? (
              <DashboardList>
                {myAlbums.map((album) => (
                  <DashboardListItem
                    key={album.id}
                    coverUrl={album.coverUrl}
                    coverStyle={{ background: 'linear-gradient(135deg, #4f46e5, #ec4899)' }}
                    title={album.title}
                    subtitle={t('artist_dashboard.stats.songs_count', { count: album.songs?.length || 0 })}
                    actions={
                      <button
                        onClick={() => handleDeleteAlbum(album.id)}
                        className="action-btn delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    }
                  />
                ))}
              </DashboardList>
            ) : (
              <div className="empty-state">
                <FolderPlus size={48} className="empty-icon" />
                <h3>{t('artist_dashboard.empty_states.no_albums')}</h3>
                <p>{t('artist_dashboard.empty_states.no_albums_desc')}</p>
                <button onClick={() => setShowAlbumModal(true)} className="upload-btn">
                  {t('artist_dashboard.empty_states.create_first_album')}
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="other-tab"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="empty-tab-content"
          >
            {t('artist_dashboard.empty_states.coming_soon')}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Confirmation Dialog */}
      <Dialog
        open={confirmConfig.open}
        onClose={() => !confirmConfig.loading && setConfirmConfig(prev => ({ ...prev, open: false }))}
        className="confirm-dialog"
      >
        <DialogTitle className="dialog-title">
          <AlertTriangle color="#ef4444" size={28} />
          {confirmConfig.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="dialog-message">
            {confirmConfig.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button
            onClick={() => setConfirmConfig(prev => ({ ...prev, open: false }))}
            disabled={confirmConfig.loading}
            className="cancel-btn"
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            disabled={confirmConfig.loading}
            className="confirm-btn"
          >
            {confirmConfig.loading ? t('artist_dashboard.confirm.processing') : t('artist_dashboard.confirm.confirm_btn')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ArtistDashboard
