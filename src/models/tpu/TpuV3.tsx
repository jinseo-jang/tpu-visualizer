import BaseTpu from './BaseTpu'
import MxuBlock from './MxuBlock'
import HbmBlock from './HbmBlock'

export default function TpuV3() {
  return (
    <BaseTpu>
      <MxuBlock position={[-0.4, 0.1, 0]} scale={0.9} color="#8b5cf6" emissive />
      <MxuBlock position={[0.4, 0.1, 0]} scale={0.9} color="#8b5cf6" emissive />
      {/* 4x HBM stacks (doubled) */}
      <HbmBlock position={[-1.1, 0, 0.5]} scale={0.6} stacks={6} />
      <HbmBlock position={[-1.1, 0, -0.5]} scale={0.6} stacks={6} />
      <HbmBlock position={[1.1, 0, 0.5]} scale={0.6} stacks={6} />
      <HbmBlock position={[1.1, 0, -0.5]} scale={0.6} stacks={6} />
      {/* Liquid cooling plate */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[2.2, 0.05, 1.8]} />
        <meshStandardMaterial color="#0ea5e9" metalness={0.8} roughness={0.2} transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 0.12, 1.7]} />
        <meshStandardMaterial color="#2d1b69" metalness={0.6} roughness={0.4} />
      </mesh>
    </BaseTpu>
  )
}
