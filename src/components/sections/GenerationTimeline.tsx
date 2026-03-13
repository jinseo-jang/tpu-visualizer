import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { generations } from '../../data/generations'

export default function GenerationTimeline() {
  const { t } = useTranslation()

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('sections.timeline.title')}
        </motion.h2>
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-800 hidden md:block" />
          <div className="space-y-12">
            {generations.map((gen, i) => (
              <motion.div
                key={gen.id}
                className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex-1 text-left md:text-right">
                  {i % 2 === 0 && (
                    <TimelineCard gen={gen} t={t} />
                  )}
                </div>
                <div
                  className="w-12 h-12 rounded-full border-4 flex items-center justify-center text-xs font-bold shrink-0 z-10 bg-gray-950"
                  style={{ borderColor: gen.color }}
                >
                  {gen.year}
                </div>
                <div className="flex-1 text-left">
                  {i % 2 !== 0 && (
                    <TimelineCard gen={gen} t={t} />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TimelineCard({ gen, t }: { gen: typeof generations[0]; t: (key: string) => string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-2" style={{ color: gen.color }}>
        {t(gen.nameKey)}
      </h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
        {t(gen.descriptionKey)}
      </p>
      <Link
        to={`/generation/${gen.id}`}
        className="text-sm font-medium hover:underline"
        style={{ color: gen.color }}
      >
        {t('sections.timeline.viewDetails')} →
      </Link>
    </div>
  )
}
