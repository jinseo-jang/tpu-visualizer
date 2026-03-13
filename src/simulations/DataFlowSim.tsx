import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { InstancedMesh, Object3D, Color } from 'three'

interface DataFlowSimProps {
  playing?: boolean
  speed?: number
  particleCount?: number
}

const tempObject = new Object3D()
const tempColor = new Color()

export default function DataFlowSim({ playing = true, speed = 1, particleCount = 30 }: DataFlowSimProps) {
  const meshRef = useRef<InstancedMesh>(null)
  const timeRef = useRef(0)

  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      offset: (i / particleCount) * Math.PI * 2,
      pathIndex: i % 3, // 0: HBM->MXU, 1: MXU->HBM, 2: ICI
      speed: 0.5 + Math.random() * 0.5,
    }))
  }, [particleCount])

  useFrame((_, delta) => {
    if (!playing || !meshRef.current) return
    timeRef.current += delta * speed

    const t = timeRef.current

    particles.forEach((p, i) => {
      const progress = ((t * p.speed + p.offset) % (Math.PI * 2)) / (Math.PI * 2)

      let x: number, y: number, z: number
      if (p.pathIndex === 0) {
        // HBM to MXU path (left side)
        x = -1.1 + progress * 0.7
        y = 0.2 + Math.sin(progress * Math.PI) * 0.3
        z = 0.5 - progress * 0.5
        tempColor.set('#c084fc')
      } else if (p.pathIndex === 1) {
        // MXU to HBM path (right side)
        x = 0.4 + progress * 0.7
        y = 0.2 + Math.sin(progress * Math.PI) * 0.3
        z = -0.5 + progress * 0.5
        tempColor.set('#60a5fa')
      } else {
        // ICI path (circular)
        const angle = progress * Math.PI * 2
        x = Math.cos(angle) * 1.3
        y = 0.8
        z = Math.sin(angle) * 1.3
        tempColor.set('#f59e0b')
      }

      tempObject.position.set(x, y, z)
      tempObject.scale.setScalar(0.03)
      tempObject.updateMatrix()
      meshRef.current!.setMatrixAt(i, tempObject.matrix)
      meshRef.current!.setColorAt(i, tempColor)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        emissive="#ffffff"
        emissiveIntensity={0.5}
        toneMapped={false}
      />
    </instancedMesh>
  )
}
