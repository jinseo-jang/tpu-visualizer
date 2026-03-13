import CudaCoreBlock from './CudaCoreBlock'

export default function GpuModel() {
  const smPositions: [number, number, number][] = [
    [-0.8, 0.1, -0.5],
    [-0.3, 0.1, -0.5],
    [0.3, 0.1, -0.5],
    [0.8, 0.1, -0.5],
    [-0.8, 0.1, 0.2],
    [-0.3, 0.1, 0.2],
    [0.3, 0.1, 0.2],
    [0.8, 0.1, 0.2],
  ]

  return (
    <group>
      {/* GPU PCB */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[2.8, 0.1, 2]} />
        <meshStandardMaterial color="#0a1a0a" metalness={0.3} roughness={0.8} />
      </mesh>
      {/* GPU die */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 0.12, 1.6]} />
        <meshStandardMaterial color="#1a3a1a" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* SMs with CUDA cores */}
      {smPositions.map((pos, i) => (
        <CudaCoreBlock key={i} position={pos} scale={0.8} />
      ))}
      {/* HBM/GDDR stacks */}
      {[-1.2, 1.2].map((x) =>
        [-0.5, 0.5].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.15, z]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color="#166534" metalness={0.5} roughness={0.4} />
          </mesh>
        ))
      )}
    </group>
  )
}
