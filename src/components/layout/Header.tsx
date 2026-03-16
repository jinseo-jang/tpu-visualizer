import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#dadce0]">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-[#202124] shrink-0" style={{ fontFamily: "'Google Sans', sans-serif" }}>
          TPU Visualizer
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm text-[#5f6368] hover:text-[#4285f4] transition-colors">
            {t('nav.home')}
          </Link>
          <Link to="/compare" className="text-sm text-[#5f6368] hover:text-[#4285f4] transition-colors">
            {t('nav.compare')}
          </Link>
          <LanguageSwitcher />
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-[#5f6368] hover:text-[#202124]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#dadce0] px-4 py-4 space-y-3">
          <Link
            to="/"
            className="block text-sm text-[#5f6368] hover:text-[#4285f4] py-2"
            onClick={() => setMenuOpen(false)}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/compare"
            className="block text-sm text-[#5f6368] hover:text-[#4285f4] py-2"
            onClick={() => setMenuOpen(false)}
          >
            {t('nav.compare')}
          </Link>
          <div className="pt-2">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  )
}
