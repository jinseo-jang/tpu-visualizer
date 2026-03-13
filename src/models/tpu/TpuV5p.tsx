import BaseTpu from './BaseTpu'
import MxuBlock from './MxuBlock'
import HbmBlock from './HbmBlock'
import IciLink from './IciLink'

export default function TpuV5p() {
  return (
    <BaseTpu>
      <MxuBlock position={[-0.4, 0.1, 0]} scale={1} color="#ec4899" emissive />
      <MxuBlock position={[0.4, 0.1, 0]} scale={1} color="#ec4899" emissive />
      {/* SparseCore */}
      <mesh position={[0, 0.1, 0.7]}>
        <boxGeometry args={[0.6, 0.15, 0.3]} />
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={0.3} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* 6x HBM stacks (large capacity) */}
      <HbmBlock position={[-1.1, 0, 0.5]} scale={0.5} stacks={8} color="#ec4899" />
      <HbmBlock position={[-1.1, 0, -0.5]} scale={0.5} stacks={8} color="#ec4899" />
      <HbmBlock position={[1.1, 0, 0.5]} scale={0.5} stacks={8} color="#ec4899" />
      <HbmBlock position={[1.1, 0, -0.5]} scale={0.5} stacks={8} color="#ec4899" />
      <HbmBlock position={[0, 0, -0.7]} scale={0.5} stacks={8} color="#ec4899" />
      <HbmBlock position={[0, 0, 0.9]} scale={0.4} stacks={6} color="#ec4899" />
      {/* ICI links */}
      <IciLink start={[-1.5, 0.3, 0]} end={[-1.5, 0.8, 0]} color="#ec4899" />
      <IciLink start={[1.5, 0.3, 0]} end={[1.5, 0.8, 0]} color="#ec4899" />
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 0.12, 1.8]} />
        <meshStandardMaterial color="#5b1a4e" metalness={0.6} roughness={0.4} />
      </mesh>
    </BaseTpu>
  )
}
