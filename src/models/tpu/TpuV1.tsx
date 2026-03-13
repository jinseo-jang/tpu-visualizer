import BaseTpu from './BaseTpu'
import MxuBlock from './MxuBlock'

export default function TpuV1() {
  return (
    <BaseTpu>
      <MxuBlock position={[0, 0.1, 0]} color="#3b82f6" emissive />
      {/* Simple chip package */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.15, 1.5]} />
        <meshStandardMaterial color="#1e3a5f" metalness={0.6} roughness={0.4} />
      </mesh>
    </BaseTpu>
  )
}
