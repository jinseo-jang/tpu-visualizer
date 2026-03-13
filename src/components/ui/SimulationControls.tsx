import { useTranslation } from 'react-i18next'

interface SimulationControlsProps {
  playing: boolean
  speed: number
  onToggle: () => void
  onSpeedChange: (speed: number) => void
}

export default function SimulationControls({ playing, speed, onToggle, onSpeedChange }: SimulationControlsProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2">
      <button
        onClick={onToggle}
        className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded transition-colors"
      >
        {playing ? t('simulation.pause') : t('simulation.play')}
      </button>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">{t('simulation.speed')}</span>
        <input
          type="range"
          min={0.25}
          max={3}
          step={0.25}
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="w-24 accent-blue-500"
        />
        <span className="text-xs text-gray-400 font-mono w-8">{speed}x</span>
      </div>
    </div>
  )
}
