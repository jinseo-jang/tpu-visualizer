import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { getGeneration, generations } from '../data/generations'
import { useTour } from '../hooks/useTour'
import TpuDiagram from '../components/tpu-diagram/TpuDiagram'
import TourPanel from '../components/ui/TourOverlay'

export default function Generation() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const gen = getGeneration(id || '')
  const tour = useTour()

  if (!gen) {
    return (
      <div className="pt-24 text-center">
        <p className="text-[#5f6368]">{t('common.notFound')}</p>
        <Link to="/" className="text-[#4285f4] hover:underline mt-4 inline-block">
          {t('common.backHome')}
        </Link>
      </div>
    )
  }

  const currentIndex = generations.findIndex((g) => g.id === gen.id)
  const prev = currentIndex > 0 ? generations[currentIndex - 1] : null
  const next = currentIndex < generations.length - 1 ? generations[currentIndex + 1] : null

  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          key={gen.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-2">
            <Link to="/" className="text-sm text-[#5f6368] hover:text-[#202124]">
              &larr; {t('common.backHome')}
            </Link>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm text-[#5f6368]">{gen.year}</span>
            <h1
              className="text-4xl md:text-5xl font-bold"
              style={{ color: gen.color, fontFamily: "'Google Sans', sans-serif" }}
            >
              {t(gen.nameKey)}
            </h1>
          </div>

          <p className="text-lg text-[#5f6368] leading-relaxed mb-8">
            {t(gen.descriptionKey)}
          </p>

          {/* 2D TPU Diagram — no overlay inside */}
          <div className="rounded-2xl overflow-hidden border border-[#dadce0] bg-white shadow-sm h-[70vh] min-h-[500px]">
            <TpuDiagram
              tourStep={tour.isActive ? tour.currentStep : -1}
              isActive={tour.isActive}
              generationId={gen.id}
            />
          </div>

          {/* Tour controls — below diagram, never overlapping */}
          {tour.isActive ? (
            <TourPanel
              currentStep={tour.currentStep}
              totalSteps={tour.totalSteps}
              titleKey={tour.step.titleKey}
              descriptionKey={tour.step.descriptionKey}
              isFirst={tour.isFirst}
              isLast={tour.isLast}
              onNext={tour.next}
              onPrev={tour.prev}
              onStop={tour.stop}
              onGoTo={tour.goTo}
            />
          ) : (
            <div className="flex justify-center py-6">
              <button
                onClick={tour.start}
                className="px-5 py-2.5 bg-[#4285f4] hover:bg-[#3367d6] text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                style={{ fontFamily: "'Google Sans', sans-serif" }}
              >
                {t('tour.startTour')}
              </button>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 mb-12 mt-4">
            <div className="bg-white border border-[#dadce0] rounded-2xl p-6 shadow-sm">
              <h2
                className="text-xl font-bold mb-4"
                style={{ fontFamily: "'Google Sans', sans-serif" }}
              >
                {t('generation.specs')}
              </h2>
              <dl className="space-y-3">
                {gen.specs.peakTflops != null && (
                  <div className="flex justify-between">
                    <dt className="text-[#5f6368]">{t('generation.peakTflops')}</dt>
                    <dd className="font-mono text-[#202124]">{gen.specs.peakTflops}</dd>
                  </div>
                )}
                {gen.specs.hbmGb != null && (
                  <div className="flex justify-between">
                    <dt className="text-[#5f6368]">{t('generation.hbm')}</dt>
                    <dd className="font-mono text-[#202124]">{gen.specs.hbmGb} GB</dd>
                  </div>
                )}
                {gen.specs.hbmBandwidthGbps != null && (
                  <div className="flex justify-between">
                    <dt className="text-[#5f6368]">{t('generation.hbmBandwidth')}</dt>
                    <dd className="font-mono text-[#202124]">{gen.specs.hbmBandwidthGbps} GB/s</dd>
                  </div>
                )}
                {gen.specs.iciGbps != null && (
                  <div className="flex justify-between">
                    <dt className="text-[#5f6368]">{t('generation.iciBandwidth')}</dt>
                    <dd className="font-mono text-[#202124]">{gen.specs.iciGbps} Gbps</dd>
                  </div>
                )}
                {gen.specs.podSize != null && (
                  <div className="flex justify-between">
                    <dt className="text-[#5f6368]">{t('generation.podSize')}</dt>
                    <dd className="font-mono text-[#202124]">{gen.specs.podSize.toLocaleString()} chips</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="bg-white border border-[#dadce0] rounded-2xl p-6 shadow-sm">
              <h2
                className="text-xl font-bold mb-4"
                style={{ fontFamily: "'Google Sans', sans-serif" }}
              >
                {t('generation.innovations')}
              </h2>
              <p className="text-[#5f6368] leading-relaxed">{t(gen.innovationsKey)}</p>
            </div>
          </div>

          <div className="flex justify-between">
            {prev ? (
              <Link
                to={`/generation/${prev.id}`}
                className="text-sm hover:underline font-medium"
                style={{ color: prev.color }}
              >
                &larr; {t(prev.nameKey)}
              </Link>
            ) : <span />}
            {next ? (
              <Link
                to={`/generation/${next.id}`}
                className="text-sm hover:underline font-medium"
                style={{ color: next.color }}
              >
                {t(next.nameKey)} &rarr;
              </Link>
            ) : <span />}
          </div>
        </motion.div>
      </div>
    </main>
  )
}
