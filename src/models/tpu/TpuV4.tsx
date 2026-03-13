import BaseTpu from './BaseTpu'
import MxuBlock from './MxuBlock'
import HbmBlock from './HbmBlock'
import IciLink from './IciLink'

export default function TpuV4() {
  return (
    <BaseTpu>
      <MxuBlock position={[-0.4, 0.1, 0]} scale={0.9} color="#a855f7" emissive />
      <MxuBlock position={[0.4, 0.1, 0]} scale={0.9} color="#a855f7" emissive />
      <HbmBlock position={[-1.1, 0, 0.5]} scale={0.6} stacks={6} />
      <HbmBlock position={[-1.1, 0, -0.5]} scale={0.6} stacks={6} />
      <HbmBlock position={[1.1, 0, 0.5]} scale={0.6} stacks={6} />
      <HbmBlock position={[1.1, 0, -0.5]} scale={0.6} stacks={6} />
      {/* ICI links - 3D torus topology preview */}
      <IciLink start={[-1.5, 0.3, 0]} end={[-1.5, 0.8, 0]} color="#f59e0b" />
      <IciLink start={[1.5, 0.3, 0]} end={[1.5, 0.8, 0]} color="#f59e0b" />
      <IciLink start={[0, 0.3, -1]} end={[0, 0.8, -1]} color="#f59e0b" />
      <IciLink start={[0, 0.3, 1]} end={[0, 0.8, 1]} color="#f59e0b" />
      {/* OCS indicator */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 0.12, 1.7]} />
        <meshStandardMaterial color="#3b1d7a" metalness={0.6} roughness={0.4} />
      </mesh>
    </BaseTpu>
  )
}
