import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function CaseModel() {
  const group = useRef<THREE.Group>(null)
  useFrame((state, delta) => {
    if (!group.current) return
    const target = Number(getComputedStyle(document.documentElement).getPropertyValue('--case-rotation')) || 0
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, target + Math.sin(state.clock.elapsedTime * 0.35) * 0.035, 3, delta)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0.08 + Math.sin(target * 0.42) * 0.1, 3, delta)
  })

  return (
    <Float speed={1} rotationIntensity={0.05} floatIntensity={0.28}>
      <group ref={group} rotation={[0.1, -0.4, 0.02]}>
        {/* A light, procedural scene keeps the centerpiece quick to load and easy to recolor. */}
        <mesh castShadow receiveShadow position={[0, -0.02, 0]}>
          <boxGeometry args={[2.35, 1.48, 1.48]} />
          <meshStandardMaterial color="#253b38" roughness={0.42} metalness={0.12} />
        </mesh>
        <mesh castShadow position={[0, 0.75, 0]}>
          <boxGeometry args={[2.42, 0.11, 1.54]} />
          <meshStandardMaterial color="#344d48" roughness={0.38} metalness={0.16} />
        </mesh>
        <mesh castShadow position={[0, -0.02, 0.753]}>
          <boxGeometry args={[0.54, 1.15, 0.035]} />
          <meshStandardMaterial color="#ddb77d" roughness={0.32} metalness={0.42} />
        </mesh>
        <mesh castShadow position={[0, 0.53, 0.78]}>
          <boxGeometry args={[0.42, 0.13, 0.09]} />
          <meshStandardMaterial color="#eed6a7" roughness={0.25} metalness={0.55} />
        </mesh>
        <mesh castShadow position={[0, -0.02, 0.79]}>
          <boxGeometry args={[0.3, 0.35, 0.06]} />
          <meshStandardMaterial color="#b98854" roughness={0.32} metalness={0.5} />
        </mesh>
        <mesh castShadow position={[-0.9, -0.18, 0.77]} rotation={[0, 0, -0.12]}>
          <boxGeometry args={[0.28, 0.38, 0.08]} />
          <meshStandardMaterial color="#e8d3aa" roughness={0.74} />
        </mesh>
        <mesh castShadow position={[0.82, 0.14, 0.78]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.2, 0.2, 0.08]} />
          <meshStandardMaterial color="#cf8670" roughness={0.45} />
        </mesh>
        <mesh castShadow position={[0.89, -0.32, 0.77]} rotation={[0, 0, -0.16]}>
          <boxGeometry args={[0.24, 0.3, 0.08]} />
          <meshStandardMaterial color="#a9b19a" roughness={0.6} />
        </mesh>
      </group>
    </Float>
  )
}

export default function PlanningCase({ onReady }: { onReady?: () => void }) {
  useEffect(() => { onReady?.() }, [onReady])
  return (
    <div className="case-canvas" aria-hidden="true">
      <Canvas fallback={<div className="three-static-fallback"><span /><i /><b /></div>} shadows dpr={[1, 1.5]} camera={{ position: [3.5, 2.2, 4.8], fov: 34 }}>
        <ambientLight intensity={1.8} />
        <directionalLight position={[3, 5, 4]} intensity={3.2} castShadow shadow-mapSize={[512, 512]} />
        <CaseModel />
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.92, 0]}>
          <planeGeometry args={[7, 7]} />
          <shadowMaterial transparent opacity={0.13} />
        </mesh>
      </Canvas>
    </div>
  )
}
