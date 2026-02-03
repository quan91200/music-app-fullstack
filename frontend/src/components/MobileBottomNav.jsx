import React from 'react'

import { NavLink } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

import { MOBILE_NAV_ITEMS } from '../constants/navigation.constants'

/**
 * Mobile Bottom Navigation component
 * Spotify-style sticky bottom bar for mobile/tablet users
 */
const MobileBottomNav = () => {
  const { t } = useTranslation()

  const navItems = MOBILE_NAV_ITEMS.map(item => ({
    ...item,
    label: t(item.labelKey)
  }))

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <item.icon size={24} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default MobileBottomNav
