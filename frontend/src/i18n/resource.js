import vi from './locales/vi/translation.json'
import en from './locales/en/translation.json'
import de from './locales/de/translation.json'
import es from './locales/es/translation.json'
import fr from './locales/fr/translation.json'
import ja from './locales/ja/translation.json'
import ko from './locales/ko/translation.json'
import zh from './locales/zh/translation.json'

const translations = {
  vi,
  en,
  de,
  es,
  fr,
  ja,
  ko,
  zh
}

export const resources = Object.fromEntries(
  Object.entries(translations).map(([lng, translation]) => [
    lng,
    { translation }
  ])
)

export const supportedLanguages = Object.keys(translations)
