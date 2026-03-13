import BaseTpu from './BaseTpu'
import MxuBlock from './MxuBlock'
import HbmBlock from './HbmBlock'

export default function TpuV5e() {
  return (
    <BaseTpu>
      {/* Megacore - single large MXU */}
      <MxuBlock position={[0, 0.1, 0]} scale={1.2} color="#d946ef" emissive />
      <HbmBlock position={[-1.1, 0, 0.5]} scale={0.6} stacks={4} color="#d946ef" />
      <HbmBlock position={[1.1, 0, 0.5]} scale={0.6} stacks={4} color="#d946ef" />
      {/* Cost efficiency indicator - smaller package */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 0.12, 1.5]} />
        <meshStandardMaterial color="#4a1d6e" metalness={0.6} roughness={0.4} />
      </mesh>
    </BaseTpu>
  )
}
