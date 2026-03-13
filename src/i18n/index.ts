import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ko from './ko/translation.json'
import en from './en/translation.json'

const savedLang = localStorage.getItem('language')
const browserLang = navigator.language.startsWith('ko') ? 'ko' : 'en'

i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: ko },
    en: { translation: en },
  },
  lng: savedLang || browserLang,
  fallbackLng: 'ko',
  interpolation: { escapeValue: false },
})

export default i18n
