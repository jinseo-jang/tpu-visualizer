import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Card from '../ui/Card'

const architectureItems = [
  { titleKey: 'sections.coreArchitecture.mxu', descKey: 'sections.coreArchitecture.mxuDesc', color: 'from-blue-500 to-cyan-500' },
  { titleKey: 'sections.coreArchitecture.hbm', descKey: 'sections.coreArchitecture.hbmDesc', color: 'from-purple-500 to-pink-500' },
  { titleKey: 'sections.coreArchitecture.ici', descKey: 'sections.coreArchitecture.iciDesc', color: 'from-orange-500 to-red-500' },
]

export default function CoreArchitectureSection() {
  const { t } = useTranslation()

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('sections.coreArchitecture.title')}
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {architectureItems.map((item, i) => (
            <motion.div
              key={item.titleKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full">
                <div className={`h-1 w-16 rounded bg-gradient-to-r ${item.color} mb-4`} />
                <h3 className="text-lg font-semibold mb-3">{t(item.titleKey)}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{t(item.descKey)}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
