import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Suspense, type ReactNode } from 'react'

interface SceneProps {
  children: ReactNode
  interactive?: boolean
  className?: string
}

export default function Scene({ children, interactive = false, className = '' }: SceneProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <pointLight position={[-5, 3, -5]} intensity={0.3} color="#8b5cf6" />
          <Environment preset="night" />
          {children}
          {interactive && <OrbitControls enableDamping dampingFactor={0.05} />}
        </Suspense>
      </Canvas>
    </div>
  )
}
