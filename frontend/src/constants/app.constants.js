/**
 * Centralized Application Constants
 */

export const MUSIC_GENRES = [
  'Pop',
  'Rock',
  'Hip-Hop',
  'Electronic',
  'R&B',
  'Jazz',
  'Classical',
  'Country',
  'Lo-Fi',
  'Indie',
  'Metal',
  'Blues',
  'Reggae',
  'Soul',
  'Funk',
  'Disco',
  'Techno',
  'House',
  'Ambient',
  'Trap'
];

export const AUDIO_MAX_SIZE_MB = 50;
export const IMAGE_MAX_SIZE_MB = 5;

export const SUPPORTED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/flac',
  'audio/ogg'
];
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
];

export const CURRENT_DEVICE = {
  id: 'current',
  name: 'Thiết bị này',
  type: 'laptop', // Could be dynamic based on navigator.userAgent
  lastActive: 'Đang hoạt động',
  isCurrent: true
};
export const SUPPORTED_LANGUAGES = [
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'zh', label: '中文' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' }
];

/**
 * Locale mappings for Intl API
 * Maps i18n language codes to full Intl locale codes
 */
export const LOCALE_MAPPINGS = {
  'vi': 'vi-VN',
  'en': 'en-US',
  'de': 'de-DE',
  'es': 'es-ES',
  'fr': 'fr-FR',
  'ja': 'ja-JP',
  'ko': 'ko-KR',
  'zh': 'zh-CN'
};

/**
 * Song List Table Header Configuration
 * Used for table/list headers in pages showing song collections
 */
export const SONG_LIST_HEADERS = {
  INDEX: {
    key: 'index',
    label: '#',
    width: '48px',
    showIcon: false
  },
  TITLE: {
    key: 'title',
    label: 'Title',
    width: '4fr',
    showIcon: false
  },
  ALBUM: {
    key: 'album',
    label: 'Album',
    width: '3fr',
    showIcon: false
  },
  DATE_ADDED: {
    key: 'dateAdded',
    label: 'Date added',
    width: '2fr',
    showIcon: false
  },
  DURATION: {
    key: 'duration',
    label: '',
    width: '120px',
    showIcon: true,
    iconName: 'Clock'
  }
};

// Default header order for playlist/liked songs views
export const DEFAULT_SONG_LIST_HEADER_ORDER = [
  SONG_LIST_HEADERS.INDEX,
  SONG_LIST_HEADERS.TITLE,
  SONG_LIST_HEADERS.ALBUM,
  SONG_LIST_HEADERS.DATE_ADDED,
  SONG_LIST_HEADERS.DURATION
];

export const ALBUM_SONG_LIST_HEADER_ORDER = [
  SONG_LIST_HEADERS.INDEX,
  SONG_LIST_HEADERS.TITLE,
  SONG_LIST_HEADERS.DURATION
];

export const BILLING_STATUS_COLORS = {
  paid: '#22c55e',
  pending: '#eab308',
  failed: '#ef4444',
  refunded: '#3b82f6',
  default: '#a1a1aa'
};

export const BILLING_STATUS_BG_COLORS = {
  paid: 'rgba(34, 197, 94, 0.1)',
  pending: 'rgba(234, 179, 8, 0.1)',
  failed: 'rgba(239, 68, 68, 0.1)',
  refunded: 'rgba(59, 130, 246, 0.1)',
  default: 'rgba(255, 255, 255, 0.05)'
};

export const BILLING_STATUS_LABELS = {
  paid: 'Paid',
  pending: 'Pending',
  failed: 'Failed',
  refunded: 'Refunded'
};

export const SONG_ACTIONS = [
  { id: 'like', labelKey: 'playing.like_song', icon: 'Heart' },
  { id: 'playlist', labelKey: 'playing.add_to_playlist', icon: 'PlusCircle' },
  { id: 'queue', labelKey: 'playing.add_to_queue', icon: 'ListMusic' },
  { id: 'radio', labelKey: 'playing.go_to_radio', icon: 'Radio' },
  { id: 'album', labelKey: 'playing.view_album', icon: 'Disc' },
  { id: 'artist', labelKey: 'playing.view_artist', icon: 'User' },
  { id: 'share', labelKey: 'common.share', icon: 'Share2' }
];
