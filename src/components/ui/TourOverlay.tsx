import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

const PIPELINE_STAGES = [
  { id: 'overview', labelKey: 'tour.overview.title' },
  { id: 'mxu', labelKey: 'tour.mxu.title' },
  { id: 'hbm_vmem', labelKey: 'tour.hbm_vmem.title' },
  { id: 'vpu_acc', labelKey: 'tour.vpu_acc.title' },
  { id: 'ici', labelKey: 'tour.ici.title' },
  { id: 'pipeline', labelKey: 'tour.pipeline.title' },
]

interface TourOverlayProps {
  currentStep: number
  totalSteps: number
  titleKey: string
  descriptionKey: string
  isFirst: boolean
  isLast: boolean
  onNext: () => void
  onPrev: () => void
  onStop: () => void
  onGoTo: (step: number) => void
}

export default function TourOverlay({
  currentStep,
  totalSteps,
  titleKey,
  descriptionKey,
  isFirst,
  isLast,
  onNext,
  onPrev,
  onStop,
  onGoTo,
}: TourOverlayProps) {
  const { t } = useTranslation()

  return (
    <div className="mt-4 space-y-3">
      {/* Step indicators — clickable pipeline stages */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {PIPELINE_STAGES.map((stage, i) => (
          <button
            key={stage.id}
            onClick={() => onGoTo(i)}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full transition-colors ${
              i === currentStep
                ? 'bg-[#4285f4] text-white font-semibold shadow-sm'
                : i < currentStep
                  ? 'bg-[#e8f0fe] text-[#4285f4]'
                  : 'bg-[#f1f3f4] text-[#5f6368] hover:bg-[#e8eaed]'
            }`}
            style={{ fontFamily: "'Google Sans', sans-serif" }}
          >
            {t(stage.labelKey)}
          </button>
        ))}
      </div>

      {/* Description card + navigation */}
      <div className="bg-white border border-[#dadce0] rounded-xl shadow-sm overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="p-5"
          >
            <h3
              className="text-base font-bold text-[#202124] mb-2"
              style={{ fontFamily: "'Google Sans', sans-serif" }}
            >
              {t(titleKey)}
            </h3>
            <p className="text-sm text-[#5f6368] leading-relaxed">
              {t(descriptionKey)}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#f8f9fa] border-t border-[#e8eaed]">
          <button
            onClick={onStop}
            className="text-sm text-[#5f6368] hover:text-[#202124] px-3 py-1.5 rounded-lg hover:bg-[#e8eaed] transition-colors"
          >
            {t('tour.close')}
          </button>

          <div className="flex gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <button
                key={i}
                onClick={() => onGoTo(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentStep
                    ? 'bg-[#4285f4] scale-125'
                    : i < currentStep
                      ? 'bg-[#a8c7fa]'
                      : 'bg-[#dadce0] hover:bg-[#9aa0a6]'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onPrev}
              disabled={isFirst}
              className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-[#5f6368] hover:text-[#202124] hover:bg-[#e8eaed]"
            >
              {t('tour.prev')}
            </button>
            <button
              onClick={isLast ? onStop : onNext}
              className="text-sm font-medium px-4 py-1.5 rounded-lg transition-colors bg-[#4285f4] hover:bg-[#3367d6] text-white"
            >
              {isLast ? t('tour.finish') : t('tour.next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
