import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
        <p>{t('footer.credits')}</p>
      </div>
    </footer>
  )
}
