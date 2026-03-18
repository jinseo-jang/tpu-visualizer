import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const SystolicAnim = () => (
  <svg viewBox="0 0 100 100" className="w-full h-32 mb-6">
    {[0, 1, 2, 3].map(row => 
      [0, 1, 2, 3].map(col => (
        <motion.rect 
          key={`${row}-${col}`} 
          x={25 + col * 14} y={25 + row * 14} 
          width="8" height="8" rx="1"
          fill="#eff6ff" stroke="#3b82f6" strokeWidth="1"
          animate={{ fill: ["#eff6ff", "#93c5fd", "#eff6ff"] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: (row + col) * 0.15 }}
        />
      ))
    )}
  </svg>
)

const PodAnim = () => {
  const size = 18;
  const dx = size * 0.866025; // cos(30)
  const dy = size * 0.5;      // sin(30)
  const x = 50, y = 45;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-32 mb-6 overflow-visible">
      {/* 2x2 grid of isometric cubes */}
      {[
        { i: 0, j: 0, delay: 0 },
        { i: 1, j: 0, delay: 0.2 },
        { i: 0, j: 1, delay: 0.2 },
        { i: 1, j: 1, delay: 0.4 }
      ].map(({i, j, delay}) => {
        const cx = x + (i - j) * dx * 1.5;
        const cy = y + (i + j) * dy * 1.2;
        const top = `0,0 ${dx},${-dy} 0,${-size} ${-dx},${-dy}`;
        const right = `0,0 ${dx},${-dy} ${dx},${size-dy} 0,${size}`;
        const left = `0,0 ${-dx},${-dy} ${-dx},${size-dy} 0,${size}`;
        
        return (
          <g key={`${i}-${j}`} transform={`translate(${cx}, ${cy})`}>
            <motion.g 
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: [0, -4, 0], opacity: 1 }}
              transition={{ delay, duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <polygon points={top} fill="#93c5fd" stroke="#1d4ed8" strokeWidth="1" strokeLinejoin="round" />
              <polygon points={left} fill="#60a5fa" stroke="#1d4ed8" strokeWidth="1" strokeLinejoin="round" />
              <polygon points={right} fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" strokeLinejoin="round" />
            </motion.g>
          </g>
        )
      })}
    </svg>
  )
}

const IciAnim = () => (
  <svg viewBox="0 0 100 100" className="w-full h-32 mb-6">
    <rect x="10" y="30" width="25" height="40" rx="4" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
    <rect x="65" y="30" width="25" height="40" rx="4" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
    <motion.path d="M 35 40 Q 50 20 65 40" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 5" animate={{ strokeDashoffset: [20, 0] }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }} />
    <motion.path d="M 65 60 Q 50 80 35 60" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 5" animate={{ strokeDashoffset: [-20, 0] }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }} />
    <motion.circle cx="50" cy="30" r="4" fill="#ea580c" animate={{ cx: [35, 65] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }} />
    <motion.circle cx="50" cy="70" r="4" fill="#ea580c" animate={{ cx: [65, 35] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
  </svg>
)

const SparseCoreAnim = () => (
  <svg viewBox="0 0 100 100" className="w-full h-32 mb-6">
    {/* Background Grid representing HBM / Sparse Memory Space */}
    <g stroke="#e9d5ff" strokeWidth="1" opacity="0.5">
      {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(y => <line key={`h${y}`} x1="0" y1={y} x2="40" y2={y} />)}
      {[10, 20, 30, 40].map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100" />)}
    </g>

    {/* Scattered Data Points blinking in the Sparse Memory */}
    {[
      {x: 15, y: 15, delay: 0}, {x: 35, y: 25, delay: 0.3},
      {x: 5, y: 45, delay: 0.6}, {x: 25, y: 65, delay: 0.9},
      {x: 15, y: 85, delay: 1.2}, {x: 35, y: 95, delay: 1.5}
    ].map((pt, i) => (
      <motion.circle key={`pt${i}`} cx={pt.x} cy={pt.y} r="2" fill="#a855f7"
        animate={{ opacity: [0, 1, 0, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: pt.delay }}
      />
    ))}

    {/* SCT (Sparse Computation Tensor) Central Unit */}
    <rect x="55" y="35" width="35" height="30" rx="4" fill="#f3e8ff" stroke="#9333ea" strokeWidth="2" />
    <text x="72.5" y="54" fontSize="10" textAnchor="middle" fill="#7e22ce" fontWeight="bold">SCT</text>

    {/* Gathering Paths from Memory to SCT */}
    {[
      {sx: 15, sy: 15, ex: 55, ey: 40, delay: 0},
      {sx: 35, sy: 25, ex: 55, ey: 45, delay: 0.3},
      {sx: 5, sy: 45, ex: 55, ey: 50, delay: 0.6},
      {sx: 25, sy: 65, ex: 55, ey: 55, delay: 0.9},
      {sx: 15, sy: 85, ex: 55, ey: 60, delay: 1.2}
    ].map((pth, i) => (
      <g key={`path${i}`}>
        <path d={`M ${pth.sx} ${pth.sy} Q 40 ${pth.sy} ${pth.ex} ${pth.ey}`} fill="none" stroke="#d8b4fe" strokeWidth="1" strokeDasharray="2 2" />
        <motion.circle r="2" fill="#9333ea"
          animate={{ cx: [pth.sx, pth.ex], cy: [pth.sy, pth.ey], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: pth.delay, ease: "easeOut" }}
        />
      </g>
    ))}
    
    {/* Dense Output to MXU */}
    <motion.path d="M 90 50 L 100 50" stroke="#7e22ce" strokeWidth="3"
      animate={{ opacity: [0.2, 1, 0.2] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
  </svg>
)

const HbmAnim = () => (
  <svg viewBox="0 0 100 100" className="w-full h-32 mb-6">
    {[0, 1, 2, 3].map((i) => (
      <motion.g key={i} initial={{ y: 0 }} animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}>
        <path d={`M 20 ${70 - i * 12} L 50 ${80 - i * 12} L 80 ${70 - i * 12} L 50 ${60 - i * 12} Z`} fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
        <path d={`M 20 ${70 - i * 12} L 50 ${80 - i * 12} L 50 ${86 - i * 12} L 20 ${76 - i * 12} Z`} fill="#a7f3d0" stroke="#10b981" strokeWidth="2" />
        <path d={`M 80 ${70 - i * 12} L 50 ${80 - i * 12} L 50 ${86 - i * 12} L 80 ${76 - i * 12} Z`} fill="#6ee7b7" stroke="#10b981" strokeWidth="2" />
      </motion.g>
    ))}
    <motion.path d="M 50 20 L 50 0" stroke="#059669" strokeWidth="4" strokeDasharray="4 4" animate={{ strokeDashoffset: [8, 0] }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }} />
  </svg>
)

export default function TpuCoreFeatures() {
  const { t } = useTranslation()

  const features = [
    {
      id: "systolic",
      anim: SystolicAnim,
      color: "border-sky-200 hover:border-sky-500",
      titleKey: "sections.coreFeatures.systolic.title",
      descKey: "sections.coreFeatures.systolic.desc",
    },
    {
      id: "pod",
      anim: PodAnim,
      color: "border-blue-200 hover:border-blue-500",
      titleKey: "sections.coreFeatures.pod.title",
      descKey: "sections.coreFeatures.pod.desc",
    },
    {
      id: "ici",
      anim: IciAnim,
      color: "border-amber-200 hover:border-amber-500",
      titleKey: "sections.coreFeatures.ici.title",
      descKey: "sections.coreFeatures.ici.desc",
    },
    {
      id: "sparsecore",
      anim: SparseCoreAnim,
      color: "border-purple-200 hover:border-purple-500",
      titleKey: "sections.coreFeatures.sparsecore.title",
      descKey: "sections.coreFeatures.sparsecore.desc",
    },
    {
      id: "hbm",
      anim: HbmAnim,
      color: "border-emerald-200 hover:border-emerald-500",
      titleKey: "sections.coreFeatures.hbm.title",
      descKey: "sections.coreFeatures.hbm.desc",
    }
  ]

  return (
    <section className="py-20 px-4 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {t('sections.coreFeatures.title', 'TPU 5대 핵심 아키텍처')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            {t('sections.coreFeatures.subtitle', '거대 AI 모델의 병목을 부수는 구글의 5가지 파괴적 하드웨어 혁신을 소개합니다.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.id}
              className={`bg-gray-50 rounded-2xl p-6 border-2 transition-all duration-300 shadow-sm hover:shadow-xl group bg-gradient-to-b from-white to-gray-50/50 ${feature.color}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
            >
              <feature.anim />
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center transition-colors whitespace-pre-line">
                {t(feature.titleKey)}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm text-center">
                {t(feature.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
