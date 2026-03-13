import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, MeshStandardMaterial } from 'three'

interface MxuBlockProps {
  position?: [number, number, number]
  scale?: number
  color?: string
  emissive?: boolean
}

export default function MxuBlock({ position = [0, 0, 0], scale = 1, color = '#3b82f6', emissive = false }: MxuBlockProps) {
  const ref = useRef<Mesh>(null)

  useFrame((state) => {
    if (ref.current && emissive) {
      ;(ref.current.material as MeshStandardMaterial).emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  // Systolic array grid visualization
  const gridSize = 4
  const cellSize = 0.15 * scale

  return (
    <group position={position}>
      {/* Main MXU housing */}
      <mesh ref={ref}>
        <boxGeometry args={[1.2 * scale, 0.3 * scale, 1.2 * scale]} />
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.3}
          emissive={emissive ? color : '#000000'}
          emissiveIntensity={emissive ? 0.3 : 0}
        />
      </mesh>
      {/* Systolic array cells */}
      {Array.from({ length: gridSize * gridSize }).map((_, i) => {
        const row = Math.floor(i / gridSize)
        const col = i % gridSize
        const x = (col - (gridSize - 1) / 2) * cellSize * 1.2
        const z = (row - (gridSize - 1) / 2) * cellSize * 1.2
        return (
          <mesh key={i} position={[x, 0.2 * scale, z]}>
            <boxGeometry args={[cellSize, 0.05 * scale, cellSize]} />
            <meshStandardMaterial
              color="#60a5fa"
              emissive="#60a5fa"
              emissiveIntensity={0.2}
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>
        )
      })}
    </group>
  )
}
