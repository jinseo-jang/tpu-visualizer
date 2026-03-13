# TPU Visualizer — Design Spec

## Overview

An interactive educational website that visualizes TPU (Tensor Processing Unit) architecture and concepts in 3D. Users can explore TPU internals, watch data flow simulations, compare TPU vs GPU architectures, and learn how TPUs evolved from v1 to Ironwood across generations.

**Target audience:** ML/AI beginners through intermediate developers — covers fundamentals to deep architecture details.

**Languages:** Korean + English (i18next)

## Site Structure

### Navigation: Hybrid

- **Main page** (`/`): Scroll-based timeline storytelling
- **Detail pages**: Per-generation deep dives and GPU comparison

### Page Map

**Main Page (`/`)** — sequential scroll sections:

1. **Hero** — Rotating 3D TPU model with title "TPU의 모든 것을 이해하다" / "Understanding Everything About TPUs"
2. **What is a TPU?** — TPU basics: what is an ASIC, why Google built TPUs
3. **Core Architecture** — MXU (Systolic Array), HBM, ICI overview with 3D previews
4. **Generation Timeline** — v1 → Ironwood scroll-driven 3D transitions. Each generation card links to its detail page.
5. **GPU vs TPU Highlight** — Key architectural differences summary + link to full comparison
6. **Footer** — References, credits

**Detail Pages:**

- `/generation/:id` — Per-generation detail (v1, v2, v3, v4, v5e, v5p, trillium, ironwood)
  - Full 3D interactive model with OrbitControls
  - Data flow simulation with play/pause/speed controls
  - Specs, innovations, improvements over previous generation
- `/compare` — GPU vs TPU comparison
  - Side-by-side 3D architecture (CUDA Core/SM vs MXU/Systolic Array)
  - Simultaneous matrix operation simulation on both architectures
  - Spec/performance comparison charts

## 3D Visualization Design

### Engine

- React Three Fiber (R3F) + Drei helpers
- Programmatic 3D models (built in code, no external model files)
- Low-poly style for performance

### Main Page 3D

- Scroll-position-driven animation: TPU model morphs as user scrolls through generations
- Key components highlight on each generation transition
- Lightweight rendering — simplified geometry

### Detail Page 3D (Simulation)

- **Interactive exploration:** Rotate/zoom via OrbitControls, click components for info panels
- **Data flow simulation:** Particle/line animations showing:
  - Matrix data flowing through Systolic Array in MXU
  - Data movement between HBM ↔ MXU
  - Inter-chip communication via ICI (Pod scale)
- **Controls:** Play/pause, speed slider

### GPU Comparison Page 3D

- Split-screen: GPU structure (left) vs TPU structure (right)
- Synchronized simulation of the same matrix operation on both architectures

### Performance Optimization

- Lazy loading: 3D scenes load only when entering detail pages
- LOD (Level of Detail): Simplified models on zoom-out
- Mobile: Reduced simulation complexity automatically

## Generation Content

| Generation | Year | Key Topics | 3D Visualization Focus |
|------------|------|-----------|----------------------|
| **v1** | 2015 | First TPU, inference only, 8-bit integer, Systolic Array introduction | Basic matrix multiply animation in Systolic Array |
| **v2** | 2017 | Training support, bfloat16, HBM, first Pod (64 chips) | HBM ↔ MXU data flow + Pod connection structure |
| **v3** | 2018 | 2x HBM, liquid cooling, 1024-chip Pod | Pod scale expansion, liquid cooling structure |
| **v4** | 2021 | 4096-chip Pod, 3D torus ICI topology, Optical Circuit Switching | 3D torus network topology visualization |
| **v5e** | 2023 | Cost efficiency, training+inference, Megacore | Megacore structure, cost-performance charts |
| **v5p** | 2023 | Largest scale training, 8960-chip Pod, SparseCores | SparseCore operation, large-scale Pod |
| **Trillium (v6e)** | 2024 | Energy efficiency, per-chip performance improvement | Energy efficiency comparison, performance gains |
| **Ironwood** | 2025 | Latest generation, maximum scale and performance | Comprehensive comparison + latest architecture detail |

**Content depth:**
- v1–v3: Concept-focused, 1–2 key visualizations each
- v4–Ironwood: Detailed architecture + data flow simulation + spec comparison

## GPU vs TPU Comparison Content

- **Architecture:** CUDA Core vs Systolic Array computation model
- **Memory:** GPU HBM/GDDR vs TPU HBM structure
- **Scaling:** NVLink/NVSwitch vs ICI interconnect
- **Performance/Cost charts:** Based on major ML workloads

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18 + TypeScript |
| 3D | React Three Fiber + Drei |
| Routing | React Router |
| Animation | Framer Motion |
| i18n | i18next + react-i18next |
| State | Zustand |
| Build | Vite |
| Styling | Tailwind CSS |

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer, LanguageSwitcher
│   ├── ui/              # Common UI (Button, Card, Slider, etc.)
│   ├── three/           # Common 3D components (Scene, Controls, Particles)
│   └── sections/        # Main page section components
├── pages/
│   ├── Home.tsx         # Main page
│   ├── Generation.tsx   # Per-generation detail page
│   └── Compare.tsx      # GPU vs TPU comparison page
├── models/
│   ├── tpu/             # Per-generation TPU 3D model components
│   └── gpu/             # GPU 3D model components
├── simulations/         # Data flow simulation logic
├── data/
│   ├── generations.ts   # Per-generation specs/descriptions
│   └── comparisons.ts   # GPU vs TPU comparison data
├── i18n/
│   ├── ko/              # Korean translations
│   └── en/              # English translations
├── hooks/               # Custom hooks (useScrollPosition, etc.)
├── stores/              # Zustand stores
└── App.tsx
```

## Responsive Design

- **Desktop (1024px+):** Full 3D simulation, side-by-side comparison layout
- **Tablet (768–1023px):** 3D retained with reduced particle count, comparison stacked vertically
- **Mobile (<768px):** Simplified 3D models, touch gestures for rotate/zoom, auto-play simulation mode

## Accessibility

- Text alternatives (aria-label) for all 3D visualizations
- Static image + text fallback when 3D is unsupported
- Keyboard navigation (Tab between components, Enter to interact)
- WCAG AA color contrast compliance

## Performance Targets

- Main page initial load: under 3 seconds (3D assets lazy loaded)
- Detail page transition: under 1 second
- Lighthouse performance score: 80+
