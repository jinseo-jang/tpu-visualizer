import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const components = [
  { label: 'MXU', color: '#4285f4', x: '38%', y: '35%', w: '24%', h: '30%' },
  { label: 'HBM', color: '#673ab7', x: '10%', y: '25%', w: '12%', h: '50%' },
  { label: 'VMEM', color: '#34a853', x: '25%', y: '30%', w: '10%', h: '35%' },
  { label: 'VPU', color: '#ff7043', x: '65%', y: '45%', w: '12%', h: '20%' },
  { label: 'ACC', color: '#ea4335', x: '38%', y: '68%', w: '24%', h: '12%' },
  { label: 'ICI', color: '#fbbc04', x: '82%', y: '30%', w: '8%', h: '40%' },
]

export default function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#f8f9fa]">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.08]">
        <div className="relative w-[600px] h-[400px]">
          {/* Chip outline */}
          <div className="absolute inset-[5%] border-2 border-[#dadce0] rounded-2xl" />
          {/* Components */}
          {components.map((c, i) => (
            <motion.div
              key={c.label}
              className="absolute rounded-lg"
              style={{
                left: c.x, top: c.y, width: c.w, height: c.h,
                backgroundColor: c.color,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            />
          ))}
        </div>
      </div>

      <motion.div
        className="relative z-10 text-center px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1
          className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-[#4285f4] to-[#673ab7] bg-clip-text text-transparent"
          style={{ fontFamily: "'Google Sans', sans-serif" }}
        >
          {t('hero.title')}
        </h1>
        <p className="text-lg md:text-xl text-[#5f6368] max-w-2xl mx-auto mb-8">
          {t('hero.subtitle')}
        </p>
        <Link
          to="/generation/v1"
          className="inline-block px-8 py-3 bg-[#4285f4] hover:bg-[#3367d6] text-white font-medium rounded-lg transition-colors shadow-md"
          style={{ fontFamily: "'Google Sans', sans-serif" }}
        >
          {t('hero.cta')}
        </Link>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9aa0a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.div>
    </section>
  )
}
