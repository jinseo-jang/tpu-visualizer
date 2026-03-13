import { type ReactNode } from 'react'

interface BaseTpuProps {
  children?: ReactNode
  boardColor?: string
  scale?: number
}

export default function BaseTpu({ children, boardColor = '#1a1a2e', scale = 1 }: BaseTpuProps) {
  return (
    <group scale={scale}>
      {/* PCB board */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[3, 0.1, 2]} />
        <meshStandardMaterial color={boardColor} metalness={0.3} roughness={0.8} />
      </mesh>
      {/* Board edge highlights */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[3.05, 0.02, 2.05]} />
        <meshStandardMaterial
          color="#2d2d4e"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      {children}
    </group>
  )
}
