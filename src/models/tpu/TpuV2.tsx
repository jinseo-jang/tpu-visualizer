import BaseTpu from './BaseTpu'
import MxuBlock from './MxuBlock'
import HbmBlock from './HbmBlock'

export default function TpuV2() {
  return (
    <BaseTpu>
      {/* Dual MXU cores */}
      <MxuBlock position={[-0.4, 0.1, 0]} scale={0.8} color="#6366f1" emissive />
      <MxuBlock position={[0.4, 0.1, 0]} scale={0.8} color="#6366f1" emissive />
      {/* HBM stacks */}
      <HbmBlock position={[-1, 0, 0.5]} scale={0.7} />
      <HbmBlock position={[1, 0, 0.5]} scale={0.7} />
      {/* Chip package */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 0.12, 1.6]} />
        <meshStandardMaterial color="#1e1e5f" metalness={0.6} roughness={0.4} />
      </mesh>
    </BaseTpu>
  )
}
