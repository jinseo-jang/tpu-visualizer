import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, MeshStandardMaterial } from 'three'

interface IciLinkProps {
  start: [number, number, number]
  end: [number, number, number]
  color?: string
  animated?: boolean
}

export default function IciLink({ start, end, color = '#f59e0b', animated = true }: IciLinkProps) {
  const ref = useRef<Mesh>(null)

  const midX = (start[0] + end[0]) / 2
  const midY = (start[1] + end[1]) / 2
  const midZ = (start[2] + end[2]) / 2

  const dx = end[0] - start[0]
  const dy = end[1] - start[1]
  const dz = end[2] - start[2]
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz)

  const rotY = Math.atan2(dx, dz)
  const rotX = -Math.atan2(dy, Math.sqrt(dx * dx + dz * dz))

  useFrame((state) => {
    if (ref.current && animated) {
      ;(ref.current.material as MeshStandardMaterial).emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.3
    }
  })

  return (
    <mesh ref={ref} position={[midX, midY, midZ]} rotation={[rotX, rotY, 0]}>
      <cylinderGeometry args={[0.02, 0.02, length, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}
