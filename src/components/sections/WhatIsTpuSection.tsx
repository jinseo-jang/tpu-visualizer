import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

export default function WhatIsTpuSection() {
  const { t } = useTranslation()

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('sections.whatIsTpu.title')}
        </motion.h2>
        <motion.p
          className="text-lg text-[#5f6368] leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {t('sections.whatIsTpu.description')}
        </motion.p>
      </div>
    </section>
  )
}
