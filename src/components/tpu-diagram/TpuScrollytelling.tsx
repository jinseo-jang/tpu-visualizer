import React, { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import InteractiveArchitecture from './InteractiveArchitecture'

const steps = [
  { id: 'overview', key: 'tour.overview' },
  { id: 'mxu', key: 'tour.mxu' },
  { id: 'hbm_vmem', key: 'tour.hbm_vmem' },
  { id: 'vpu_acc', key: 'tour.vpu_acc' },
  { id: 'ici', key: 'tour.ici' },
  { id: 'sparsecore', key: 'tour.sparsecore' },
  { id: 'pipeline', key: 'tour.pipeline' },
]

export default function TpuScrollytelling() {
  const { t } = useTranslation()
  const [activeStep, setActiveStep] = useState('overview')

  return (
    <section className="bg-[#f8f9fa] py-24 relative">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">
          {t('tour.pipeline.title', 'TPU 데이터 파이프라인')}
        </h2>
        
        <div className="flex flex-col md:flex-row gap-12 relative items-start">
          
          {/* Scrolling Text (Left Side) */}
          <div className="w-full md:w-5/12 pb-[50vh] pt-[15vh]">
            {steps.map((step) => (
              <StepBlock 
                key={step.id} 
                stepId={step.id}
                stepKey={step.key} 
                setActiveStep={setActiveStep} 
              />
            ))}
          </div>

          {/* Sticky Diagram (Right Side) */}
          <div className="hidden md:block w-7/12 sticky top-24 h-[100vh]">
            <div className="w-full h-[80vh] flex items-center justify-center">
              <InteractiveArchitecture activeStep={activeStep} hasSparseCore={true} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const StepBlock: React.FC<{ stepId: string, stepKey: string, setActiveStep: (id: string) => void }> = ({ stepId, stepKey, setActiveStep }) => {
  const { t } = useTranslation()
  const ref = useRef(null)
  const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" })
  const [isExpanded, setIsExpanded] = useState(false)
  
  useEffect(() => {
    if (isInView) setActiveStep(stepId)
  }, [isInView, stepId, setActiveStep])

  return (
    <motion.div
      ref={ref}
      className="min-h-[85vh] flex flex-col justify-center md:pb-[10vh]"
      animate={{ opacity: isInView ? 1 : 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">{t(`${stepKey}.title`)}</h3>
      <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6">{t(`${stepKey}.description`)}</p>

      {/* Deep Dive Accordion */}
      {t(`${stepKey}.deepDive`) !== `${stepKey}.deepDive` && (
        <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden transition-all duration-300">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-5 py-4 flex items-center justify-between bg-blue-50/50 hover:bg-blue-50 text-blue-700 font-medium transition-colors"
          >
            <span className="flex items-center gap-2">
              {t('tour.deepDiveBtn', '동작 원리 알아보기 (Deep Dive)')}
            </span>
            <svg className={`w-5 h-5 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <motion.div 
            initial={false}
            animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
            className="overflow-hidden"
          >
            <p className="p-5 text-gray-700 leading-relaxed text-[15px] bg-white border-t border-blue-50 whitespace-pre-line">
              {t(`${stepKey}.deepDive`)}
            </p>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
