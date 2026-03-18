import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { getGeneration, generations } from '../data/generations'
import { useTour } from '../hooks/useTour'
import InteractiveArchitecture from '../components/tpu-diagram/InteractiveArchitecture'
import PodVisualizer from '../components/tpu-diagram/PodVisualizer'
import TourPanel from '../components/ui/TourOverlay'

export default function Generation() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const gen = getGeneration(id || '')
  const hasSparseCore = (gen?.specs.sparseCores ?? 0) > 0
  const tour = useTour(hasSparseCore)

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

  const activeStep = tour.isActive ? tour.step.id : 'overview'

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

          {/* Interactive TPU Diagram */}
          <div className="rounded-2xl overflow-hidden border border-[#dadce0] bg-white shadow-sm">
            <InteractiveArchitecture activeStep={activeStep} hasSparseCore={hasSparseCore} />
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

          <div className="mb-12 mt-8 space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
               {gen.specs.tensorCores != null && (
                 <div className="bg-white border border-[#dadce0] rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1">
                   <h3 className="text-sm font-medium text-[#5f6368] mb-2">{t('generation.tensorCores')}</h3>
                   <p className="text-4xl font-black text-[#4285f4]">{gen.specs.tensorCores}</p>
                 </div>
               )}
               {gen.specs.sparseCores != null && (
                 <div className="bg-white border border-[#dadce0] rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1">
                   <h3 className="text-sm font-medium text-[#5f6368] mb-2">{t('generation.sparseCores')}</h3>
                   <p className="text-4xl font-black text-[#8b5cf6]">{gen.specs.sparseCores}</p>
                 </div>
               )}
               {gen.specs.mxuPerCore != null && (
                 <div className="bg-white border border-[#dadce0] rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1">
                   <h3 className="text-sm font-medium text-[#5f6368] mb-2">{t('generation.mxuPerCore')}</h3>
                   <p className="text-4xl font-black text-[#a855f7]">{gen.specs.mxuPerCore}</p>
                 </div>
               )}
               {gen.specs.vmemMb != null && (
                 <div className="bg-white border border-[#dadce0] rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1">
                   <h3 className="text-sm font-medium text-[#5f6368] mb-2">{t('generation.vmem')}</h3>
                   <p className="text-4xl font-black text-[#ec4899]">{gen.specs.vmemMb} <span className="text-lg font-bold text-gray-400">MB</span></p>
                 </div>
               )}
               {gen.specs.hbmGb != null && (
                 <div className="bg-white border border-[#dadce0] rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1">
                   <h3 className="text-sm font-medium text-[#5f6368] mb-2">{t('generation.hbm')}</h3>
                   <p className="text-4xl font-black text-[#f97316]">{gen.specs.hbmGb} <span className="text-lg font-bold text-gray-400">GB</span></p>
                 </div>
               )}
            </div>

            {/* Bottom Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-[#dadce0] rounded-2xl p-6 shadow-sm">
                <h2
                  className="text-xl font-bold mb-6"
                  style={{ fontFamily: "'Google Sans', sans-serif" }}
                >
                  {t('generation.specs')}
                </h2>
                <dl className="space-y-4">
                  {gen.specs.peakTflops != null && (
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <dt className="text-[#5f6368] font-medium">{t('generation.peakTflops')}</dt>
                      <dd className="font-mono text-lg font-bold text-[#202124]">{gen.specs.peakTflops}</dd>
                    </div>
                  )}
                  {gen.specs.hbmBandwidthGbps != null && (
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <dt className="text-[#5f6368] font-medium">{t('generation.hbmBandwidth')}</dt>
                      <dd className="font-mono text-lg font-bold text-[#202124]">{gen.specs.hbmBandwidthGbps} GB/s</dd>
                    </div>
                  )}
                  {gen.specs.iciGbps != null && (
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <dt className="text-[#5f6368] font-medium">{t('generation.iciBandwidth')}</dt>
                      <dd className="font-mono text-lg font-bold text-[#202124]">{gen.specs.iciGbps} Gbps</dd>
                    </div>
                  )}
                  {gen.specs.podSize != null && (
                    <div className="flex justify-between items-center pb-1">
                      <dt className="text-[#5f6368] font-medium">{t('generation.podSize')}</dt>
                      <dd className="font-mono text-lg font-bold text-[#202124]">{gen.specs.podSize.toLocaleString()} chips</dd>
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
                <p className="text-[#3c4043] text-lg leading-relaxed">{t(gen.innovationsKey)}</p>
              </div>
            </div>

            {/* Pod Visualizer Section */}
            {gen.specs.podSize != null && (
              <div className="mt-12 bg-white border border-[#dadce0] rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
                <div className="p-8 md:w-1/3 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#dadce0]">
                  <h2
                    className="text-2xl font-bold mb-3 text-[#202124]"
                    style={{ fontFamily: "'Google Sans', sans-serif" }}
                  >
                    {t('generation.podStructure')}
                  </h2>
                  <p className="text-[#5f6368] leading-relaxed text-lg break-keep">
                    {gen.podStructureDescKey ? t(gen.podStructureDescKey) : t('generation.podStructureDesc')}
                  </p>
                </div>
                <div className="md:w-2/3 bg-slate-900 border-l border-slate-800 p-2 md:p-6 flex items-center justify-center">
                  <PodVisualizer podSize={gen.specs.podSize} />
                </div>
              </div>
            )}
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
