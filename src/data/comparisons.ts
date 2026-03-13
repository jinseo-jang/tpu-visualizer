export interface PerformanceDataPoint {
  labelKey: string
  gpu: number
  tpu: number
  unit: string
}

export const performanceData: PerformanceDataPoint[] = [
  { labelKey: 'compare.metrics.matmul', gpu: 312, tpu: 459, unit: 'TFLOPS' },
  { labelKey: 'compare.metrics.hbmBw', gpu: 3350, tpu: 2765, unit: 'GB/s' },
  { labelKey: 'compare.metrics.interconnect', gpu: 900, tpu: 4800, unit: 'GB/s' },
  { labelKey: 'compare.metrics.podScale', gpu: 256, tpu: 8960, unit: 'chips' },
]
