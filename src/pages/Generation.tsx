import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { getGeneration, generations } from '../data/generations'
import { useWebGLSupport } from '../hooks/useWebGLSupport'
import { useSimulation } from '../hooks/useSimulation'
import { tpuModels } from '../models/tpu'
import Scene from '../components/three/Scene'
import RotatingGroup from '../components/three/RotatingGroup'
import SystolicArraySim from '../simulations/SystolicArraySim'
import DataFlowSim from '../simulations/DataFlowSim'
import SimulationControls from '../components/ui/SimulationControls'
import WebGLFallback from '../components/ui/WebGLFallback'

export default function Generation() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const gen = getGeneration(id || '')
  const webgl = useWebGLSupport()
  const sim = useSimulation()

  if (!gen) {
    return (
      <div className="pt-24 text-center">
        <p className="text-gray-400">{t('common.notFound')}</p>
        <Link to="/" className="text-blue-400 hover:underline mt-4 inline-block">
          {t('common.backHome')}
        </Link>
      </div>
    )
  }

  const TpuModel = tpuModels[gen.id]
  const currentIndex = generations.findIndex((g) => g.id === gen.id)
  const prev = currentIndex > 0 ? generations[currentIndex - 1] : null
  const next = currentIndex < generations.length - 1 ? generations[currentIndex + 1] : null

  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          key={gen.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-2">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-300">
              ← {t('common.backHome')}
            </Link>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm text-gray-500">{gen.year}</span>
            <h1 className="text-4xl md:text-5xl font-bold" style={{ color: gen.color }}>
              {t(gen.nameKey)}
            </h1>
          </div>

          <p className="text-lg text-gray-400 leading-relaxed mb-12">
            {t(gen.descriptionKey)}
          </p>

          {/* 3D Model */}
          <div className="rounded-2xl overflow-hidden border border-gray-800 h-80 mb-4">
            {webgl && TpuModel ? (
              <Scene interactive>
                <RotatingGroup speed={0.15}>
                  <TpuModel />
                </RotatingGroup>
                <DataFlowSim playing={sim.playing} speed={sim.speed} />
                <SystolicArraySim playing={sim.playing} speed={sim.speed} size={4} />
              </Scene>
            ) : (
              <WebGLFallback label={gen.name} />
            )}
          </div>

          <div className="flex justify-center mb-12">
            <SimulationControls
              playing={sim.playing}
              speed={sim.speed}
              onToggle={sim.toggle}
              onSpeedChange={sim.setSpeed}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">{t('generation.specs')}</h2>
              <dl className="space-y-3">
                {gen.specs.peakTflops != null && (
                  <div className="flex justify-between">
                    <dt className="text-gray-400">{t('generation.peakTflops')}</dt>
                    <dd className="font-mono">{gen.specs.peakTflops}</dd>
                  </div>
                )}
                {gen.specs.hbmGb != null && (
                  <div className="flex justify-between">
                    <dt className="text-gray-400">{t('generation.hbm')}</dt>
                    <dd className="font-mono">{gen.specs.hbmGb} GB</dd>
                  </div>
                )}
                {gen.specs.hbmBandwidthGbps != null && (
                  <div className="flex justify-between">
                    <dt className="text-gray-400">{t('generation.hbmBandwidth')}</dt>
                    <dd className="font-mono">{gen.specs.hbmBandwidthGbps} GB/s</dd>
                  </div>
                )}
                {gen.specs.iciGbps != null && (
                  <div className="flex justify-between">
                    <dt className="text-gray-400">{t('generation.iciBandwidth')}</dt>
                    <dd className="font-mono">{gen.specs.iciGbps} Gbps</dd>
                  </div>
                )}
                {gen.specs.podSize != null && (
                  <div className="flex justify-between">
                    <dt className="text-gray-400">{t('generation.podSize')}</dt>
                    <dd className="font-mono">{gen.specs.podSize.toLocaleString()} chips</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">{t('generation.innovations')}</h2>
              <p className="text-gray-400 leading-relaxed">{t(gen.innovationsKey)}</p>
            </div>
          </div>

          <div className="flex justify-between">
            {prev ? (
              <Link
                to={`/generation/${prev.id}`}
                className="text-sm hover:underline"
                style={{ color: prev.color }}
              >
                ← {t(prev.nameKey)}
              </Link>
            ) : <span />}
            {next ? (
              <Link
                to={`/generation/${next.id}`}
                className="text-sm hover:underline"
                style={{ color: next.color }}
              >
                {t(next.nameKey)} →
              </Link>
            ) : <span />}
          </div>
        </motion.div>
      </div>
    </main>
  )
}
