# TPU Visualizer Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive educational website that visualizes TPU architecture and concepts in 3D, with Korean/English support.

**Architecture:** React SPA with React Three Fiber for 3D visualizations, scroll-driven animations on the main page, and interactive detail pages per TPU generation. Routing via React Router, styling via Tailwind CSS v4.

**Tech Stack:** React 18, TypeScript, Vite, React Three Fiber + Drei, Framer Motion, i18next, Tailwind CSS v4, React Router

**Spec:** `docs/superpowers/specs/2026-03-13-tpu-visualizer-design.md`

---

## File Structure

```
src/
├── main.tsx                          # App entry point
├── App.tsx                           # Router + layout wrapper
├── index.css                         # Tailwind imports + global styles
├── vite-env.d.ts                     # Vite type declarations
├── components/
│   ├── layout/
│   │   ├── Header.tsx                # Nav bar with logo, nav links, language switcher
│   │   ├── Footer.tsx                # References, credits
│   │   └── LanguageSwitcher.tsx      # Ko/En toggle button
│   ├── ui/
│   │   ├── Card.tsx                  # Reusable card component
│   │   ├── SimulationControls.tsx    # Play/pause/speed slider for simulations
│   │   └── WebGLFallback.tsx         # Static fallback when WebGL unavailable
│   ├── three/
│   │   ├── Scene.tsx                 # Canvas + lighting + Suspense wrapper (supports interactive mode with OrbitControls)
│   │   └── RotatingGroup.tsx         # Shared auto-rotation wrapper for models
│   └── sections/
│       ├── HeroSection.tsx           # Hero with rotating 3D TPU
│       ├── WhatIsTpuSection.tsx      # TPU basics explanation
│       ├── CoreArchitectureSection.tsx # MXU, HBM, ICI overview
│       ├── GenerationTimeline.tsx    # Scroll-driven generation cards
│       └── GpuVsTpuHighlight.tsx     # Summary comparison + link
├── pages/
│   ├── Home.tsx                      # Main scroll page composing sections
│   ├── Generation.tsx                # Per-generation detail page (lazy loaded)
│   └── Compare.tsx                   # GPU vs TPU comparison page (lazy loaded)
├── models/
│   ├── tpu/
│   │   ├── index.ts                  # Barrel export + model registry map
│   │   ├── BaseTpu.tsx               # Shared TPU board/chip geometry
│   │   ├── MxuBlock.tsx              # MXU / Systolic Array 3D block
│   │   ├── HbmBlock.tsx             # HBM memory stack 3D block
│   │   ├── IciLink.tsx               # ICI interconnect line/tube
│   │   ├── TpuV1.tsx                 # v1 model composition
│   │   ├── TpuV2.tsx                 # v2 model composition
│   │   ├── TpuV3.tsx                 # v3 model composition
│   │   ├── TpuV4.tsx                 # v4 model composition
│   │   ├── TpuV5e.tsx                # v5e model composition
│   │   ├── TpuV5p.tsx                # v5p model composition
│   │   ├── TpuTrillium.tsx           # Trillium model composition
│   │   └── TpuIronwood.tsx           # Ironwood model composition
│   └── gpu/
│       ├── GpuModel.tsx              # GPU chip with SM/CUDA blocks
│       └── CudaCoreBlock.tsx         # CUDA core cluster block
├── simulations/
│   ├── SystolicArraySim.tsx          # Matrix multiply animation in systolic array
│   └── DataFlowSim.tsx              # HBM <-> MXU data movement particles
├── data/
│   ├── generations.ts                # Per-generation specs, descriptions, config
│   └── comparisons.ts               # GPU vs TPU comparison data
├── i18n/
│   ├── index.ts                      # i18next configuration
│   ├── ko/
│   │   └── translation.json          # Korean translations
│   └── en/
│       └── translation.json          # English translations
├── hooks/
│   ├── useWebGLSupport.ts            # Detect WebGL availability
│   └── useSimulation.ts              # Simulation play/pause/speed state
└── utils/
    └── webgl.ts                      # WebGL detection utility
```

---

## Chunk 1: Project Foundation

### Task 1: Initialize Vite Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`, `src/index.css`

- [ ] **Step 1: Scaffold Vite + React + TypeScript project**

```bash
cd /home/jjinseo_admin/tpu-visualizer
npm create vite@latest . -- --template react-ts
```

Select overwrite if prompted (no existing src/).

- [ ] **Step 2: Verify scaffold works**

```bash
npm install && npm run dev
```

Expected: Dev server starts on localhost, default Vite React page renders.

- [ ] **Step 3: Clean up scaffold**

Remove default Vite boilerplate from `src/App.tsx` and `src/App.css`. Keep `App.tsx` with a minimal placeholder:

```tsx
function App() {
  return <div className="min-h-screen bg-gray-950 text-white">TPU Visualizer</div>
}

export default App
```

Delete `src/App.css` and `src/assets/react.svg`. Update `src/main.tsx` to not import `App.css`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TypeScript project"
```

---

### Task 2: Install Dependencies & Configure Tailwind v4

**Files:**
- Modify: `package.json`, `vite.config.ts`, `src/index.css`

Note: Tailwind CSS v4 uses CSS-based configuration — no `tailwind.config.js` needed.

- [ ] **Step 1: Install all project dependencies**

```bash
npm install react-router-dom @react-three/fiber @react-three/drei three framer-motion i18next react-i18next
npm install -D tailwindcss @tailwindcss/vite @types/three
```

- [ ] **Step 2: Configure Tailwind with Vite plugin**

Update `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Update `src/index.css`:

```css
@import "tailwindcss";
```

- [ ] **Step 3: Verify Tailwind works**

```bash
npm run dev
```

Verify the `bg-gray-950 text-white` classes from App.tsx apply correctly (dark background, white text).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: install dependencies and configure Tailwind CSS v4"
```

---

### Task 3: Set Up i18n

**Files:**
- Create: `src/i18n/index.ts`, `src/i18n/ko/translation.json`, `src/i18n/en/translation.json`
- Modify: `src/main.tsx`

- [ ] **Step 1: Create Korean translation file**

Create `src/i18n/ko/translation.json`:

```json
{
  "nav": {
    "home": "홈",
    "generations": "TPU 세대",
    "compare": "GPU vs TPU"
  },
  "hero": {
    "title": "TPU의 모든 것을 이해하다",
    "subtitle": "인터랙티브 3D 시각화로 배우는 TPU 아키텍처"
  },
  "sections": {
    "whatIsTpu": {
      "title": "TPU란 무엇인가?",
      "description": "TPU(Tensor Processing Unit)는 Google이 머신러닝 워크로드를 위해 설계한 맞춤형 ASIC(Application-Specific Integrated Circuit)입니다."
    },
    "coreArchitecture": {
      "title": "핵심 아키텍처",
      "mxu": "MXU (Matrix Multiply Unit)",
      "mxuDesc": "시스톨릭 어레이 기반의 행렬 연산 전용 유닛으로, TPU의 핵심 연산 엔진입니다.",
      "hbm": "HBM (High Bandwidth Memory)",
      "hbmDesc": "초고대역폭 메모리로, 대량의 모델 파라미터와 활성화 값을 저장합니다.",
      "ici": "ICI (Inter-Chip Interconnect)",
      "iciDesc": "칩 간 초고속 통신을 위한 인터커넥트로, Pod 규모 확장을 가능하게 합니다."
    },
    "timeline": {
      "title": "TPU 세대별 진화",
      "viewDetails": "자세히 보기"
    },
    "gpuVsTpu": {
      "title": "GPU vs TPU",
      "subtitle": "두 아키텍처의 핵심 차이점",
      "viewComparison": "전체 비교 보기"
    }
  },
  "generation": {
    "specs": "사양",
    "innovations": "주요 혁신",
    "peakTflops": "최고 TFLOPS",
    "hbm": "HBM 용량",
    "hbmBandwidth": "HBM 대역폭",
    "iciBandwidth": "ICI 대역폭",
    "podSize": "Pod 크기"
  },
  "simulation": {
    "play": "재생",
    "pause": "일시정지",
    "speed": "속도"
  },
  "compare": {
    "performanceTitle": "성능 비교",
    "disclaimer": "* 교육 목적의 근사치입니다. GPU: NVIDIA H100, TPU: v5p.",
    "gpuLabel": "GPU",
    "tpuLabel": "TPU"
  },
  "footer": {
    "references": "참고 자료",
    "credits": "이 사이트는 교육 목적으로 제작되었습니다."
  },
  "common": {
    "language": "언어",
    "loading": "로딩 중...",
    "notFound": "페이지를 찾을 수 없습니다.",
    "backHome": "홈으로 돌아가기"
  }
}
```

- [ ] **Step 2: Create English translation file**

Create `src/i18n/en/translation.json`:

```json
{
  "nav": {
    "home": "Home",
    "generations": "TPU Generations",
    "compare": "GPU vs TPU"
  },
  "hero": {
    "title": "Understanding Everything About TPUs",
    "subtitle": "Learn TPU architecture through interactive 3D visualization"
  },
  "sections": {
    "whatIsTpu": {
      "title": "What is a TPU?",
      "description": "A TPU (Tensor Processing Unit) is a custom ASIC (Application-Specific Integrated Circuit) designed by Google for machine learning workloads."
    },
    "coreArchitecture": {
      "title": "Core Architecture",
      "mxu": "MXU (Matrix Multiply Unit)",
      "mxuDesc": "A systolic array-based unit dedicated to matrix operations, serving as the TPU's core computation engine.",
      "hbm": "HBM (High Bandwidth Memory)",
      "hbmDesc": "Ultra-high bandwidth memory that stores large model parameters and activation values.",
      "ici": "ICI (Inter-Chip Interconnect)",
      "iciDesc": "Ultra-fast inter-chip communication interconnect enabling Pod-scale expansion."
    },
    "timeline": {
      "title": "TPU Evolution Across Generations",
      "viewDetails": "View Details"
    },
    "gpuVsTpu": {
      "title": "GPU vs TPU",
      "subtitle": "Key architectural differences",
      "viewComparison": "View Full Comparison"
    }
  },
  "generation": {
    "specs": "Specifications",
    "innovations": "Key Innovations",
    "peakTflops": "Peak TFLOPS",
    "hbm": "HBM",
    "hbmBandwidth": "HBM Bandwidth",
    "iciBandwidth": "ICI Bandwidth",
    "podSize": "Pod Size"
  },
  "simulation": {
    "play": "Play",
    "pause": "Pause",
    "speed": "Speed"
  },
  "compare": {
    "performanceTitle": "Performance Comparison",
    "disclaimer": "* Approximate values for educational purposes. GPU: NVIDIA H100, TPU: v5p.",
    "gpuLabel": "GPU",
    "tpuLabel": "TPU"
  },
  "footer": {
    "references": "References",
    "credits": "This site was created for educational purposes."
  },
  "common": {
    "language": "Language",
    "loading": "Loading...",
    "notFound": "Page not found.",
    "backHome": "Back to Home"
  }
}
```

- [ ] **Step 3: Create i18n configuration**

Create `src/i18n/index.ts`:

```ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ko from './ko/translation.json'
import en from './en/translation.json'

const savedLang = localStorage.getItem('language')
const browserLang = navigator.language.startsWith('ko') ? 'ko' : 'en'

i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: ko },
    en: { translation: en },
  },
  lng: savedLang || browserLang,
  fallbackLng: 'ko',
  interpolation: { escapeValue: false },
})

export default i18n
```

- [ ] **Step 4: Import i18n in main.tsx**

Add `import './i18n'` at the top of `src/main.tsx` (before App import).

- [ ] **Step 5: Verify i18n loads without errors**

```bash
npm run dev
```

No console errors. Page still renders.

- [ ] **Step 6: Commit**

```bash
git add src/i18n/ src/main.tsx
git commit -m "feat: set up i18next with Korean and English translations"
```

---

### Task 4: Set Up Routing & Layout

**Files:**
- Create: `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/LanguageSwitcher.tsx`, `src/pages/Home.tsx`, `src/pages/Generation.tsx`, `src/pages/Compare.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create LanguageSwitcher component**

Create `src/components/layout/LanguageSwitcher.tsx`:

```tsx
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggle = () => {
    const next = i18n.language === 'ko' ? 'en' : 'ko'
    i18n.changeLanguage(next)
    localStorage.setItem('language', next)
  }

  return (
    <button
      onClick={toggle}
      className="px-3 py-1 text-sm border border-gray-600 rounded hover:bg-gray-800 transition-colors"
    >
      {i18n.language === 'ko' ? 'EN' : '한국어'}
    </button>
  )
}
```

- [ ] **Step 2: Create Header component**

Create `src/components/layout/Header.tsx`:

```tsx
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const { t } = useTranslation()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          TPU Visualizer
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm hover:text-blue-400 transition-colors">
            {t('nav.home')}
          </Link>
          <Link to="/compare" className="text-sm hover:text-blue-400 transition-colors">
            {t('nav.compare')}
          </Link>
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  )
}
```

- [ ] **Step 3: Create Footer component**

Create `src/components/layout/Footer.tsx`:

```tsx
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
        <p>{t('footer.credits')}</p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Create placeholder page components**

Create `src/pages/Home.tsx`:

```tsx
export default function Home() {
  return <div className="pt-16">Home Page</div>
}
```

Create `src/pages/Generation.tsx`:

```tsx
import { useParams } from 'react-router-dom'

export default function Generation() {
  const { id } = useParams<{ id: string }>()
  return <div className="pt-16">Generation: {id}</div>
}
```

Create `src/pages/Compare.tsx`:

```tsx
export default function Compare() {
  return <div className="pt-16">GPU vs TPU Comparison</div>
}
```

- [ ] **Step 5: Set up Router in App.tsx with lazy loading**

Update `src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'

const Generation = lazy(() => import('./pages/Generation'))
const Compare = lazy(() => import('./pages/Compare'))

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white">
        <Header />
        <Suspense fallback={<div className="pt-20 text-center text-gray-500">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/generation/:id" element={<Generation />} />
            <Route path="/compare" element={<Compare />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
```

- [ ] **Step 6: Verify routing works**

```bash
npm run dev
```

- Navigate to `/` — shows "Home Page" with header and footer
- Navigate to `/generation/v1` — shows "Generation: v1"
- Navigate to `/compare` — shows "GPU vs TPU Comparison"
- Language switcher toggles nav labels between Korean/English

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/ src/pages/ src/App.tsx
git commit -m "feat: add routing with lazy loading, header, footer, and page placeholders"
```

---

## Chunk 2: Data Layer & Main Page Sections

### Task 5: Create Generation Data

**Files:**
- Create: `src/data/generations.ts`

- [ ] **Step 1: Create generation data file**

Create `src/data/generations.ts`:

```ts
export interface GenerationSpec {
  id: string
  name: string
  year: number
  nameKey: string
  descriptionKey: string
  innovationsKey: string
  specs: {
    peakTflops?: number
    hbmGb?: number
    hbmBandwidthGbps?: number
    iciGbps?: number
    podSize?: number
    processNm?: number
    tdpWatts?: number
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
    specs: {
      peakTflops: 92,
      processNm: 28,
      tdpWatts: 75,
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
    specs: {
      peakTflops: 45,
      hbmGb: 16,
      hbmBandwidthGbps: 600,
      podSize: 64,
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
    specs: {
      peakTflops: 123,
      hbmGb: 32,
      hbmBandwidthGbps: 900,
      podSize: 1024,
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
    specs: {
      peakTflops: 275,
      hbmGb: 32,
      hbmBandwidthGbps: 1200,
      iciGbps: 24,
      podSize: 4096,
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
    specs: {
      peakTflops: 393,
      hbmGb: 16,
      hbmBandwidthGbps: 1600,
      podSize: 256,
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
    specs: {
      peakTflops: 459,
      hbmGb: 95,
      hbmBandwidthGbps: 2765,
      iciGbps: 52,
      podSize: 8960,
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
    specs: {
      peakTflops: 918,
      hbmGb: 32,
      hbmBandwidthGbps: 1600,
      podSize: 256,
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
    specs: {
      peakTflops: 4614,
      hbmGb: 192,
      hbmBandwidthGbps: 7200,
      iciGbps: 1200,
      podSize: 9216,
    },
    color: '#ef4444',
  },
]

export function getGeneration(id: string): GenerationSpec | undefined {
  return generations.find((g) => g.id === id)
}
```

- [ ] **Step 2: Add generation translations to both language files**

Add the `generations` key to both `ko/translation.json` and `en/translation.json` with name, description, and innovations for each generation.

Korean entries:

```json
"generations": {
  "v1": {
    "name": "TPU v1",
    "description": "Google이 개발한 최초의 TPU로, 추론(inference) 전용으로 설계되었습니다. 8비트 정수 연산과 시스톨릭 어레이를 도입하여 딥러닝 추론 성능을 획기적으로 향상시켰습니다.",
    "innovations": "최초의 시스톨릭 어레이 도입, 8비트 정수 연산, 추론 전용 ASIC"
  },
  "v2": {
    "name": "TPU v2",
    "description": "훈련(training)을 지원하는 최초의 TPU입니다. bfloat16 부동소수점 형식과 HBM을 도입했으며, 64개 칩을 연결한 첫 번째 Pod 구성을 지원합니다.",
    "innovations": "훈련 지원, bfloat16, HBM 도입, 64칩 Pod"
  },
  "v3": {
    "name": "TPU v3",
    "description": "HBM 용량을 2배로 늘리고 액체 냉각을 도입한 세대입니다. 1,024개 칩 Pod를 지원하여 대규모 모델 훈련이 가능해졌습니다.",
    "innovations": "2x HBM, 액체 냉각, 1024칩 Pod"
  },
  "v4": {
    "name": "TPU v4",
    "description": "4,096개 칩 Pod와 3D 토러스 ICI 토폴로지, 광학 회로 스위칭(OCS)을 도입하여 대규모 분산 훈련의 효율성을 크게 향상시켰습니다.",
    "innovations": "4096칩 Pod, 3D 토러스 ICI, 광학 회로 스위칭"
  },
  "v5e": {
    "name": "TPU v5e",
    "description": "비용 효율성에 초점을 맞춘 TPU로, 훈련과 추론을 모두 지원합니다. Megacore 아키텍처를 도입하여 가격 대비 성능을 최적화했습니다.",
    "innovations": "비용 효율 최적화, Megacore, 훈련+추론 통합"
  },
  "v5p": {
    "name": "TPU v5p",
    "description": "최대 규모의 훈련을 위한 TPU로, 8,960개 칩 Pod와 SparseCore를 지원합니다. 대규모 언어 모델 훈련에 최적화되었습니다.",
    "innovations": "8960칩 Pod, SparseCore, 대규모 LLM 훈련 최적화"
  },
  "trillium": {
    "name": "Trillium (v6e)",
    "description": "에너지 효율성과 칩당 성능 향상에 초점을 맞춘 세대입니다. 이전 세대 대비 칩당 성능이 크게 개선되었습니다.",
    "innovations": "에너지 효율 향상, 칩당 성능 대폭 개선"
  },
  "ironwood": {
    "name": "Ironwood",
    "description": "2025년 발표된 최신 TPU로, 최대 규모와 성능을 자랑합니다. 이전 세대의 모든 혁신을 통합하고 한층 더 발전시켰습니다.",
    "innovations": "최대 성능, 192GB HBM, 9216칩 Pod, 차세대 ICI"
  }
}
```

English entries follow the same structure with English text.

- [ ] **Step 3: Commit**

```bash
git add src/data/ src/i18n/
git commit -m "feat: add TPU generation data and translations"
```

---

### Task 6: Create Comparison Data

**Files:**
- Create: `src/data/comparisons.ts`

- [ ] **Step 1: Create comparison data**

Create `src/data/comparisons.ts`:

```ts
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
```

- [ ] **Step 2: Add comparison metric translations to both language files**

Add to Korean:
```json
"compare": {
  ...existing keys...,
  "metrics": {
    "matmul": "행렬 곱셈 처리량",
    "hbmBw": "HBM 대역폭",
    "interconnect": "인터커넥트 대역폭",
    "podScale": "Pod 규모"
  }
}
```

Add equivalent English entries.

- [ ] **Step 3: Commit**

```bash
git add src/data/comparisons.ts src/i18n/
git commit -m "feat: add GPU vs TPU comparison data"
```

---

### Task 7: Build Main Page Sections (2D Content)

**Files:**
- Create: `src/components/sections/HeroSection.tsx`, `src/components/sections/WhatIsTpuSection.tsx`, `src/components/sections/CoreArchitectureSection.tsx`, `src/components/sections/GenerationTimeline.tsx`, `src/components/sections/GpuVsTpuHighlight.tsx`, `src/components/ui/Card.tsx`
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: Create Card UI component**

Create `src/components/ui/Card.tsx`:

```tsx
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Create HeroSection (3D placeholder — will be upgraded in Task 11)**

Create `src/components/sections/HeroSection.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

export default function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 to-gray-950" />
      <motion.div
        className="relative z-10 text-center px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {t('hero.title')}
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          {t('hero.subtitle')}
        </p>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 3: Create WhatIsTpuSection**

Create `src/components/sections/WhatIsTpuSection.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

export default function WhatIsTpuSection() {
  const { t } = useTranslation()

  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('sections.whatIsTpu.title')}
        </motion.h2>
        <motion.p
          className="text-lg text-gray-300 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {t('sections.whatIsTpu.description')}
        </motion.p>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create CoreArchitectureSection**

Create `src/components/sections/CoreArchitectureSection.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Card from '../ui/Card'

const architectureItems = ['mxu', 'hbm', 'ici'] as const

export default function CoreArchitectureSection() {
  const { t } = useTranslation()

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('sections.coreArchitecture.title')}
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {architectureItems.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Card className="h-full">
                <h3 className="text-xl font-semibold mb-3 text-blue-400">
                  {t(`sections.coreArchitecture.${item}`)}
                </h3>
                <p className="text-gray-400">
                  {t(`sections.coreArchitecture.${item}Desc`)}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Create GenerationTimeline**

Create `src/components/sections/GenerationTimeline.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { generations } from '../../data/generations'
import Card from '../ui/Card'

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
                className={`flex flex-col md:flex-row items-center gap-8 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex-1">
                  <Card>
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: gen.color }}
                      />
                      <span className="text-sm text-gray-500">{gen.year}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{t(gen.nameKey)}</h3>
                    <p className="text-gray-400 mb-4">{t(gen.descriptionKey)}</p>
                    <Link
                      to={`/generation/${gen.id}`}
                      className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                    >
                      {t('sections.timeline.viewDetails')} →
                    </Link>
                  </Card>
                </div>
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Create GpuVsTpuHighlight**

Create `src/components/sections/GpuVsTpuHighlight.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function GpuVsTpuHighlight() {
  const { t } = useTranslation()

  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('sections.gpuVsTpu.title')}
        </motion.h2>
        <motion.p
          className="text-lg text-gray-400 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {t('sections.gpuVsTpu.subtitle')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link
            to="/compare"
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition-colors"
          >
            {t('sections.gpuVsTpu.viewComparison')}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Compose Home page**

Update `src/pages/Home.tsx`:

```tsx
import HeroSection from '../components/sections/HeroSection'
import WhatIsTpuSection from '../components/sections/WhatIsTpuSection'
import CoreArchitectureSection from '../components/sections/CoreArchitectureSection'
import GenerationTimeline from '../components/sections/GenerationTimeline'
import GpuVsTpuHighlight from '../components/sections/GpuVsTpuHighlight'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <WhatIsTpuSection />
      <CoreArchitectureSection />
      <GenerationTimeline />
      <GpuVsTpuHighlight />
    </main>
  )
}
```

- [ ] **Step 8: Verify all sections render on main page**

```bash
npm run dev
```

- Scroll through all sections
- Verify Framer Motion animations trigger on scroll
- Verify language switching updates all text
- Verify generation cards link to `/generation/:id`
- Verify GPU comparison button links to `/compare`

- [ ] **Step 9: Commit**

```bash
git add src/components/sections/ src/components/ui/ src/pages/Home.tsx
git commit -m "feat: build main page sections with scroll animations"
```

---

## Chunk 3: 3D Infrastructure & TPU Models

### Task 8: WebGL Detection & Scene Infrastructure

**Files:**
- Create: `src/utils/webgl.ts`, `src/hooks/useWebGLSupport.ts`, `src/components/ui/WebGLFallback.tsx`, `src/components/three/Scene.tsx`, `src/components/three/RotatingGroup.tsx`

- [ ] **Step 1: Create WebGL detection utility**

Create `src/utils/webgl.ts`:

```ts
export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    )
  } catch {
    return false
  }
}
```

- [ ] **Step 2: Create useWebGLSupport hook**

Create `src/hooks/useWebGLSupport.ts`:

```ts
import { useState, useEffect } from 'react'
import { isWebGLSupported } from '../utils/webgl'

export function useWebGLSupport() {
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    setSupported(isWebGLSupported())
  }, [])

  return supported
}
```

- [ ] **Step 3: Create WebGL fallback component**

Create `src/components/ui/WebGLFallback.tsx`:

```tsx
interface WebGLFallbackProps {
  description: string
}

export default function WebGLFallback({ description }: WebGLFallbackProps) {
  return (
    <div
      className="flex items-center justify-center bg-gray-900 rounded-xl p-8 text-center"
      role="img"
      aria-label={description}
    >
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
```

- [ ] **Step 4: Create RotatingGroup (shared rotation wrapper)**

Create `src/components/three/RotatingGroup.tsx`:

```tsx
import { useRef, ReactNode } from 'react'
import { Group } from 'three'
import { useFrame } from '@react-three/fiber'

interface RotatingGroupProps {
  children: ReactNode
  rotate?: boolean
  speed?: number
}

export default function RotatingGroup({ children, rotate = false, speed = 0.2 }: RotatingGroupProps) {
  const groupRef = useRef<Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current && rotate) {
      groupRef.current.rotation.y += delta * speed
    }
  })

  return <group ref={groupRef}>{children}</group>
}
```

- [ ] **Step 5: Create unified Scene wrapper (supports both static and interactive modes)**

Create `src/components/three/Scene.tsx`:

```tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, ReactNode } from 'react'
import { useWebGLSupport } from '../../hooks/useWebGLSupport'
import WebGLFallback from '../ui/WebGLFallback'

interface SceneProps {
  children: ReactNode
  className?: string
  fallbackText?: string
  camera?: { position: [number, number, number]; fov?: number }
  interactive?: boolean
}

export default function Scene({
  children,
  className = '',
  fallbackText = '3D visualization',
  camera = { position: [0, 0, 5], fov: 50 },
  interactive = false,
}: SceneProps) {
  const webglSupported = useWebGLSupport()

  if (!webglSupported) {
    return <WebGLFallback description={fallbackText} />
  }

  return (
    <div className={className} role="img" aria-label={fallbackText}>
      <Canvas camera={camera}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          {interactive && (
            <>
              <directionalLight position={[-3, 3, -3]} intensity={0.3} />
              <OrbitControls
                enablePan={false}
                minDistance={2}
                maxDistance={10}
                autoRotate
                autoRotateSpeed={0.5}
              />
            </>
          )}
          {children}
        </Suspense>
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 6: Verify 3D canvas renders**

Add a test sphere to HeroSection temporarily and confirm it renders.

- [ ] **Step 7: Commit**

```bash
git add src/utils/ src/hooks/ src/components/three/ src/components/ui/WebGLFallback.tsx
git commit -m "feat: add WebGL detection, Scene component, and RotatingGroup"
```

---

### Task 9: Build TPU Model Building Blocks

**Files:**
- Create: `src/models/tpu/BaseTpu.tsx`, `src/models/tpu/MxuBlock.tsx`, `src/models/tpu/HbmBlock.tsx`, `src/models/tpu/IciLink.tsx`

- [ ] **Step 1: Create MXU block**

Create `src/models/tpu/MxuBlock.tsx`:

```tsx
import { useRef } from 'react'
import { Mesh } from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

interface MxuBlockProps {
  position?: [number, number, number]
  scale?: number
  color?: string
  label?: string
  highlight?: boolean
}

export default function MxuBlock({
  position = [0, 0, 0],
  scale = 1,
  color = '#3b82f6',
  label,
  highlight = false,
}: MxuBlockProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current && highlight) {
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef} scale={scale}>
        <boxGeometry args={[1.5, 0.3, 1.5]} />
        <meshStandardMaterial
          color={color}
          emissive={highlight ? color : '#000000'}
          emissiveIntensity={highlight ? 0.3 : 0}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      {/* Grid lines on top to suggest systolic array */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={`h-${i}`} position={[0, 0.16 * scale, (i - 1.5) * 0.35 * scale]} scale={scale}>
          <boxGeometry args={[1.5, 0.01, 0.02]} />
          <meshStandardMaterial color="#60a5fa" opacity={0.5} transparent />
        </mesh>
      ))}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={`v-${i}`} position={[(i - 1.5) * 0.35 * scale, 0.16 * scale, 0]} scale={scale}>
          <boxGeometry args={[0.02, 0.01, 1.5]} />
          <meshStandardMaterial color="#60a5fa" opacity={0.5} transparent />
        </mesh>
      ))}
      {label && (
        <Text position={[0, 0.4 * scale, 0]} fontSize={0.15 * scale} color="white" anchorX="center">
          {label}
        </Text>
      )}
    </group>
  )
}
```

- [ ] **Step 2: Create HBM block**

Create `src/models/tpu/HbmBlock.tsx`:

```tsx
import { Text } from '@react-three/drei'

interface HbmBlockProps {
  position?: [number, number, number]
  scale?: number
  color?: string
  stacks?: number
  label?: string
}

export default function HbmBlock({
  position = [0, 0, 0],
  scale = 1,
  color = '#8b5cf6',
  stacks = 4,
  label,
}: HbmBlockProps) {
  return (
    <group position={position}>
      {Array.from({ length: stacks }).map((_, i) => (
        <mesh key={i} position={[0, i * 0.08 * scale, 0]} scale={scale}>
          <boxGeometry args={[0.5, 0.06, 0.5]} />
          <meshStandardMaterial
            color={color}
            metalness={0.7}
            roughness={0.2}
            opacity={0.7 + i * 0.08}
            transparent
          />
        </mesh>
      ))}
      {label && (
        <Text
          position={[0, (stacks * 0.08 + 0.2) * scale, 0]}
          fontSize={0.12 * scale}
          color="white"
          anchorX="center"
        >
          {label}
        </Text>
      )}
    </group>
  )
}
```

- [ ] **Step 3: Create ICI link**

Create `src/models/tpu/IciLink.tsx`:

```tsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3, MeshStandardMaterial } from 'three'

interface IciLinkProps {
  start: [number, number, number]
  end: [number, number, number]
  color?: string
  animated?: boolean
}

export default function IciLink({
  start,
  end,
  color = '#22d3ee',
  animated = false,
}: IciLinkProps) {
  const meshRef = useRef<Mesh>(null)

  const { position, length, quaternion } = useMemo(() => {
    const s = new Vector3(...start)
    const e = new Vector3(...end)
    const mid = s.clone().add(e).multiplyScalar(0.5)
    const dir = e.clone().sub(s)
    const len = dir.length()
    dir.normalize()

    const up = new Vector3(0, 1, 0)
    const q = new THREE_Quaternion().setFromUnitVectors(up, dir)
    return { position: mid, length: len, quaternion: q }
  }, [start, end])

  useFrame((state) => {
    if (meshRef.current && animated) {
      const mat = meshRef.current.material as MeshStandardMaterial
      const t = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5
      mat.opacity = 0.3 + t * 0.7
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={[position.x, position.y, position.z]}
      quaternion={quaternion}
    >
      <cylinderGeometry args={[0.02, 0.02, length, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}
```

Note: Import `Quaternion` from three as needed — or use a simpler lookAt approach. The implementing agent should use the `lookAt` helper pattern if the quaternion approach causes issues.

- [ ] **Step 4: Create BaseTpu (board/chip base)**

Create `src/models/tpu/BaseTpu.tsx`:

```tsx
import { ReactNode } from 'react'

interface BaseTpuProps {
  children: ReactNode
  position?: [number, number, number]
  boardColor?: string
  boardSize?: [number, number, number]
}

export default function BaseTpu({
  children,
  position = [0, 0, 0],
  boardColor = '#1e293b',
  boardSize = [3, 0.1, 2],
}: BaseTpuProps) {
  return (
    <group position={position}>
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={boardSize} />
        <meshStandardMaterial color={boardColor} metalness={0.3} roughness={0.7} />
      </mesh>
      {children}
    </group>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/models/tpu/
git commit -m "feat: add TPU 3D building blocks (MXU, HBM, ICI, BaseTpu)"
```

---

### Task 10: Build Per-Generation TPU Models

**Files:**
- Create: `src/models/tpu/TpuV1.tsx` through `src/models/tpu/TpuIronwood.tsx`, `src/models/tpu/index.ts`

Each generation model composes the building blocks. Uses `RotatingGroup` from Task 8 instead of duplicating rotation logic.

- [ ] **Step 1: Create TPU v1 model (simplest — MXU only)**

Create `src/models/tpu/TpuV1.tsx`:

```tsx
import BaseTpu from './BaseTpu'
import MxuBlock from './MxuBlock'
import RotatingGroup from '../../components/three/RotatingGroup'

interface TpuV1Props {
  rotate?: boolean
}

export default function TpuV1({ rotate = false }: TpuV1Props) {
  return (
    <RotatingGroup rotate={rotate}>
      <BaseTpu boardSize={[2.5, 0.1, 1.8]}>
        <MxuBlock position={[0, 0.2, 0]} label="MXU" color="#3b82f6" />
      </BaseTpu>
    </RotatingGroup>
  )
}
```

- [ ] **Step 2: Create TPU v2 model (MXU + HBM)**

Create `src/models/tpu/TpuV2.tsx`:

```tsx
import BaseTpu from './BaseTpu'
import MxuBlock from './MxuBlock'
import HbmBlock from './HbmBlock'
import RotatingGroup from '../../components/three/RotatingGroup'

interface TpuV2Props {
  rotate?: boolean
}

export default function TpuV2({ rotate = false }: TpuV2Props) {
  return (
    <RotatingGroup rotate={rotate}>
      <BaseTpu>
        <MxuBlock position={[-0.5, 0.2, 0]} label="MXU" color="#6366f1" />
        <HbmBlock position={[0.8, 0.1, -0.4]} label="HBM" stacks={4} />
        <HbmBlock position={[0.8, 0.1, 0.4]} stacks={4} />
      </BaseTpu>
    </RotatingGroup>
  )
}
```

- [ ] **Step 3: Create remaining generation models (v3–Ironwood)**

Each model follows the same pattern using `RotatingGroup`, adding more components per generation:
- **v3**: 2x HBM stacks (stacks=8), larger board
- **v4**: MXU + HBM + ICI links showing 3D torus topology
- **v5e**: Dual MXU (Megacore), HBM
- **v5p**: Large MXU + many HBM + extra block for SparseCore + ICI
- **Trillium**: Enhanced MXU + HBM, efficiency glow indicators
- **Ironwood**: Largest model with multiple MXU, massive HBM stacks, dense ICI

Create files: `TpuV3.tsx`, `TpuV4.tsx`, `TpuV5e.tsx`, `TpuV5p.tsx`, `TpuTrillium.tsx`, `TpuIronwood.tsx`.

- [ ] **Step 4: Create model index for easy import**

Create `src/models/tpu/index.ts`:

```ts
import TpuV1 from './TpuV1'
import TpuV2 from './TpuV2'
import TpuV3 from './TpuV3'
import TpuV4 from './TpuV4'
import TpuV5e from './TpuV5e'
import TpuV5p from './TpuV5p'
import TpuTrillium from './TpuTrillium'
import TpuIronwood from './TpuIronwood'
import { ComponentType } from 'react'

export const tpuModels: Record<string, ComponentType<{ rotate?: boolean }>> = {
  v1: TpuV1,
  v2: TpuV2,
  v3: TpuV3,
  v4: TpuV4,
  v5e: TpuV5e,
  v5p: TpuV5p,
  trillium: TpuTrillium,
  ironwood: TpuIronwood,
}
```

- [ ] **Step 5: Commit**

```bash
git add src/models/tpu/
git commit -m "feat: add per-generation TPU 3D models"
```

---

### Task 11: Integrate 3D into Hero Section

**Files:**
- Modify: `src/components/sections/HeroSection.tsx`

- [ ] **Step 1: Add rotating TPU model to Hero**

Update `src/components/sections/HeroSection.tsx` to include a `Scene` with a rotating `TpuIronwood` behind the text:

```tsx
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Scene from '../three/Scene'
import TpuIronwood from '../../models/tpu/TpuIronwood'

export default function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Scene className="w-full h-full" camera={{ position: [0, 2, 5], fov: 45 }}>
          <TpuIronwood rotate />
        </Scene>
      </div>
      <div className="absolute inset-0 bg-gray-950/60" />
      <motion.div
        className="relative z-10 text-center px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {t('hero.title')}
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          {t('hero.subtitle')}
        </p>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: Verify hero renders with 3D model**

```bash
npm run dev
```

Rotating TPU model visible behind hero text.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/HeroSection.tsx
git commit -m "feat: integrate 3D TPU model into hero section"
```

---

## Chunk 4: Detail Pages & Simulations

### Task 12: Build Simulation Components

**Files:**
- Create: `src/hooks/useSimulation.ts`, `src/components/ui/SimulationControls.tsx`, `src/simulations/SystolicArraySim.tsx`, `src/simulations/DataFlowSim.tsx`

- [ ] **Step 1: Create simulation hook**

Create `src/hooks/useSimulation.ts`:

```ts
import { useState, useCallback } from 'react'

export function useSimulation() {
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  const toggle = useCallback(() => setPlaying((p) => !p), [])

  return { playing, speed, toggle, setSpeed }
}
```

- [ ] **Step 2: Create SimulationControls (all strings translated)**

Create `src/components/ui/SimulationControls.tsx`:

```tsx
import { useTranslation } from 'react-i18next'

interface SimulationControlsProps {
  playing: boolean
  speed: number
  onToggle: () => void
  onSpeedChange: (speed: number) => void
}

export default function SimulationControls({
  playing,
  speed,
  onToggle,
  onSpeedChange,
}: SimulationControlsProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2">
      <button
        onClick={onToggle}
        className="px-4 py-2 min-w-[44px] min-h-[44px] bg-blue-600 hover:bg-blue-500 rounded-lg text-sm transition-colors"
      >
        {playing ? `⏸ ${t('simulation.pause')}` : `▶ ${t('simulation.play')}`}
      </button>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">{t('simulation.speed')}:</span>
        <input
          type="range"
          min={0.25}
          max={3}
          step={0.25}
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="w-24"
          aria-label={t('simulation.speed')}
        />
        <span className="text-xs text-gray-400 w-8">{speed}x</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create Systolic Array simulation**

Create `src/simulations/SystolicArraySim.tsx`:

```tsx
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { InstancedMesh, Object3D, Color, InstancedBufferAttribute } from 'three'

interface SystolicArraySimProps {
  playing: boolean
  speed: number
  gridSize?: number
  position?: [number, number, number]
}

export default function SystolicArraySim({
  playing,
  speed,
  gridSize = 8,
  position = [0, 0, 0],
}: SystolicArraySimProps) {
  const meshRef = useRef<InstancedMesh>(null)
  const timeRef = useRef(0)
  const dummy = useMemo(() => new Object3D(), [])
  const count = gridSize * gridSize
  const colorsArray = useMemo(() => new Float32Array(count * 3), [count])
  const colorAttrRef = useRef<InstancedBufferAttribute | null>(null)

  useEffect(() => {
    if (!meshRef.current) return
    const attr = new InstancedBufferAttribute(colorsArray, 3)
    meshRef.current.geometry.setAttribute('color', attr)
    colorAttrRef.current = attr
  }, [colorsArray])

  useFrame((_, delta) => {
    if (!meshRef.current || !playing) return
    timeRef.current += delta * speed

    const activeColor = new Color('#60a5fa')
    const baseColor = new Color('#1e3a5f')

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const idx = row * gridSize + col
        const cellTime = timeRef.current - (row + col) * 0.15
        const isActive = cellTime > 0 && (cellTime % 3) < 0.5

        dummy.position.set(
          (col - gridSize / 2 + 0.5) * 0.2,
          0,
          (row - gridSize / 2 + 0.5) * 0.2
        )
        dummy.scale.setScalar(isActive ? 1.2 : 1)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(idx, dummy.matrix)

        const color = isActive ? activeColor : baseColor
        color.toArray(colorsArray, idx * 3)
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true
    if (colorAttrRef.current) {
      colorAttrRef.current.needsUpdate = true
    }
  })

  return (
    <group position={position}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[0.15, 0.05, 0.15]} />
        <meshStandardMaterial vertexColors />
      </instancedMesh>
    </group>
  )
}
```

- [ ] **Step 4: Create DataFlow simulation**

Create `src/simulations/DataFlowSim.tsx`:

```tsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, BufferGeometry, Float32BufferAttribute, PointsMaterial } from 'three'

interface DataFlowSimProps {
  playing: boolean
  speed: number
  particleCount?: number
  start?: [number, number, number]
  end?: [number, number, number]
  color?: string
}

const DEFAULT_START: [number, number, number] = [1, 0.2, 0]
const DEFAULT_END: [number, number, number] = [-0.5, 0.2, 0]

export default function DataFlowSim({
  playing,
  speed,
  particleCount = 50,
  start = DEFAULT_START,
  end = DEFAULT_END,
  color = '#a855f7',
}: DataFlowSimProps) {
  const pointsRef = useRef<Points>(null)

  const geometry = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount
      positions[i * 3] = start[0] + (end[0] - start[0]) * t
      positions[i * 3 + 1] = start[1] + (end[1] - start[1]) * t + Math.sin(t * Math.PI) * 0.2
      positions[i * 3 + 2] = start[2] + (end[2] - start[2]) * t + (Math.random() - 0.5) * 0.1
    }
    const geo = new BufferGeometry()
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
    return geo
  }, [particleCount, start[0], start[1], start[2], end[0], end[1], end[2]])

  const material = useMemo(
    () => new PointsMaterial({ color, size: 0.04, transparent: true, opacity: 0.8 }),
    [color]
  )

  useFrame((_, delta) => {
    if (!pointsRef.current || !playing) return

    const posAttr = pointsRef.current.geometry.getAttribute('position')
    const arr = posAttr.array as Float32Array
    const dx = end[0] - start[0]

    for (let i = 0; i < particleCount; i++) {
      let t = (arr[i * 3] - start[0]) / dx + delta * speed * 0.5
      if (t > 1) t = t % 1
      if (t < 0) t = 1 + (t % 1)
      arr[i * 3] = start[0] + dx * t
      arr[i * 3 + 1] = start[1] + (end[1] - start[1]) * t + Math.sin(t * Math.PI) * 0.2
    }

    posAttr.needsUpdate = true
  })

  return <points ref={pointsRef} geometry={geometry} material={material} />
}
```

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useSimulation.ts src/components/ui/SimulationControls.tsx src/simulations/
git commit -m "feat: add simulation hook, controls, systolic array and data flow simulations"
```

---

### Task 13: Build Generation Detail Page (with simulations wired in)

**Files:**
- Modify: `src/pages/Generation.tsx`

- [ ] **Step 1: Build full Generation detail page with integrated simulations**

Update `src/pages/Generation.tsx`:

```tsx
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getGeneration, generations } from '../data/generations'
import { tpuModels } from '../models/tpu'
import Scene from '../components/three/Scene'
import SimulationControls from '../components/ui/SimulationControls'
import SystolicArraySim from '../simulations/SystolicArraySim'
import DataFlowSim from '../simulations/DataFlowSim'
import { useSimulation } from '../hooks/useSimulation'
import Card from '../components/ui/Card'

export default function Generation() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const gen = getGeneration(id || '')
  const sim = useSimulation()

  if (!gen) {
    return (
      <div className="pt-24 text-center">
        <p className="text-gray-400">{t('common.notFound')}</p>
        <Link to="/" className="text-blue-400 mt-4 inline-block">
          ← {t('common.backHome')}
        </Link>
      </div>
    )
  }

  const TpuModel = tpuModels[gen.id]

  const idx = generations.findIndex((g) => g.id === gen.id)
  const prev = idx > 0 ? generations[idx - 1] : null
  const next = idx < generations.length - 1 ? generations[idx + 1] : null

  return (
    <main className="pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: gen.color }} />
            <span className="text-gray-500">{gen.year}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t(gen.nameKey)}</h1>
          <p className="text-lg text-gray-300">{t(gen.descriptionKey)}</p>
        </div>

        {/* 3D Model with simulations */}
        <div className="mb-8">
          <Scene
            className="w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden border border-gray-800"
            camera={{ position: [0, 2, 5], fov: 45 }}
            interactive
          >
            {TpuModel && <TpuModel />}
            <SystolicArraySim
              playing={sim.playing}
              speed={sim.speed}
              position={[0, 0.5, 0]}
              gridSize={6}
            />
            <DataFlowSim playing={sim.playing} speed={sim.speed} />
          </Scene>
          <div className="mt-4 flex justify-center">
            <SimulationControls
              playing={sim.playing}
              speed={sim.speed}
              onToggle={sim.toggle}
              onSpeedChange={sim.setSpeed}
            />
          </div>
        </div>

        {/* Specs */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <h2 className="text-xl font-semibold mb-4">{t('generation.specs')}</h2>
            <dl className="space-y-3">
              {gen.specs.peakTflops && (
                <div className="flex justify-between">
                  <dt className="text-gray-400">{t('generation.peakTflops')}</dt>
                  <dd className="font-mono">{gen.specs.peakTflops}</dd>
                </div>
              )}
              {gen.specs.hbmGb && (
                <div className="flex justify-between">
                  <dt className="text-gray-400">{t('generation.hbm')}</dt>
                  <dd className="font-mono">{gen.specs.hbmGb} GB</dd>
                </div>
              )}
              {gen.specs.hbmBandwidthGbps && (
                <div className="flex justify-between">
                  <dt className="text-gray-400">{t('generation.hbmBandwidth')}</dt>
                  <dd className="font-mono">{gen.specs.hbmBandwidthGbps} GB/s</dd>
                </div>
              )}
              {gen.specs.iciGbps && (
                <div className="flex justify-between">
                  <dt className="text-gray-400">{t('generation.iciBandwidth')}</dt>
                  <dd className="font-mono">{gen.specs.iciGbps} GB/s</dd>
                </div>
              )}
              {gen.specs.podSize && (
                <div className="flex justify-between">
                  <dt className="text-gray-400">{t('generation.podSize')}</dt>
                  <dd className="font-mono">{gen.specs.podSize} chips</dd>
                </div>
              )}
            </dl>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold mb-4">{t('generation.innovations')}</h2>
            <p className="text-gray-300">{t(gen.innovationsKey)}</p>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          {prev ? (
            <Link to={`/generation/${prev.id}`} className="text-blue-400 hover:text-blue-300">
              ← {t(prev.nameKey)}
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/generation/${next.id}`} className="text-blue-400 hover:text-blue-300">
              {t(next.nameKey)} →
            </Link>
          ) : <span />}
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Verify generation detail page**

```bash
npm run dev
```

Navigate to `/generation/v1`, `/generation/v4`, `/generation/ironwood`. Verify:
- 3D model renders with OrbitControls
- Play button starts systolic array + data flow animations
- Speed slider changes animation speed
- Specs display correctly with translated labels
- Prev/Next navigation works
- Language switching works for all text

- [ ] **Step 3: Commit**

```bash
git add src/pages/Generation.tsx
git commit -m "feat: build generation detail page with 3D model and simulations"
```

---

## Chunk 5: GPU Comparison Page & Deployment

### Task 14: Build GPU Model & Comparison Page

**Files:**
- Create: `src/models/gpu/CudaCoreBlock.tsx`, `src/models/gpu/GpuModel.tsx`
- Modify: `src/pages/Compare.tsx`

- [ ] **Step 1: Create CUDA core block**

Create `src/models/gpu/CudaCoreBlock.tsx`:

```tsx
interface CudaCoreBlockProps {
  position?: [number, number, number]
  scale?: number
  color?: string
}

export default function CudaCoreBlock({
  position = [0, 0, 0],
  scale = 1,
  color = '#22c55e',
}: CudaCoreBlockProps) {
  return (
    <group position={position}>
      {Array.from({ length: 16 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            ((i % 4) - 1.5) * 0.15 * scale,
            0.1 * scale,
            (Math.floor(i / 4) - 1.5) * 0.15 * scale,
          ]}
          scale={scale}
        >
          <boxGeometry args={[0.12, 0.12, 0.12]} />
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}
```

- [ ] **Step 2: Create GPU model**

Create `src/models/gpu/GpuModel.tsx`:

```tsx
import CudaCoreBlock from './CudaCoreBlock'
import RotatingGroup from '../../components/three/RotatingGroup'

interface GpuModelProps {
  rotate?: boolean
}

export default function GpuModel({ rotate = false }: GpuModelProps) {
  return (
    <RotatingGroup rotate={rotate}>
      {/* PCB */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[3, 0.1, 2]} />
        <meshStandardMaterial color="#1a2e1a" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* SM clusters */}
      <CudaCoreBlock position={[-0.7, 0, -0.4]} />
      <CudaCoreBlock position={[0.3, 0, -0.4]} />
      <CudaCoreBlock position={[-0.7, 0, 0.4]} />
      <CudaCoreBlock position={[0.3, 0, 0.4]} />
      {/* Memory modules */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[1.1, 0.05, (i - 2.5) * 0.3]}>
          <boxGeometry args={[0.3, 0.08, 0.2]} />
          <meshStandardMaterial color="#4ade80" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
    </RotatingGroup>
  )
}
```

- [ ] **Step 3: Build Compare page (all strings translated)**

Update `src/pages/Compare.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Scene from '../components/three/Scene'
import GpuModel from '../models/gpu/GpuModel'
import TpuV5p from '../models/tpu/TpuV5p'
import { performanceData } from '../data/comparisons'
import Card from '../components/ui/Card'

export default function Compare() {
  const { t } = useTranslation()

  return (
    <main className="pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          className="text-3xl md:text-4xl font-bold mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t('sections.gpuVsTpu.title')}
        </motion.h1>
        <p className="text-center text-gray-400 mb-12">
          {t('sections.gpuVsTpu.subtitle')}
        </p>

        {/* Side-by-side 3D */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div>
            <h2 className="text-xl font-semibold mb-3 text-center text-green-400">
              {t('compare.gpuLabel')}
            </h2>
            <Scene
              className="w-full h-[300px] md:h-[400px] rounded-2xl border border-gray-800"
              interactive
            >
              <GpuModel />
            </Scene>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3 text-center text-blue-400">
              {t('compare.tpuLabel')}
            </h2>
            <Scene
              className="w-full h-[300px] md:h-[400px] rounded-2xl border border-gray-800"
              interactive
            >
              <TpuV5p />
            </Scene>
          </div>
        </div>

        {/* Performance comparison bars */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-6">{t('compare.performanceTitle')}</h2>
          <p className="text-xs text-gray-500 mb-4">{t('compare.disclaimer')}</p>
          <div className="space-y-6">
            {performanceData.map((item) => {
              const max = Math.max(item.gpu, item.tpu)
              return (
                <div key={item.labelKey}>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{t(item.labelKey)}</span>
                    <span className="text-gray-500">{item.unit}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-400 w-8">{t('compare.gpuLabel')}</span>
                      <div className="flex-1 bg-gray-800 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-green-500 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${(item.gpu / max) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono w-16 text-right">{item.gpu}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-blue-400 w-8">{t('compare.tpuLabel')}</span>
                      <div className="flex-1 bg-gray-800 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${(item.tpu / max) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono w-16 text-right">{item.tpu}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Verify comparison page**

```bash
npm run dev
```

Navigate to `/compare`. Verify side-by-side 3D models, translated labels, and performance bars render.

- [ ] **Step 5: Commit**

```bash
git add src/models/gpu/ src/pages/Compare.tsx
git commit -m "feat: build GPU model and comparison page"
```

---

### Task 15: Responsive Design & Accessibility

**Files:**
- Modify: Various components for responsive breakpoints and aria attributes

- [ ] **Step 1: Audit responsive classes across all components**

Verify each component uses responsive breakpoints:
- Text sizes: `text-3xl md:text-4xl lg:text-5xl` etc.
- Grid layouts: `grid md:grid-cols-2` (stacked on mobile)
- 3D heights: `h-[300px] md:h-[500px]`
- Button sizes: min 44x44px tap targets (`min-w-[44px] min-h-[44px]`)

- [ ] **Step 2: Verify aria attributes and keyboard navigation**

- All `Scene` components have `role="img"` and `aria-label` (already done)
- Add `tabIndex={0}` to interactive 3D containers
- Verify Tab order: Header links → page content → footer
- Ensure all links and buttons are keyboard accessible

- [ ] **Step 3: Test at mobile (375px), tablet (768px), and desktop (1024px) viewports**

Use browser DevTools responsive mode. Fix any layout issues.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: responsive design and accessibility improvements"
```

---

### Task 16: Build Verification & Vercel Config

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Create Vercel SPA config**

Create `vercel.json` in project root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures React Router client-side routes work on Vercel (no 404 on direct navigation).

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 3: Preview production build**

```bash
npm run preview
```

Verify: all pages work, 3D renders, language switching works, direct URL navigation works.

- [ ] **Step 4: Fix any build errors**

Address TypeScript errors, missing imports, etc.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: add Vercel config and verify production build"
```
