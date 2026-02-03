import React from 'react'

import { Avatar } from '@mui/material'

import { CircleUser } from 'lucide-react'

import { useAuthStore } from '@store/authStore'

/**
 * Reusable User Avatar Component
 * Handles displaying user's profile picture or a fallback icon
 * 
 * @param {Object} props
 * @param {number} props.size - Size of the avatar (default: 32)
 * @param {string} props.className - Additional CSS classes
 */
const UserAvatar = ({
  size = 32,
  className = '',
  user: propUser
}) => {
  const {
    user: storeUser
  } = useAuthStore()
  const user = propUser || storeUser

  // Prioritize local database profile over stale Supabase metadata
  const avatarUrl = user?.avatarUrl || user?.user_metadata?.avatar_url
  // Prioritize local database full name, then metadata, then fallback
  const fullName = user?.fullName || user?.user_metadata?.full_name || user?.user_metadata?.name || 'User'

  if (avatarUrl) {
    return (
      <Avatar
        src={avatarUrl}
        alt={fullName}
        className={`user-avatar-custom ${className}`}
        sx={{
          width: size,
          height: size
        }}
      />
    )
  }

  return (
    <div
      className={`fallback-avatar ${className}`}
      style={{
        width: size,
        height: size
      }}
    >
      <CircleUser size={size * 0.625} color="#fff" />
    </div>
  )
}

export default UserAvatar
