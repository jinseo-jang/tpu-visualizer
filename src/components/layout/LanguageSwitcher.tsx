import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggle = () => {
    const next = i18n.language === 'ko' ? 'en' : 'ko'
    i18n.changeLanguage(next)
    localStorage.setItem('language', next)
  }

  return (
    <button
      onClick={toggle}
      className="px-3 py-1 text-sm border border-[#dadce0] rounded hover:bg-[#e8eaed] text-[#5f6368] transition-colors"
    >
      {i18n.language === 'ko' ? 'EN' : '한국어'}
    </button>
  )
}
