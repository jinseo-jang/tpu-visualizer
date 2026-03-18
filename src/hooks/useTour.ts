import { useState, useCallback, useMemo } from 'react'

export interface TourStep {
  id: string
  titleKey: string
  descriptionKey: string
  highlightComponents: string[]
}

const tourSteps: TourStep[] = [
  {
    id: 'overview',
    titleKey: 'tour.overview.title',
    descriptionKey: 'tour.overview.description',
    highlightComponents: ['mxu', 'hbm', 'vmem', 'vpu', 'acc', 'ici', 'host', 'scalar'],
  },
  {
    id: 'mxu',
    titleKey: 'tour.mxu.title',
    descriptionKey: 'tour.mxu.description',
    highlightComponents: ['mxu'],
  },
  {
    id: 'hbm_vmem',
    titleKey: 'tour.hbm_vmem.title',
    descriptionKey: 'tour.hbm_vmem.description',
    highlightComponents: ['hbm', 'vmem', 'mxu'],
  },
  {
    id: 'vpu_acc',
    titleKey: 'tour.vpu_acc.title',
    descriptionKey: 'tour.vpu_acc.description',
    highlightComponents: ['vpu', 'acc', 'mxu', 'hbm'],
  },
  {
    id: 'ici',
    titleKey: 'tour.ici.title',
    descriptionKey: 'tour.ici.description',
    highlightComponents: ['ici', 'chip2', 'hbm'],
  },
  {
    id: 'pipeline',
    titleKey: 'tour.pipeline.title',
    descriptionKey: 'tour.pipeline.description',
    highlightComponents: ['mxu', 'hbm', 'vmem', 'vpu', 'acc', 'ici', 'host'],
  },
]

export function useTour(hasSparseCore: boolean = false) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(false)

  const steps = useMemo(() => {
    const base = JSON.parse(JSON.stringify(tourSteps)) as TourStep[]
    if (hasSparseCore) {
      const pipelineIdx = base.findIndex(s => s.id === 'pipeline')
      base.splice(pipelineIdx, 0, {
        id: 'sparsecore',
        titleKey: 'tour.sparsecore.title',
        descriptionKey: 'tour.sparsecore.description',
        highlightComponents: ['sparsecore', 'hbm', 'vmem', 'vpu'],
      })
      base.find(s => s.id === 'overview')?.highlightComponents.push('sparsecore')
      base.find(s => s.id === 'pipeline')?.highlightComponents.push('sparsecore')
    }
    return base
  }, [hasSparseCore])

  const step = useMemo(() => steps[currentStep] || steps[0], [currentStep, steps])

  const next = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1))
  }, [steps.length])

  const prev = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0))
  }, [])

  const goTo = useCallback((stepIndex: number) => {
    setCurrentStep(Math.max(0, Math.min(stepIndex, steps.length - 1)))
  }, [steps.length])

  const start = useCallback(() => {
    setCurrentStep(0)
    setIsActive(true)
  }, [])

  const stop = useCallback(() => {
    setIsActive(false)
  }, [])

  const isHighlighted = useCallback(
    (component: string) => {
      if (!isActive) return false
      return step.highlightComponents.includes(component)
    },
    [isActive, step],
  )

  const isDimmed = useCallback(
    (component: string) => {
      if (!isActive) return false
      return !step.highlightComponents.includes(component)
    },
    [isActive, step],
  )

  return {
    currentStep,
    step,
    totalSteps: steps.length,
    isActive,
    isFirst: currentStep === 0,
    isLast: currentStep === steps.length - 1,
    next,
    prev,
    goTo,
    start,
    stop,
    isHighlighted,
    isDimmed,
  }
}
