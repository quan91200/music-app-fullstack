import React, {
  useState
} from 'react'

import toast from 'react-hot-toast'

import { useTranslation } from 'react-i18next'

import {
  Camera,
  Edit2
} from 'lucide-react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Tooltip
} from '@mui/material'

import { useAuthStore } from '@/store/authStore'
import { useFavoriteStore } from '@/store/favoriteStore'

import UserAvatar from '@/components/UserAvatar'
import SongListCard from '@/components/SongListCard'
import SongListHeader from '@/components/SongListHeader'
import FilePicker from '@/components/FilePicker'

import { DEFAULT_SONG_LIST_HEADER_ORDER } from '@/constants/app.constants'

const ProfilePage = () => {
  const { t } = useTranslation()

  const { user, updateProfile } = useAuthStore()
  const { favorites } = useFavoriteStore()

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const [fullName, setFullName] = useState('')
  const [avatarFile, setAvatarFile] = useState(undefined)
  const [avatarPreview, setAvatarPreview] = useState(null)

  const userName = user?.fullName || user?.user_metadata?.full_name || 'Người dùng'
  const userEmail = user?.email

  const stats = {
    favoritesCount: favorites.length,
    playlistsCount: 0
  }

  const handleOpenEdit = () => {
    setFullName(userName)
    setAvatarPreview(user?.avatarUrl || null) // Show current avatar as default preview
    setAvatarFile(undefined)
    setIsEditOpen(true)
  }

  const handleAvatarSelect = (file) => {
    if (avatarPreview && avatarPreview.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview)
    }
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleAvatarRemove = () => {
    if (avatarPreview && avatarPreview.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview)
    }
    setAvatarFile(null)
    setAvatarPreview(null)
  }

  const handleSubmit = async () => {
    if (!fullName.trim()) return toast.error(t('toast.profile_name_required'))

    setIsUpdating(true)
    const loadingToast = toast.loading(t('toast.profile_updating'))

    try {
      await updateProfile({
        fullName,
        avatar: avatarFile,
      })
      toast.success(t('toast.profile_updated'), { id: loadingToast })
      setIsEditOpen(false)
    } catch (_error) {
      toast.error(t('toast.profile_update_failed'), { id: loadingToast })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="profile-page">
      <header className="profile-header-large">
        <div className="avatar-wrapper-header">
          <UserAvatar size={192} className="header-avatar-large" />
          <div className="avatar-overlay" onClick={handleOpenEdit}>
            <Camera size={48} color="white" />
          </div>
        </div>
        <div className="profile-info">
          <span className="profile-meta">{t('common.profile')}</span>
          <div className="name-with-edit">
            <h1 onClick={handleOpenEdit}>{userName}</h1>
            <Tooltip title={t('common.edit_profile')}>
              <IconButton onClick={handleOpenEdit} sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
                <Edit2 size={24} />
              </IconButton>
            </Tooltip>
          </div>
          <div className="profile-meta">
            {userEmail} • {stats.favoritesCount} {t('sidebar.liked_songs')}
          </div>
        </div>
      </header>

      <section className="profile-section">
        <h2>{t('common.recently_liked')}</h2>
        {favorites.length > 0 ? (
          <>
            <SongListHeader headers={DEFAULT_SONG_LIST_HEADER_ORDER} />
            <div className="song-list">
              {favorites.slice(0, 5).map((song, index) => (
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
          <div className="empty-state">
            <p>{t('common.no_liked_songs')}</p>
          </div>
        )}
      </section>

      {/* Edit Profile Dialog */}
      <Dialog
        open={isEditOpen}
        onClose={() => !isUpdating && setIsEditOpen(false)}
        className="premium-dialog"
        PaperProps={{
          className: 'premium-dialog-paper'
        }}
      >
        <DialogTitle sx={{ fontWeight: 850, fontSize: '24px', letterSpacing: '-0.5px' }}>
          {t('common.profile')}
        </DialogTitle>
        <DialogContent>
          <div className="create-item-form">
            <div className="avatar-edit-section">
              <FilePicker
                preview={avatarPreview}
                onChange={handleAvatarSelect}
                onClear={handleAvatarRemove}
                shape="circle"
                label={t('common.choose_image')}
                accept="image/*"
                hint="JPEG, PNG, WEBP"
                className="create-thumb-picker"
              />
            </div>

            <div className="song-fields-layout">
              <TextField
                label={t('common.name')}
                fullWidth
                variant="filled"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: 500, marginTop: '16px' }}>
                Bằng cách chọn ảnh, bạn đồng ý với việc thay đổi ảnh hồ sơ của mình.
              </p>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ p: '24px 32px 32px' }}>
          <Button
            onClick={() => setIsEditOpen(false)}
            sx={{ color: '#fff', fontWeight: 700, textTransform: 'none', mr: 2 }}
            disabled={isUpdating}
          >
            {t('common.cancel')}
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
            {isUpdating ? '...' : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ProfilePage
