import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'

interface RotatingGroupProps {
  children: React.ReactNode
  speed?: number
}

export default function RotatingGroup({ children, speed = 0.3 }: RotatingGroupProps) {
  const ref = useRef<Group>(null)

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * speed
    }
  })

  return <group ref={ref}>{children}</group>
}
