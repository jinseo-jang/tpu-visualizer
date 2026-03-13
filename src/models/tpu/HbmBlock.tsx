interface HbmBlockProps {
  position?: [number, number, number]
  scale?: number
  color?: string
  stacks?: number
}

export default function HbmBlock({ position = [0, 0, 0], scale = 1, color = '#8b5cf6', stacks = 4 }: HbmBlockProps) {
  return (
    <group position={position}>
      {Array.from({ length: stacks }).map((_, i) => (
        <mesh key={i} position={[0, i * 0.12 * scale, 0]}>
          <boxGeometry args={[0.4 * scale, 0.1 * scale, 0.4 * scale]} />
          <meshStandardMaterial
            color={color}
            metalness={0.6}
            roughness={0.4}
            transparent
            opacity={0.8 + i * 0.05}
          />
        </mesh>
      ))}
      {/* Top label indicator */}
      <mesh position={[0, stacks * 0.12 * scale + 0.05, 0]}>
        <boxGeometry args={[0.35 * scale, 0.02 * scale, 0.35 * scale]} />
        <meshStandardMaterial
          color="#c084fc"
          emissive="#c084fc"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  )
}
