import BaseTpu from './BaseTpu'
import MxuBlock from './MxuBlock'
import HbmBlock from './HbmBlock'
import IciLink from './IciLink'

export default function TpuIronwood() {
  return (
    <BaseTpu scale={0.9}>
      {/* Quad MXU cores */}
      <MxuBlock position={[-0.5, 0.1, -0.3]} scale={0.8} color="#ef4444" emissive />
      <MxuBlock position={[0.5, 0.1, -0.3]} scale={0.8} color="#ef4444" emissive />
      <MxuBlock position={[-0.5, 0.1, 0.3]} scale={0.8} color="#ef4444" emissive />
      <MxuBlock position={[0.5, 0.1, 0.3]} scale={0.8} color="#ef4444" emissive />
      {/* 8x HBM stacks (192GB) */}
      <HbmBlock position={[-1.2, 0, 0.6]} scale={0.45} stacks={10} color="#ef4444" />
      <HbmBlock position={[-1.2, 0, -0.6]} scale={0.45} stacks={10} color="#ef4444" />
      <HbmBlock position={[1.2, 0, 0.6]} scale={0.45} stacks={10} color="#ef4444" />
      <HbmBlock position={[1.2, 0, -0.6]} scale={0.45} stacks={10} color="#ef4444" />
      <HbmBlock position={[-0.6, 0, 0.9]} scale={0.45} stacks={10} color="#ef4444" />
      <HbmBlock position={[0.6, 0, 0.9]} scale={0.45} stacks={10} color="#ef4444" />
      <HbmBlock position={[-0.6, 0, -0.9]} scale={0.45} stacks={10} color="#ef4444" />
      <HbmBlock position={[0.6, 0, -0.9]} scale={0.45} stacks={10} color="#ef4444" />
      {/* Next-gen ICI links */}
      <IciLink start={[-1.5, 0.3, 0]} end={[-1.5, 1, 0]} color="#ef4444" />
      <IciLink start={[1.5, 0.3, 0]} end={[1.5, 1, 0]} color="#ef4444" />
      <IciLink start={[0, 0.3, -1.2]} end={[0, 1, -1.2]} color="#ef4444" />
      <IciLink start={[0, 0.3, 1.2]} end={[0, 1, 1.2]} color="#ef4444" />
      <IciLink start={[-1.5, 1, 0]} end={[1.5, 1, 0]} color="#ef4444" />
      <IciLink start={[0, 1, -1.2]} end={[0, 1, 1.2]} color="#ef4444" />
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.5, 0.14, 2.2]} />
        <meshStandardMaterial color="#5c1a1a" metalness={0.6} roughness={0.4} />
      </mesh>
    </BaseTpu>
  )
}
