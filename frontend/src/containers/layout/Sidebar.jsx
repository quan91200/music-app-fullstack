import React, {
  useEffect,
  useState
} from 'react'

import { useTranslation } from 'react-i18next'

import {
  Home,
  Search,
  Plus,
  Heart,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

import {
  useNavigate,
  useLocation
} from 'react-router-dom'

import { useUIStore } from '@store/appStore'
import { usePlaylistStore } from '@store/playlistStore'
import { useSongStore } from '@store/songStore'
import { useFavoriteStore } from '@store/favoriteStore'

import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Tooltip
} from '@mui/material'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'

import FilePicker from '@components/FilePicker'
import Artwork from '@components/Artwork'

import toast from 'react-hot-toast'

const Sidebar = () => {
  const { t } = useTranslation()

  const {
    isLibraryCollapsed,
    toggleLibrary
  } = useUIStore()

  const {
    playlists,
    fetchPlaylists,
    createPlaylist,
    isLoading: isPlaylistLoading
  } = usePlaylistStore()

  const {
    myAlbums: albums,
    fetchMyAlbums,
    createAlbum
  } = useSongStore()

  const {
    favorites,
    favoriteAlbums,
    fetchFavorites
  } = useFavoriteStore()

  const navigate = useNavigate()
  const location = useLocation()

  // Menu State
  const [anchorEl, setAnchorEl] = useState(null)
  const openMenu = Boolean(anchorEl)

  // Modal State
  const [modalType, setModalType] = useState(null) // 'playlist' | 'album'
  const [itemName, setItemName] = useState('')
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [libraryFilter, setLibraryFilter] = useState(() => {
    return localStorage.getItem('library_filter') || 'all'
  })

  useEffect(() => {
    fetchPlaylists()
    fetchMyAlbums()
    fetchFavorites()
  }, [fetchPlaylists, fetchMyAlbums, fetchFavorites])

  useEffect(() => {
    localStorage.setItem('library_filter', libraryFilter)
  }, [libraryFilter])

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const openCreateModal = (type) => {
    setModalType(type)
    setAnchorEl(null)
    setItemName('')
    setCoverFile(null)
    setCoverPreview(null)
  }

  const closeCreateModal = () => {
    setModalType(null)
    setItemName('')
    setCoverFile(null)
    if (coverPreview) URL.revokeObjectURL(coverPreview)
    setCoverPreview(null)
  }

  const handleCoverSelect = (file) => {
    if (coverPreview) URL.revokeObjectURL(coverPreview)
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleCoverRemove = () => {
    if (coverPreview) URL.revokeObjectURL(coverPreview)
    setCoverFile(null)
    setCoverPreview(null)
  }

  const handleCreateSubmit = async () => {
    if (!itemName.trim()) return
    setIsSubmitting(true)
    const loadingToast = toast.loading(modalType === 'playlist' ? 'Creating playlist...' : 'Creating album...')
    try {
      const data = {
        title: itemName,
        description: '',
        coverFile: coverFile
      }

      if (modalType === 'playlist') {
        await createPlaylist({ ...data, isPrivate: false })
      } else if (modalType === 'album') {
        await createAlbum(data)
      }
      toast.success(`${modalType === 'playlist' ? 'Playlist' : 'Album'} created`, { id: loadingToast })
      closeCreateModal()
    } catch (error) {
      toast.error(`Failed to create ${modalType}`, { id: loadingToast })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Combine and sort library items (Playlists + Albums)
  const libraryItems = [
    // Liked Songs
    {
      id: 'liked',
      title: t('sidebar.liked_songs'),
      type: 'liked',
      icon: <Heart size={20} fill="white" color="white" />,
      sub: `Playlist • ${favorites.length} songs`
    },
    // User Playlists
    ...playlists.map(p => {
      const cover = p.coverUrl || p.cover_url
      return {
        ...p,
        type: 'playlist',
        icon: <Artwork src={cover} className="item-thumb" />,
        sub: `Playlist • ${p.songs?.length || 0} songs`
      }
    }),
    // Favorite/Saved Albums
    ...favoriteAlbums.map(a => {
      const cover = a.coverUrl || a.cover_url
      return {
        ...a,
        type: 'album',
        icon: <Artwork src={cover} className="item-thumb" />,
        sub: `Album • ${a.artist?.fullName || a.artist?.full_name || 'Artist'}`
      }
    }),
    // User Created Albums (Folders)
    ...albums.map(a => {
      const cover = a.coverUrl || a.cover_url
      return {
        ...a,
        type: 'album',
        icon: <Artwork src={cover} className="item-thumb" />,
        sub: t('artist_dashboard.stats.songs_count', { count: a.songs?.length || 0 })
      }
    })
  ]

  const filteredLibraryItems = libraryFilter === 'all'
    ? libraryItems
    : libraryItems.filter(item => {
      if (libraryFilter === 'playlists') return item.type === 'playlist' || item.type === 'liked'
      if (libraryFilter === 'albums') return item.type === 'album'
      return true
    })

  const toggleFilter = (filter) => {
    setLibraryFilter(prev => prev === filter ? 'all' : filter)
  }

  return (
    <>
      <div className={`sidebar-nav ${isLibraryCollapsed ? 'collapsed' : ''}`}>
        <NavItem
          icon={<Home size={24} />}
          label={t('sidebar.home')}
          active={location.pathname === '/'}
          collapsed={isLibraryCollapsed}
          onClick={() => navigate('/')}
        />
        <NavItem
          icon={<Search size={24} />}
          label={t('sidebar.search')}
          active={location.pathname === '/search'}
          collapsed={isLibraryCollapsed}
          onClick={() => navigate('/search')}
        />
      </div>

      <div className={`sidebar-library ${isLibraryCollapsed ? 'collapsed' : ''}`}>
        <header>
          <div className="header-left">
            <Tooltip
              title={isLibraryCollapsed ? t('common.expand_library') : t('common.collapse_library')}
            >
              <div
                className="collapse-btn trigger-btn"
                onClick={toggleLibrary}
              >
                {isLibraryCollapsed ? (
                  <PanelLeftOpen size={24} />
                ) : (
                  <PanelLeftClose size={24} />
                )}
              </div>
            </Tooltip>
            {!isLibraryCollapsed && (
              <span>{t('sidebar.your_library')}</span>
            )}
          </div>
          <div className="header-right">
            {!isLibraryCollapsed && (
              <Tooltip title={t('common.create')}>
                <Plus
                  size={24}
                  color="#a1a1aa"
                  className="plus-icon"
                  onClick={handleMenuClick}
                />
              </Tooltip>
            )}
          </div>
        </header>

        {/* Create Menu (MUI) */}
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          className="sidebar-create-menu"
        >
          <MenuItem onClick={() => openCreateModal('playlist')}>
            <ListItemIcon className="menu-icon">
              <QueueMusicIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('sidebar.create_playlist')}</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => openCreateModal('album')}>
            <ListItemIcon className="menu-icon">
              <CreateNewFolderIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('sidebar.create_album')}</ListItemText>
          </MenuItem>
        </Menu>

        {/* Creation Dialog (MUI) */}
        <Dialog
          open={!!modalType}
          onClose={closeCreateModal}
          className="premium-dialog"
          PaperProps={{
            className: 'premium-dialog-paper'
          }}
        >
          <DialogTitle sx={{ fontWeight: 850, fontSize: '24px', letterSpacing: '-0.5px' }}>
            {modalType === 'playlist' ? t('sidebar.new_playlist') : t('sidebar.new_album')}
          </DialogTitle>
          <DialogContent>
            <div className="create-item-form">
              <FilePicker
                preview={coverPreview}
                onChange={handleCoverSelect}
                onClear={handleCoverRemove}
                label={t('common.cover')}
                accept="image/*"
                className="create-thumb-picker"
              />
              <div className="song-fields-layout">
                <TextField
                  autoFocus
                  margin="dense"
                  label={t('common.name')}
                  type="text"
                  fullWidth
                  variant="filled"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCreateSubmit() }}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions sx={{ p: '24px 32px 32px' }}>
            <Button
              onClick={closeCreateModal}
              sx={{ color: '#fff', fontWeight: 700, textTransform: 'none', mr: 2 }}
              disabled={isSubmitting}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleCreateSubmit}
              variant="contained"
              disabled={isSubmitting}
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
              {isSubmitting ? '...' : t('common.create')}
            </Button>
          </DialogActions>
        </Dialog>

        {!isLibraryCollapsed && (
          <div className="library-filters">
            <span
              className={libraryFilter === 'playlists' ? 'active' : ''}
              onClick={() => toggleFilter('playlists')}
            >
              {t('sidebar.filters.playlists')}
            </span>
            <span
              className={libraryFilter === 'albums' ? 'active' : ''}
              onClick={() => toggleFilter('albums')}
            >
              {t('sidebar.filters.albums')}
            </span>
          </div>
        )}

        <div className="library-scroll">
          {filteredLibraryItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`library-item ${location.pathname === (item.type === 'liked' ? '/library' : `/${item.type}/${item.id}`) ? 'active' : ''}`}
              onClick={() => navigate(item.type === 'liked' ? '/library' : `/${item.type}/${item.id}`)}
            >
              <div className={`item-icon ${item.category || item.type}`}>
                {item.icon}
              </div>
              {!isLibraryCollapsed && (
                <div className="item-info">
                  <div className="name">{item.title}</div>
                  <div className="type">{item.sub}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

const NavItem = ({
  icon,
  label,
  active,
  collapsed,
  onClick
}) => (
  <div
    onClick={onClick}
    className={`nav-item ${active ? 'active' : ''}`}
  >
    {icon}
    {!collapsed && <span>{label}</span>}
  </div>
)

export default Sidebar
