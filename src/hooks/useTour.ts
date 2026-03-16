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

export function useTour() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(false)

  const step = useMemo(() => tourSteps[currentStep], [currentStep])

  const next = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, tourSteps.length - 1))
  }, [])

  const prev = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0))
  }, [])

  const goTo = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, tourSteps.length - 1)))
  }, [])

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
    totalSteps: tourSteps.length,
    isActive,
    isFirst: currentStep === 0,
    isLast: currentStep === tourSteps.length - 1,
    next,
    prev,
    goTo,
    start,
    stop,
    isHighlighted,
    isDimmed,
  }
}
