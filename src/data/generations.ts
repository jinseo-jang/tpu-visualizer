export interface GenerationSpec {
  id: string
  name: string
  year: number
  nameKey: string
  descriptionKey: string
  innovationsKey: string
  podStructureDescKey?: string
  specs: {
    peakTflops?: number
    hbmGb?: number
    hbmBandwidthGbps?: number
    iciGbps?: number
    podSize?: number
    processNm?: number
    tdpWatts?: number
    tensorCores?: number
    sparseCores?: number
    mxuPerCore?: number
    vmemMb?: number
  }
  color: string
}

export const generations: GenerationSpec[] = [
  {
    id: 'v1',
    name: 'TPU v1',
    year: 2015,
    nameKey: 'generations.v1.name',
    descriptionKey: 'generations.v1.description',
    innovationsKey: 'generations.v1.innovations',
    podStructureDescKey: 'generation.podDesc_v1',
    specs: {
      peakTflops: 92,
      processNm: 28,
      tdpWatts: 75,
      tensorCores: 1,
      mxuPerCore: 1,
      vmemMb: 24,
    },
    color: '#3b82f6',
  },
  {
    id: 'v2',
    name: 'TPU v2',
    year: 2017,
    nameKey: 'generations.v2.name',
    descriptionKey: 'generations.v2.description',
    innovationsKey: 'generations.v2.innovations',
    podStructureDescKey: 'generation.podDesc_v2',
    specs: {
      peakTflops: 45,
      hbmGb: 16,
      hbmBandwidthGbps: 600,
      podSize: 64,
      tensorCores: 2,
      mxuPerCore: 1,
      vmemMb: 16,
    },
    color: '#6366f1',
  },
  {
    id: 'v3',
    name: 'TPU v3',
    year: 2018,
    nameKey: 'generations.v3.name',
    descriptionKey: 'generations.v3.description',
    innovationsKey: 'generations.v3.innovations',
    podStructureDescKey: 'generation.podDesc_v3',
    specs: {
      peakTflops: 123,
      hbmGb: 32,
      hbmBandwidthGbps: 900,
      podSize: 1024,
      tensorCores: 2,
      mxuPerCore: 2,
      vmemMb: 32,
    },
    color: '#8b5cf6',
  },
  {
    id: 'v4',
    name: 'TPU v4',
    year: 2021,
    nameKey: 'generations.v4.name',
    descriptionKey: 'generations.v4.description',
    innovationsKey: 'generations.v4.innovations',
    podStructureDescKey: 'generation.podDesc_v4',
    specs: {
      peakTflops: 275,
      hbmGb: 32,
      hbmBandwidthGbps: 1200,
      iciGbps: 24,
      podSize: 4096,
      tensorCores: 2,
      sparseCores: 4,
      mxuPerCore: 4,
      vmemMb: 128,
    },
    color: '#a855f7',
  },
  {
    id: 'v5e',
    name: 'TPU v5e',
    year: 2023,
    nameKey: 'generations.v5e.name',
    descriptionKey: 'generations.v5e.description',
    innovationsKey: 'generations.v5e.innovations',
    podStructureDescKey: 'generation.podDesc_v5e',
    specs: {
      peakTflops: 393,
      hbmGb: 16,
      hbmBandwidthGbps: 1600,
      podSize: 256,
      tensorCores: 1,
      sparseCores: 1,
      mxuPerCore: 4,
      vmemMb: 16,
    },
    color: '#d946ef',
  },
  {
    id: 'v5p',
    name: 'TPU v5p',
    year: 2023,
    nameKey: 'generations.v5p.name',
    descriptionKey: 'generations.v5p.description',
    innovationsKey: 'generations.v5p.innovations',
    podStructureDescKey: 'generation.podDesc_v5p',
    specs: {
      peakTflops: 459,
      hbmGb: 95,
      hbmBandwidthGbps: 2765,
      iciGbps: 52,
      podSize: 8960,
      tensorCores: 2,
      sparseCores: 4,
      mxuPerCore: 4,
      vmemMb: 32,
    },
    color: '#ec4899',
  },
  {
    id: 'trillium',
    name: 'Trillium (v6e)',
    year: 2024,
    nameKey: 'generations.trillium.name',
    descriptionKey: 'generations.trillium.description',
    innovationsKey: 'generations.trillium.innovations',
    podStructureDescKey: 'generation.podDesc_trillium',
    specs: {
      peakTflops: 918,
      hbmGb: 32,
      hbmBandwidthGbps: 1600,
      podSize: 256,
      tensorCores: 1,
      sparseCores: 2,
      mxuPerCore: 2,
      vmemMb: 64,
    },
    color: '#f43f5e',
  },
  {
    id: 'ironwood',
    name: 'Ironwood',
    year: 2025,
    nameKey: 'generations.ironwood.name',
    descriptionKey: 'generations.ironwood.description',
    innovationsKey: 'generations.ironwood.innovations',
    podStructureDescKey: 'generation.podDesc_ironwood',
    specs: {
      peakTflops: 4614,
      hbmGb: 192,
      hbmBandwidthGbps: 7200,
      iciGbps: 1200,
      podSize: 9216,
      tensorCores: 2,
      sparseCores: 4,
      mxuPerCore: 4,
      vmemMb: 256,
    },
    color: '#ef4444',
  },
]

export function getGeneration(id: string): GenerationSpec | undefined {
  return generations.find((g) => g.id === id)
}
