import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { performanceData } from '../../data/comparisons'

export default function GpuVsTpuHighlight() {
  const { t } = useTranslation()

  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('sections.gpuVsTpu.title')}
        </motion.h2>
        <motion.p
          className="text-gray-400 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {t('sections.gpuVsTpu.subtitle')}
        </motion.p>
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {performanceData.map((d) => {
            const max = Math.max(d.gpu, d.tpu)
            return (
              <div key={d.labelKey} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-3">{t(d.labelKey)}</p>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-green-400">GPU</span>
                      <span>{d.gpu} {d.unit}</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${(d.gpu / max) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-blue-400">TPU</span>
                      <span>{d.tpu} {d.unit}</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(d.tpu / max) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </motion.div>
        <Link
          to="/compare"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          {t('sections.gpuVsTpu.viewComparison')}
        </Link>
      </div>
    </section>
  )
}
