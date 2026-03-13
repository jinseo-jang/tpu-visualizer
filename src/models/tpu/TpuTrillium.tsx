import BaseTpu from './BaseTpu'
import MxuBlock from './MxuBlock'
import HbmBlock from './HbmBlock'

export default function TpuTrillium() {
  return (
    <BaseTpu>
      <MxuBlock position={[-0.4, 0.1, 0]} scale={1.1} color="#f43f5e" emissive />
      <MxuBlock position={[0.4, 0.1, 0]} scale={1.1} color="#f43f5e" emissive />
      <HbmBlock position={[-1.1, 0, 0.5]} scale={0.6} stacks={6} color="#f43f5e" />
      <HbmBlock position={[-1.1, 0, -0.5]} scale={0.6} stacks={6} color="#f43f5e" />
      <HbmBlock position={[1.1, 0, 0.5]} scale={0.6} stacks={6} color="#f43f5e" />
      <HbmBlock position={[1.1, 0, -0.5]} scale={0.6} stacks={6} color="#f43f5e" />
      {/* Energy efficiency glow ring */}
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.02, 8, 32]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 0.12, 1.8]} />
        <meshStandardMaterial color="#5c1a2e" metalness={0.6} roughness={0.4} />
      </mesh>
    </BaseTpu>
  )
}
