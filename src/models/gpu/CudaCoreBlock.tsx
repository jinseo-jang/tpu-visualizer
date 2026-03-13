interface CudaCoreBlockProps {
  position?: [number, number, number]
  scale?: number
}

export default function CudaCoreBlock({ position = [0, 0, 0], scale = 1 }: CudaCoreBlockProps) {
  const gridCols = 4
  const gridRows = 8
  const cellSize = 0.06 * scale

  return (
    <group position={position}>
      {/* SM housing */}
      <mesh>
        <boxGeometry args={[0.4 * scale, 0.2 * scale, 0.7 * scale]} />
        <meshStandardMaterial color="#22c55e" metalness={0.6} roughness={0.4} transparent opacity={0.5} />
      </mesh>
      {/* CUDA core grid */}
      {Array.from({ length: gridCols * gridRows }).map((_, i) => {
        const col = i % gridCols
        const row = Math.floor(i / gridCols)
        const x = (col - (gridCols - 1) / 2) * cellSize * 1.5
        const z = (row - (gridRows - 1) / 2) * cellSize * 1.5
        return (
          <mesh key={i} position={[x, 0.12 * scale, z]}>
            <boxGeometry args={[cellSize, 0.04 * scale, cellSize]} />
            <meshStandardMaterial
              color="#4ade80"
              emissive="#4ade80"
              emissiveIntensity={0.2}
            />
          </mesh>
        )
      })}
    </group>
  )
}
