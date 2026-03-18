import HeroSection from '../components/sections/HeroSection'
import WhatIsTpuSection from '../components/sections/WhatIsTpuSection'
import SystolicArrayDemo from '../components/sections/SystolicArrayDemo'
import TpuCoreFeatures from '../components/sections/TpuCoreFeatures'
import TpuScrollytelling from '../components/tpu-diagram/TpuScrollytelling'
import GenerationTimeline from '../components/sections/GenerationTimeline'
import GpuVsTpuHighlight from '../components/sections/GpuVsTpuHighlight'

export default function Home() {
  return (
    <main className="pt-16">
      <HeroSection />
      <WhatIsTpuSection />
      <TpuCoreFeatures />
      <SystolicArrayDemo />
      <TpuScrollytelling />
      <GenerationTimeline />
      <GpuVsTpuHighlight />
    </main>
  )
}
