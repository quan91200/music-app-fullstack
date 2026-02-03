import React, {
  useState,
} from 'react'

import { useTranslation } from 'react-i18next'

import { useNavigate } from 'react-router-dom'

import {
  ChevronLeft,
  ChevronRight,
  Layout,
  LogOut,
  Settings,
  UserCircle
} from 'lucide-react'

import {
  Menu,
  MenuItem,
  IconButton,
  Divider,
  ListItemIcon
} from '@mui/material'

import { useAuthStore } from '@store/authStore'

import UserAvatar from '@components/UserAvatar'
import {
  SkeletonText,
  SkeletonSongCard
} from '@components/skeletons'

import toast from 'react-hot-toast'

const ContentArea = ({ children }) => {
  const { t } = useTranslation()

  const {
    user,
    signOut
  } = useAuthStore()

  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState(null)

  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    try {
      handleClose()
      await signOut()
      toast.success(t('toast.logout_success', { defaultValue: 'Đã đăng xuất thành công' }))

      // Use hard redirect to clear all states and prevent "back" issues
      window.location.href = '/auth'
    } catch (error) {
      toast.error(t('toast.logout_failed', { defaultValue: 'Lỗi khi đăng xuất' }))
    }
  }

  const handleNavigate = (path) => {
    handleClose()
    // Use replace: true to prevent history stack bloating when switching between profile/settings
    navigate(path, { replace: true })
  }

  const userName = user?.fullName || user?.user_metadata?.full_name || t('common.user_default')

  return (
    <div className="content-area-main">
      <header className="content-header">
        <div className="header-nav">
          <div className="nav-btn" onClick={() => navigate(-1)}>
            <ChevronLeft size={24} />
          </div>
          <div className="nav-btn disabled">
            <ChevronRight size={24} />
          </div>
        </div>

        <div className="header-actions">
          {!user?.subscription && (
            <button
              className="premium-btn"
              onClick={() => navigate('/settings/premium')}
            >
              {t('common.premium')}
            </button>
          )}

          <div className="user-dropdown-container">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ p: 0 }}
              aria-controls={open ? 'user-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <div className="user-btn">
                <UserAvatar size={32} />
              </div>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              id="user-menu"
              open={open}
              onClose={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  backgroundColor: '#282828',
                  color: '#fff',
                  minWidth: 180,
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  '& .MuiMenuItem-root': {
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: '10px 16px',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  },
                },
              }}
              transformOrigin={{
                horizontal: 'right',
                vertical: 'top'
              }}
              anchorOrigin={{
                horizontal: 'right',
                vertical: 'bottom'
              }}
            >
              <div className="user-menu-header">
                {userName}
              </div>
              <Divider
                sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              />
              <MenuItem onClick={() => handleNavigate('/profile')}>
                <ListItemIcon>
                  <UserCircle size={18} color="#fff" />
                </ListItemIcon>
                {t('common.profile')}
              </MenuItem>
              <MenuItem onClick={() => handleNavigate('/dashboard')}>
                <ListItemIcon>
                  <Layout size={18} color="#fff" />
                </ListItemIcon>
                {t('common.dashboard')}
              </MenuItem>
              <MenuItem onClick={() => handleNavigate('/settings')}>
                <ListItemIcon>
                  <Settings size={18} color="#fff" />
                </ListItemIcon>
                {t('common.settings')}
              </MenuItem>
              <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogOut size={18} color="#fff" />
                </ListItemIcon>
                {t('common.logout')}
              </MenuItem>
            </Menu>
          </div>
        </div>
      </header>

      <div className="content-scroll">
        {children || <DefaultView />}
      </div>
    </div>
  )
}

const DefaultView = () => (
  <div className="home-view">
    <header className="home-header">
      <SkeletonText
        variant="rounded"
        width={250}
        height={40}
        sx={{ mb: 2 }}
      />
    </header>
    <div className="grid-container">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <SkeletonSongCard key={i} />
      ))}
    </div>
  </div>
)

export default ContentArea
