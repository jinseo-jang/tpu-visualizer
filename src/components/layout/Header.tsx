import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const { t } = useTranslation()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          TPU Visualizer
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm hover:text-blue-400 transition-colors">
            {t('nav.home')}
          </Link>
          <Link to="/compare" className="text-sm hover:text-blue-400 transition-colors">
            {t('nav.compare')}
          </Link>
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  )
}
