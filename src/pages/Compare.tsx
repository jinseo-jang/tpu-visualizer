import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { performanceData } from '../data/comparisons'
import { useWebGLSupport } from '../hooks/useWebGLSupport'
import { useSimulation } from '../hooks/useSimulation'
import Scene from '../components/three/Scene'
import RotatingGroup from '../components/three/RotatingGroup'
import GpuModel from '../models/gpu/GpuModel'
import { TpuV5p } from '../models/tpu'
import SystolicArraySim from '../simulations/SystolicArraySim'
import SimulationControls from '../components/ui/SimulationControls'

export default function Compare() {
  const { t } = useTranslation()
  const webgl = useWebGLSupport()
  const sim = useSimulation()

  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t('sections.gpuVsTpu.title')}
        </motion.h1>
        <motion.p
          className="text-gray-400 text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {t('sections.gpuVsTpu.subtitle')}
        </motion.p>

        {/* 3D comparison */}
        {webgl && (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div className="rounded-2xl overflow-hidden border border-gray-800 h-72">
                <Scene interactive>
                  <RotatingGroup speed={0.15}>
                    <GpuModel />
                  </RotatingGroup>
                </Scene>
              </div>
              <div className="rounded-2xl overflow-hidden border border-gray-800 h-72">
                <Scene interactive>
                  <RotatingGroup speed={0.15}>
                    <TpuV5p />
                  </RotatingGroup>
                  <SystolicArraySim playing={sim.playing} speed={sim.speed} size={4} />
                </Scene>
              </div>
            </div>
            <div className="flex justify-center mb-4">
              <div className="flex gap-8 text-sm">
                <span className="text-green-400">{t('compare.gpuLabel')} (NVIDIA H100)</span>
                <span className="text-blue-400">{t('compare.tpuLabel')} (v5p)</span>
              </div>
            </div>
            <div className="flex justify-center mb-16">
              <SimulationControls
                playing={sim.playing}
                speed={sim.speed}
                onToggle={sim.toggle}
                onSpeedChange={sim.setSpeed}
              />
            </div>
          </>
        )}

        {/* Performance comparison bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-8">{t('compare.performanceTitle')}</h2>
          <div className="space-y-8">
            {performanceData.map((d) => {
              const max = Math.max(d.gpu, d.tpu)
              return (
                <div key={d.labelKey}>
                  <p className="text-sm text-gray-400 mb-3">{t(d.labelKey)}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="text-green-400 text-sm w-12">{t('compare.gpuLabel')}</span>
                      <div className="flex-1 h-8 bg-gray-800 rounded-lg overflow-hidden">
                        <motion.div
                          className="h-full bg-green-500/80 rounded-lg flex items-center px-3"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(d.gpu / max) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8 }}
                        >
                          <span className="text-xs font-mono whitespace-nowrap">{d.gpu} {d.unit}</span>
                        </motion.div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-blue-400 text-sm w-12">{t('compare.tpuLabel')}</span>
                      <div className="flex-1 h-8 bg-gray-800 rounded-lg overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-500/80 rounded-lg flex items-center px-3"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(d.tpu / max) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                        >
                          <span className="text-xs font-mono whitespace-nowrap">{d.tpu} {d.unit}</span>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-600 mt-8">{t('compare.disclaimer')}</p>
        </motion.div>

        {/* Architecture comparison */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold mb-8">{t('compare.architecture.title')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-green-400 font-bold">{t('compare.gpuLabel')}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>{t('compare.architecture.gpuApproach')}</li>
                <li>{t('compare.architecture.gpuMemory')}</li>
                <li>{t('compare.architecture.gpuScale')}</li>
              </ul>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-blue-400 font-bold">{t('compare.tpuLabel')}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
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
