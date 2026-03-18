import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface PodVisualizerProps {
  podSize?: number;
}

// A single SVG Isometric Cube Component
const Cube = ({ x, y, size = 16, delay = 0 }: { x: number, y: number, size?: number, delay?: number }) => {
  const dx = size * 0.866025; // cos(30)
  const dy = size * 0.5;      // sin(30)
  
  // Center of cube is (0,0) in local coords
  const topPoints = `0,0 ${dx},${-dy} 0,${-size} ${-dx},${-dy}`;
  const rightPoints = `0,0 ${dx},${-dy} ${dx},${size-dy} 0,${size}`;
  const leftPoints = `0,0 ${-dx},${-dy} ${-dx},${size-dy} 0,${size}`;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <motion.g 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
      >
        <polygon points={topPoints} fill="#bbf7d0" stroke="#166534" strokeWidth="1" strokeLinejoin="round" />
        <polygon points={leftPoints} fill="#86efac" stroke="#166534" strokeWidth="1" strokeLinejoin="round" />
        <polygon points={rightPoints} fill="#4ade80" stroke="#166534" strokeWidth="1" strokeLinejoin="round" />
      </motion.g>
    </g>
  );
};

export default function PodVisualizer({ podSize = 0 }: PodVisualizerProps) {
  const { t } = useTranslation();
  if (podSize === 0) return null;

  const isMassive = podSize > 256;

  // Unified SVG for both 2D and 3D Torus
  const GridTorus = ({ is3D }: { is3D: boolean }) => {
    const N = 3;
    const spacing = 45;
    const cx = 175;
    const cy = 200; // Shift down slightly

    const getPos = (i: number, j: number, k: number) => {
      // standard isometric math
      const x = cx + (i - j) * Math.cos(Math.PI / 6) * spacing;
      const y = cy + (i + j) * Math.sin(Math.PI / 6) * spacing - k * spacing;
      return { x, y, depth: i + j + k };
    };

    const elements: any[] = [];

    for (let k = 0; k < N; k++) {
      for (let j = 0; j < N; j++) {
        for (let i = 0; i < N; i++) {
          const pos = getPos(i, j, k);
          const p1 = { i, j, k, ...pos };

          elements.push({ type: 'node', depth: p1.depth, data: p1 });

          // Local links
          // X-axis (i) and Y-axis (j) links are always present
          if (i < N - 1) {
             const p2 = getPos(i + 1, j, k);
             elements.push({ type: 'edge', depth: p1.depth + 0.5, data: { p1, p2 } });
          }
          if (j < N - 1) {
             const p2 = getPos(i, j + 1, k);
             elements.push({ type: 'edge', depth: p1.depth + 0.5, data: { p1, p2 } });
          }
          // Z-axis (k) links are ONLY present in 3D Torus
          if (is3D && k < N - 1) {
             const p2 = getPos(i, j, k + 1);
             elements.push({ type: 'edge', depth: p1.depth + 0.5, data: { p1, p2 } });
          }

        }
      }
    }

    elements.sort((a, b) => a.depth - b.depth);

    return (
      <svg viewBox="0 0 350 350" className="w-[300px] h-[300px] md:w-[350px] md:h-[350px] overflow-visible">
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 1.5 }}>
          {elements.map((el, idx) => {
            if (el.type === 'edge') {
              return (
                <g key={`edge-${idx}`}>
                  <line x1={el.data.p1.x} y1={el.data.p1.y} x2={el.data.p2.x} y2={el.data.p2.y} 
                        stroke="rgba(148, 163, 184, 0.5)" strokeWidth="2" />
                  <motion.circle 
                    r="2.5" fill="#facc15"
                    initial={{ cx: el.data.p1.x, cy: el.data.p1.y, opacity: 0 }}
                    animate={{ 
                      cx: [el.data.p1.x, el.data.p2.x], 
                      cy: [el.data.p1.y, el.data.p2.y],
                      opacity: [0, 1, 1, 0]
                    }}
                    transition={{ 
                      duration: 1.5 + Math.random(), 
                      repeat: Infinity, 
                      ease: "linear",
                      delay: Math.random() * 2 
                    }}
                    style={{ filter: 'drop-shadow(0 0 3px rgba(250,204,21,0.8))' }}
                  />
                </g>
              );
            }
            if (el.type === 'node') {
              return (
                <Cube 
                  key={`node-${idx}`} 
                  x={el.data.x} 
                  y={el.data.y} 
                  size={15} 
                  delay={is3D ? el.data.depth * 0.05 : 0} 
                />
              );
            }
            return null;
          })}
        </motion.g>
      </svg>
    );
  };

  return (
    <div className="w-full h-full min-h-[450px] p-6 lg:p-8 bg-[#0f172a] rounded-3xl overflow-hidden relative border border-slate-800 shadow-2xl flex flex-col items-center">
       {/* Ambient grid background */}
       <div className="absolute inset-0 bg-[#0f172a] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

       {/* Top Badge showing stats */}
       <div className="flex flex-col z-10 w-full mb-4">
         <div className="text-slate-400 text-sm uppercase font-black tracking-widest mb-1">
           {t('generation.totalChipsTitle')}
         </div>
         <div className="text-white text-5xl md:text-6xl font-black font-mono drop-shadow-xl">
           {podSize.toLocaleString()}
         </div>
         <div className="text-slate-500 text-xs mt-2 uppercase tracking-wider font-bold">
           {isMassive ? t('generation.massiveSupercomputer') : t('generation.optimizedServerMesh')}
         </div>
       </div>

       {/* Center Visuals */}
       <div className="flex-1 w-full relative flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GridTorus is3D={isMassive} />
          </motion.div>
       </div>

       {/* Bottom Legend */}
       <div className="flex flex-col items-end z-10 w-full mt-6">
          <div className="text-blue-400 font-mono text-xs text-right animate-pulse tracking-widest">
            {isMassive ? t('generation.topology3D') : t('generation.topology2D')}
          </div>
          <div className="text-slate-400 text-[11px] text-right max-w-md mt-2 leading-relaxed break-keep">
            {isMassive ? t('generation.desc3D') : t('generation.desc2D')}
          </div>
       </div>
    </div>
  )
}
