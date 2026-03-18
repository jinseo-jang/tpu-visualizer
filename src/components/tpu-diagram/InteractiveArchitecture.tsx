import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Props {
  activeStep: string
  hasSparseCore?: boolean
}

export default function InteractiveArchitecture({ activeStep, hasSparseCore = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect
        // Allow diagram to scale up to 1.5x on larger screens to fill space
        const newScale = Math.min(1.5, width / 850)
        setScale(newScale)
      }
    })
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const MxuCell = ({ delay }: { delay: number }) => {
    const [val, setVal] = useState(0)
    
    useEffect(() => {
      const timer = setInterval(() => {
        setVal(Math.floor(Math.random() * 99))
      }, 400 + Math.random() * 600)
      return () => clearInterval(timer)
    }, [])

    return (
      <motion.div 
        animate={{ backgroundColor: ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0.05)'] }} 
        transition={{ duration: 1.5, repeat: Infinity, delay }} 
        className="w-5 h-5 rounded-[2px] flex items-center justify-center text-[9px] font-mono text-blue-900 font-bold overflow-hidden"
      >
        {val}
      </motion.div>
    )
  }

  // Opacity for nodes based on their component tags
  const getOpacity = (tags: string[]) => {
    if (activeStep === 'overview' || activeStep === 'pipeline') {
      if (!hasSparseCore && tags.includes('sparsecore')) return 0;
      return 1;
    }
    return tags.some(tag => {
      if (activeStep === 'mxu' && tag === 'mxu') return true
      if (activeStep === 'hbm_vmem' && ['hbm', 'vmem', 'chip'].includes(tag)) return true
      if (activeStep === 'vpu_acc' && ['vpu', 'acc', 'mxu', 'vmem', 'hbm', 'chip'].includes(tag)) return true
      if (activeStep === 'ici' && ['ici', 'hbm', 'chip'].includes(tag)) return true
      if (activeStep === 'sparsecore' && ['sparsecore', 'hbm', 'vpu', 'chip'].includes(tag)) return true
      return false
    }) ? 1 : 0.2
  }

  const pulseVariant = {
    active: {
      scale: [1, 1.02, 1],
      boxShadow: ['0px 0px 0px rgba(0,0,0,0)', '0px 0px 15px rgba(59,130,246,0.5)', '0px 0px 0px rgba(0,0,0,0)'],
      transition: { duration: 1.5, repeat: Infinity }
    },
    inactive: { scale: 1, boxShadow: 'none' }
  }

  interface ArchBoxProps {
    id: string;
    label: string;
    tags: string[];
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  const ArchBox: React.FC<ArchBoxProps> = ({ label, tags, className, style, children }) => {
    const isTarget = getOpacity(tags) === 1 && activeStep !== 'overview' && activeStep !== 'pipeline'
    
    return (
      <motion.div
        className={`absolute rounded-xl flex items-center justify-center font-bold text-sm shadow-sm transition-opacity duration-500 border-2 ${className}`}
        style={{ ...style, opacity: getOpacity(tags) }}
        variants={pulseVariant}
        animate={isTarget ? 'active' : 'inactive'}
      >
        {children || label}
      </motion.div>
    )
  }

  const connections = [
    // === CPU Data Loading ===
    { id: 'host-hbm', d: "M 140 280 L 220 280 L 220 125 L 240 125", steps: ['overview'], color: '#9ca3af' },
    { id: 'host-chip', d: "M 140 260 L 200 260", steps: ['overview'], color: '#9ca3af' },

    // === Memory Transfer ===
    { id: 'hbm-vmem', d: "M 340 140 L 340 200", steps: ['hbm_vmem'], color: '#a855f7' },
    { id: 'vmem-hbm', d: "M 370 200 L 370 140", steps: ['vpu_acc'], color: '#a855f7' },

    // === Compute Pipeline ===
    { id: 'vmem-mxu', d: "M 340 240 L 340 280", steps: ['hbm_vmem', 'mxu', 'pipeline'], color: '#3b82f6' },
    { id: 'mxu-acc', d: "M 340 380 L 340 420", steps: ['vpu_acc', 'pipeline'], color: '#3b82f6' },
    { id: 'acc-vpu', d: "M 360 435 L 370 435", steps: ['vpu_acc', 'pipeline'], color: '#ef4444' },
    { id: 'vpu-vmem', d: "M 430 435 L 445 435 L 445 220 L 430 220", steps: ['vpu_acc', 'pipeline'], color: '#f97316' },

    // === Distributed Training (ICI) ===
    { id: 'hbm-ici', d: "M 650 115 L 670 115 L 670 300 L 690 300", steps: ['ici'], color: '#eab308' },
    { id: 'ici-hbm', d: "M 690 310 L 660 310 L 660 135 L 650 135", steps: ['ici'], color: '#eab308' },
    
    // === TPU Network Outward Flow ===
    { id: 'ici-out1', d: "M 770 280 L 840 280", steps: ['ici'], color: '#eab308' },
    { id: 'ici-out2', d: "M 840 320 L 770 320", steps: ['ici'], color: '#eab308' },
  ]

    if (hasSparseCore) {
      connections.push(
        // SparseCore distinct dual-flow path (Purple)
        { id: 'hbm-sct', d: "M 560 140 L 560 240", steps: ['sparsecore', 'pipeline'], color: '#a855f7' },
        { id: 'sct-hbm', d: "M 580 240 L 580 140", steps: ['sparsecore', 'pipeline'], color: '#a855f7' },
        { id: 'sct-spmem', d: "M 560 300 L 560 370", steps: ['sparsecore', 'pipeline'], color: '#a855f7' },
        { id: 'spmem-sct', d: "M 580 370 L 580 300", steps: ['sparsecore', 'pipeline'], color: '#a855f7' }
      )
    }

  return (
    <div ref={containerRef} className="w-full h-full min-h-[500px] text-gray-800 flex items-center justify-center">
      <div 
        className="relative w-[850px] h-[550px] shrink-0" 
        style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
      >
        <div className="absolute top-4 left-4 text-xs font-mono text-gray-400 bg-white px-2 py-1 rounded shadow-sm border border-gray-100 z-30">
          Google TPU Architecture
        </div>

        {/* CHIP BACKGROUND */}
        <motion.div 
          className="absolute w-[440px] h-[440px] top-[60px] left-[200px] border-2 border-dashed border-gray-300 rounded-3xl bg-gray-100/30 z-0"
          style={{ opacity: getOpacity(['chip']) }}
        >
          <span className="absolute top-3 left-4 text-xs font-semibold text-gray-400">TPU Chip</span>
        </motion.div>

        {/* HOST CPU */}
        <ArchBox 
          id="host" label="Host CPU" tags={['host']} 
          className="bg-gray-200 border-gray-400 text-gray-600 z-10"
          style={{ top: '250px', left: '40px', width: '100px', height: '60px' }} 
        />

        {/* HBM */}
        <ArchBox 
          id="hbm" label="HBM" tags={['hbm']} 
          className="bg-purple-100 border-purple-400 text-purple-700 z-10"
          style={{ top: '90px', left: '240px', width: '410px', height: '50px' }} 
        />

        {/* TENSOR CORE BACKGROUND */}
        <motion.div 
          className="absolute border-2 border-green-400 border-dashed rounded-2xl bg-green-50/80 z-0 flex flex-col items-center"
          style={{ 
            top: '180px', left: '230px', width: '230px', height: '290px', 
            opacity: getOpacity(['mxu', 'vmem', 'vpu', 'acc']) > 0.2 ? 1 : 0.2 
          }}
        >
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-green-700 uppercase tracking-widest bg-white px-2 rounded-full shadow-sm border border-green-300">TensorCore</span>
        </motion.div>

        {/* VMEM */}
        <ArchBox 
          id="vmem" label="VMEM (SRAM)" tags={['vmem']} 
          className="bg-blue-100 border-blue-400 text-blue-700 z-10"
          style={{ top: '200px', left: '250px', width: '180px', height: '40px' }} 
        />

        {/* MXU */}
        <ArchBox 
          id="mxu" label="MXU" tags={['mxu']} 
          className="bg-blue-500 border-blue-700 text-white shadow-md overflow-hidden z-10"
          style={{ top: '280px', left: '250px', width: '180px', height: '100px' }} 
        >
          <span className="relative z-10 font-bold mb-8">MXU</span>
          {/* Systolic Array Animated Grid Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-90 mt-4">
            <div className="grid grid-cols-4 gap-1.5 transform rotate-[-10deg] scale-110">
              {Array.from({length: 16}).map((_, i) => {
                const row = Math.floor(i / 4);
                const col = i % 4;
                const delay = (row + col) * 0.15;
                return <MxuCell key={i} delay={delay} />
              })}
            </div>
          </div>
        </ArchBox>

        {/* ACC */}
        <ArchBox 
          id="acc" label="Accumulators" tags={['acc']} 
          className="bg-red-100 border-red-400 text-red-700 z-10"
          style={{ top: '420px', left: '250px', width: '110px', height: '30px' }} 
        />

        {/* VPU */}
        <ArchBox 
          id="vpu" label="VPU" tags={['vpu']} 
          className="bg-orange-100 border-orange-400 text-orange-700 z-10"
          style={{ top: '420px', left: '370px', width: '60px', height: '30px' }} 
        />

        {/* ICI */}
        <ArchBox 
          id="ici" label="ICI" tags={['ici']} 
          className="bg-yellow-100 border-yellow-400 text-yellow-700 z-10"
          style={{ top: '240px', left: '690px', width: '80px', height: '120px' }} 
        />

        {/* SPARSECORE (Optional) */}
        {hasSparseCore && (
          <>
            {/* SPARSE CORE BACKGROUND */}
            <motion.div 
              className="absolute border-2 border-blue-400 border-dashed rounded-2xl bg-blue-50/80 z-0 flex flex-col items-center"
              style={{ 
                top: '180px', left: '490px', width: '160px', height: '290px', 
                opacity: getOpacity(['sparsecore']) > 0.2 ? 1 : 0.2 
              }}
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-700 uppercase tracking-widest bg-white px-2 rounded-full shadow-sm border border-blue-300">SparseCore</span>
            </motion.div>

            {/* SCT */}
            <ArchBox 
              id="sct" label="SCT" tags={['sparsecore']} 
              className="bg-green-500 border-green-700 text-white shadow-md z-10"
              style={{ top: '240px', left: '510px', width: '120px', height: '60px' }} 
            />

            {/* SPMEM */}
            <ArchBox 
              id="spmem" label="SPMEM" tags={['sparsecore']} 
              className="bg-white border-blue-300 text-slate-800 shadow-md z-10 font-[800]"
              style={{ top: '370px', left: '510px', width: '120px', height: '60px' }} 
            />
          </>
        )}

        {/* FLOWING DATA ANIMATIONS (SVG) */}
        <svg className="absolute inset-0 pointer-events-none w-[850px] h-[550px] z-20">
          {connections.map((conn) => {
            const isTarget = conn.steps.includes(activeStep) || activeStep === 'overview' || activeStep === 'pipeline'
            
            return (
              <g key={conn.id} style={{ opacity: isTarget ? 1 : 0.15 }} className="transition-opacity duration-500">
                {/* Background track */}
                <path d={conn.d} stroke={conn.color} strokeWidth="2" fill="none" opacity="0.3" strokeLinejoin="round" />
                
                {/* Moving "Data Particles" via dashed line animation */}
                {isTarget && (
                  <motion.path 
                    d={conn.d} 
                    stroke={conn.color} 
                    strokeWidth="5" 
                    fill="none" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="0.1 15"
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: -15.1 }}
                    transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                    style={{ filter: `drop-shadow(0px 0px 3px ${conn.color})` }}
                  />
                )}
              </g>
            )
          })}
        </svg>

        {/* TPU Network Mock Connections labels */}
        <div 
          className="absolute right-2 top-[260px] text-xs font-bold text-yellow-600 transition-opacity duration-500"
          style={{ opacity: ['ici', 'overview', 'pipeline'].includes(activeStep) ? 1 : 0.15 }}
        >
          TPU Network
        </div>
      </div>
    </div>
  )
}
