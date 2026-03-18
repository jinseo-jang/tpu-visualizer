export interface TpuSpec {
  id: string;
  name: string;
  year: number;
  tensorCoresPerChip: number;
  mxusPerCore: number;
  hbmCapacityGB: number;
  hbmBandwidthGBs: number;
  bf16Tflops: number;
  networkTopology: string;
  description: string;
}

export const tpuSpecs: Record<string, TpuSpec> = {
  v2: {
    id: 'v2',
    name: 'TPU v2',
    year: 2017,
    tensorCoresPerChip: 2,
    mxusPerCore: 1,
    hbmCapacityGB: 16,
    hbmBandwidthGBs: 600,
    bf16Tflops: 45,
    networkTopology: '2D Torus',
    description: '최초로 학습(Training)과 추론(Inference)을 모두 지원하는 세대입니다. HBM 메모리와 칩 간 고속 연결을 위한 2D Torus 네트워킹을 도입하여 분산 학습의 기초를 다졌습니다.',
  },
  v3: {
    id: 'v3',
    name: 'TPU v3',
    year: 2018,
    tensorCoresPerChip: 2,
    mxusPerCore: 2,
    hbmCapacityGB: 32,
    hbmBandwidthGBs: 900,
    bf16Tflops: 123,
    networkTopology: '2D Torus',
    description: '수냉식(Liquid cooling) 시스템을 처음으로 도입했습니다. 코어당 MXU 개수와 HBM 용량이 2배로 증가하여 행렬 곱셈 처리량이 비약적으로 상승했습니다.',
  },
  v4: {
    id: 'v4',
    name: 'TPU v4 (Pufferfish)',
    year: 2021,
    tensorCoresPerChip: 1,
    mxusPerCore: 4,
    hbmCapacityGB: 32,
    hbmBandwidthGBs: 1200,
    bf16Tflops: 275,
    networkTopology: '3D Torus (OCS)',
    description: '코어를 단일 거대 코어로 통합하고 MXU를 4개로 늘렸습니다. 업계 최초로 광회로 스위치(Optical Circuit Switches)를 적용해 동적 3D Torus 기반의 초거대 슈퍼컴퓨터를 구성할 수 있게 되었습니다.',
  },
  v5e: {
    id: 'v5e',
    name: 'TPU v5e (Viper)',
    year: 2023,
    tensorCoresPerChip: 1,
    mxusPerCore: 1,
    hbmCapacityGB: 16,
    hbmBandwidthGBs: 819,
    bf16Tflops: 197,
    networkTopology: '2D Torus',
    description: '압도적인 비용 효율성(Cost-effective)을 목표로 설계된 세대입니다. 거대 언어 모델(LLM)의 효율적인 서빙과 중대형 모델 학습에 최적화되었습니다.',
  },
  v5p: {
    id: 'v5p',
    name: 'TPU v5p (Ironwood)',
    year: 2023,
    tensorCoresPerChip: 2,
    mxusPerCore: 4,
    hbmCapacityGB: 95,
    hbmBandwidthGBs: 2760,
    bf16Tflops: 459,
    networkTopology: '3D Torus (OCS)',
    description: '최대 규모와 성능을 자랑하는 플래그십 TPU입니다. 95GB의 거대한 HBM 용량과 OCS 네트워크를 통해 최고 수준의 AI 모델(Gemini 1.0 Ultra 등)을 학습시킵니다.',
  },
  trillium: {
    id: 'trillium',
    name: 'Trillium (v6e)',
    year: 2024,
    tensorCoresPerChip: 2,
    mxusPerCore: 2,
    hbmCapacityGB: 32,
    hbmBandwidthGBs: 1600,
    bf16Tflops: 928,
    networkTopology: '3D Torus',
    description: '6세대 TPU로 SparseCore 아키텍처를 도입하여 추천 시스템이나 임베딩 기반 모델 전반에서 전례 없는 성능 효율과 HBM 대역폭을 제공합니다.',
  }
}
