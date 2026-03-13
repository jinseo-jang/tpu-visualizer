import HeroSection from '../components/sections/HeroSection'
import WhatIsTpuSection from '../components/sections/WhatIsTpuSection'
import CoreArchitectureSection from '../components/sections/CoreArchitectureSection'
import GenerationTimeline from '../components/sections/GenerationTimeline'
import GpuVsTpuHighlight from '../components/sections/GpuVsTpuHighlight'

export default function Home() {
  return (
    <main className="pt-16">
      <HeroSection />
      <WhatIsTpuSection />
      <CoreArchitectureSection />
      <GenerationTimeline />
      <GpuVsTpuHighlight />
    </main>
  )
}
