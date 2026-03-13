import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useWebGLSupport } from '../../hooks/useWebGLSupport'
import Scene from '../three/Scene'
import RotatingGroup from '../three/RotatingGroup'
import { TpuIronwood } from '../../models/tpu'

export default function HeroSection() {
  const { t } = useTranslation()
  const webgl = useWebGLSupport()

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 to-gray-950" />

      {webgl && (
        <div className="absolute inset-0 opacity-60">
          <Scene>
            <RotatingGroup speed={0.2}>
              <TpuIronwood />
            </RotatingGroup>
          </Scene>
        </div>
      )}

      <motion.div
        className="relative z-10 text-center px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {t('hero.title')}
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          {t('hero.subtitle')}
        </p>
      </motion.div>
    </section>
  )
}
