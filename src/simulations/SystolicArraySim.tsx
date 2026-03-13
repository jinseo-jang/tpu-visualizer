import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Mesh, MeshStandardMaterial } from 'three'

interface SystolicArraySimProps {
  playing?: boolean
  speed?: number
  size?: number
}

export default function SystolicArraySim({ playing = true, speed = 1, size = 4 }: SystolicArraySimProps) {
  const groupRef = useRef<Group>(null)
  const cellRefs = useRef<(Mesh | null)[]>([])
  const timeRef = useRef(0)

  const cellSize = 0.3
  const gap = 0.35

  const cells = useMemo(() => {
    return Array.from({ length: size * size }, (_, i) => ({
      row: Math.floor(i / size),
      col: i % size,
    }))
  }, [size])

  useFrame((_, delta) => {
    if (!playing) return
    timeRef.current += delta * speed

    const t = timeRef.current
    cells.forEach((cell, i) => {
      const mesh = cellRefs.current[i]
      if (!mesh) return
      // Diagonal wave: data flows from top-left to bottom-right
      const wave = cell.row + cell.col
      const phase = (t * 2 - wave * 0.5) % (size * 2)
      const active = phase >= 0 && phase < 1.5
      const mat = mesh.material as MeshStandardMaterial
      mat.emissiveIntensity = active ? 0.8 : 0.1
      mesh.scale.y = active ? 1.5 : 1
    })
  })

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      {cells.map((cell, i) => {
        const x = (cell.col - (size - 1) / 2) * gap
        const z = (cell.row - (size - 1) / 2) * gap
        return (
          <mesh
            key={i}
            ref={(el) => { cellRefs.current[i] = el }}
            position={[x, 0, z]}
          >
            <boxGeometry args={[cellSize, 0.1, cellSize]} />
            <meshStandardMaterial
              color="#3b82f6"
              emissive="#60a5fa"
              emissiveIntensity={0.1}
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>
        )
      })}
      {/* Input arrows - left side */}
      {Array.from({ length: size }).map((_, i) => (
        <mesh key={`left-${i}`} position={[-(size / 2) * gap - 0.3, 0, (i - (size - 1) / 2) * gap]}>
          <coneGeometry args={[0.08, 0.2, 4]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.3} />
        </mesh>
      ))}
      {/* Input arrows - top side */}
      {Array.from({ length: size }).map((_, i) => (
        <mesh key={`top-${i}`} position={[(i - (size - 1) / 2) * gap, 0, -(size / 2) * gap - 0.3]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.08, 0.2, 4]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.3} />
        </mesh>
      ))}
    </group>
  )
}
