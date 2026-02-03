import {
  Home,
  Search,
  Library,
  Star,
  User
} from 'lucide-react'

export const MOBILE_NAV_ITEMS = [
  { to: '/', icon: Home, labelKey: 'sidebar.home' },
  { to: '/search', icon: Search, labelKey: 'sidebar.search' },
  { to: '/library', icon: Library, labelKey: 'sidebar.library' },
  { to: 'settings/premium', icon: Star, labelKey: 'sidebar.premium' },
  { to: '/profile', icon: User, labelKey: 'sidebar.profile' }
]
