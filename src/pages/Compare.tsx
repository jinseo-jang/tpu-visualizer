import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { performanceData } from '../data/comparisons'

function GpuDiagram() {
  return (
    <div className="relative w-full h-full bg-[#f8f9fa] rounded-xl p-4 flex flex-col items-center justify-center">
      <p className="text-sm font-semibold text-[#5f6368] mb-3" style={{ fontFamily: "'Google Sans', sans-serif" }}>
        GPU Architecture
      </p>
      <div className="grid grid-cols-8 gap-1 mb-3">
        {Array.from({ length: 64 }).map((_, i) => (
          <div key={i} className="w-3 h-3 rounded-sm bg-green-500 opacity-70" />
        ))}
      </div>
      <p className="text-xs text-[#5f6368]">CUDA Cores (thousands)</p>
      <div className="mt-2 flex gap-2">
        <div className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">GDDR/HBM</div>
        <div className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">NVLink</div>
      </div>
    </div>
  )
}

function TpuDiagram() {
  return (
    <div className="relative w-full h-full bg-[#f8f9fa] rounded-xl p-4 flex flex-col items-center justify-center">
      <p className="text-sm font-semibold text-[#5f6368] mb-3" style={{ fontFamily: "'Google Sans', sans-serif" }}>
        TPU Architecture
      </p>
      <div className="grid grid-cols-4 gap-0.5 mb-3">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="w-5 h-5 rounded-sm bg-[#4285f4] opacity-70" />
        ))}
      </div>
      <p className="text-xs text-[#5f6368]">MXU (128x128 Systolic Array)</p>
      <div className="mt-2 flex gap-2">
        <div className="px-2 py-1 rounded bg-blue-100 text-[#4285f4] text-xs">HBM + VMEM</div>
        <div className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs">ICI</div>
      </div>
    </div>
  )
}

export default function Compare() {
  const { t } = useTranslation()

  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4 text-center"
          style={{ fontFamily: "'Google Sans', sans-serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t('sections.gpuVsTpu.title')}
        </motion.h1>
        <motion.p
          className="text-[#5f6368] text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {t('sections.gpuVsTpu.subtitle')}
        </motion.p>

        {/* 2D architecture comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="rounded-2xl overflow-hidden border border-[#dadce0] bg-white shadow-sm h-64">
            <GpuDiagram />
          </div>
          <div className="rounded-2xl overflow-hidden border border-[#dadce0] bg-white shadow-sm h-64">
            <TpuDiagram />
          </div>
        </div>
        <div className="flex justify-center mb-12">
          <div className="flex gap-8 text-sm">
            <span className="text-green-600 font-medium">{t('compare.gpuLabel')} (NVIDIA H100)</span>
            <span className="text-[#4285f4] font-medium">{t('compare.tpuLabel')} (v5p)</span>
          </div>
        </div>

        {/* Performance comparison bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: "'Google Sans', sans-serif" }}>
            {t('compare.performanceTitle')}
          </h2>
          <div className="space-y-8">
            {performanceData.map((d) => {
              const max = Math.max(d.gpu, d.tpu)
              const gpuPct = (d.gpu / max) * 100
              const tpuPct = (d.tpu / max) * 100
              const gpuNarrow = gpuPct < 15
              const tpuNarrow = tpuPct < 15
              return (
                <div key={d.labelKey}>
                  <p className="text-sm text-[#5f6368] mb-3">{t(d.labelKey)}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="text-green-600 text-sm w-12">{t('compare.gpuLabel')}</span>
                      <div className="flex-1 h-8 bg-[#e8eaed] rounded-lg overflow-hidden relative">
                        <motion.div
                          className="h-full bg-green-500/80 rounded-lg flex items-center px-3"
                          style={{ minWidth: gpuNarrow ? '2rem' : undefined }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${gpuPct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8 }}
                        >
                          {!gpuNarrow && <span className="text-xs font-mono whitespace-nowrap text-white">{d.gpu} {d.unit}</span>}
                        </motion.div>
                        {gpuNarrow && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono text-[#5f6368]">{d.gpu} {d.unit}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[#4285f4] text-sm w-12">{t('compare.tpuLabel')}</span>
                      <div className="flex-1 h-8 bg-[#e8eaed] rounded-lg overflow-hidden relative">
                        <motion.div
                          className="h-full bg-[#4285f4]/80 rounded-lg flex items-center px-3"
                          style={{ minWidth: tpuNarrow ? '2rem' : undefined }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${tpuPct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                        >
                          {!tpuNarrow && <span className="text-xs font-mono whitespace-nowrap text-white">{d.tpu} {d.unit}</span>}
                        </motion.div>
                        {tpuNarrow && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono text-[#5f6368]">{d.tpu} {d.unit}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-[#9aa0a6] mt-8">{t('compare.disclaimer')}</p>
        </motion.div>

        {/* Architecture comparison */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: "'Google Sans', sans-serif" }}>
            {t('compare.architecture.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#dadce0] rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="text-green-600 font-bold">{t('compare.gpuLabel')}</h3>
              <ul className="space-y-2 text-sm text-[#5f6368]">
                <li>{t('compare.architecture.gpuApproach')}</li>
                <li>{t('compare.architecture.gpuMemory')}</li>
                <li>{t('compare.architecture.gpuScale')}</li>
              </ul>
            </div>
            <div className="bg-white border border-[#dadce0] rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="text-[#4285f4] font-bold">{t('compare.tpuLabel')}</h3>
              <ul className="space-y-2 text-sm text-[#5f6368]">
                <li>{t('compare.architecture.tpuApproach')}</li>
                <li>{t('compare.architecture.tpuMemory')}</li>
                <li>{t('compare.architecture.tpuScale')}</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
