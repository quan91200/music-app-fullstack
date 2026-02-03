import React from 'react'

import { useNavigate } from 'react-router-dom'

import { Button } from '@mui/material'

import {
  Laptop,
  LogOut
} from 'lucide-react'

import { useAuthStore } from '@/store/authStore'

import { CURRENT_DEVICE } from '@/constants/app.constants'

const ManageSessionPage = () => {
  const navigate = useNavigate()
  const { signOut } = useAuthStore()

  const handleLogout = async () => {
    await signOut()
    navigate('/auth')
  }

  const currentDevice = CURRENT_DEVICE

  return (
    <div className="settings-page manage-session-page">
      <header className="page-header">
        <h1>Quản lý phiên đăng nhập</h1>
      </header>

      <section className="settings-section">
        <h3 className="section-title">Phiên hiện tại</h3>

        <div className="session-card">
          <div className="device-info-container">
            <div className="device-icon-wrapper">
              <Laptop size={24} color="#1db954" />
            </div>
            <div className="device-details">
              <div className="device-name">{currentDevice.name}</div>
              <div className="device-status">{currentDevice.lastActive}</div>
            </div>
          </div>
          <Button
            variant="outlined"
            onClick={handleLogout}
            startIcon={<LogOut size={18} />}
            className="logout-btn"
          >
            Đăng xuất
          </Button>
        </div>

        <h3 className="section-title">Các phiên khác</h3>
        <div className="empty-sessions">
          <Laptop size={48} className="empty-icon" />
          <div>Không có phiên đăng nhập nào khác được phát hiện.</div>
          <div className="empty-hint">
            Nếu bạn đăng nhập trên thiết bị khác, chúng sẽ xuất hiện ở đây.
          </div>
        </div>
      </section>
    </div>
  )
}

export default ManageSessionPage
