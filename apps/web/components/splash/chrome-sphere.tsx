// apps/web/components/splash/chrome-sphere.tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";


import type { MotionValue } from "framer-motion";
import * as THREE from "three";

// Todo esto corre dentro del loop de render de Three.js a 60fps — nada de
// esto pasa por React (por eso `progress` es un MotionValue, no un useState:
// leerlo con .get() no dispara re-renders).
//
// Los rangos están calibrados a mano para que la esfera crezca y se acerque
// bastante a la cámara sin llegar a "envolverla" — si la superficie cercana
// llega a tocar o pasar la posición de la cámara, Three.js empieza a
// renderizar el interior de la esfera (que por defecto no se ve, culling de
// caras traseras) y el efecto se rompe en vez de verse premium.
function scaleForProgress(p: number): number {
  if (p < 0.6) {
    return THREE.MathUtils.lerp(0.2, 1.1, p / 0.6);
  }

  if (p < 0.9) {
    return THREE.MathUtils.lerp(1.1, 2.8, (p - 0.6) / 0.3);
  }

  // Zoom cinematográfico final
  return THREE.MathUtils.lerp(2.8, 9, (p - 0.9) / 0.1);
}

function zForProgress(p: number): number {
  if (p < 0.6) {
    return THREE.MathUtils.lerp(-5, -1.5, p / 0.6);
  }

  if (p < 0.9) {
    return THREE.MathUtils.lerp(-1.5, 1.5, (p - 0.6) / 0.3);
  }

  return THREE.MathUtils.lerp(1.5, 5.5, (p - 0.9) / 0.1);
}
function yForProgress(p: number): number {
  if (p < 0.65) {
    return THREE.MathUtils.lerp(-4.5, 0, p / 0.65);
  }

  return THREE.MathUtils.lerp(0, 0.25, (p - 0.65) / 0.35);
}

function xForProgress(p: number): number {
  return Math.sin(p * Math.PI) * 0.45;
}


export function ChromeSphere({ progress }: { progress: MotionValue<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const p = progress.get();
  meshRef.current.scale.setScalar(scaleForProgress(p));

meshRef.current.position.x = xForProgress(p);
meshRef.current.position.y = yForProgress(p);
meshRef.current.position.z = zForProgress(p);

// Giro continuo
meshRef.current.rotation.y += delta * 0.9;
meshRef.current.rotation.x += delta * 0.35;
meshRef.current.rotation.z += delta * 0.15;

// Ligera inclinación al subir
meshRef.current.rotation.x += Math.sin(p * Math.PI) * 0.02;
  });

  return (
    <>
      {/* El environment le da a la esfera algo real que reflejar — sin esto
          un material metalness=1 se ve negro/muerto, no cromado. */}
      <ambientLight intensity={0.05} />

      <pointLight position={[5, 3, 4]} intensity={8} color="#ffffff" />

      <pointLight position={[-5, -2, 3]} intensity={4} color="#2c302b" />

      <pointLight position={[0, 5, -2]} intensity={3} color="#38ce2a" />

<Environment preset="night" background={false} />
      <mesh ref={meshRef} position={[0, -4.5, -5]} scale={0}>
        <sphereGeometry args={[1, 96, 96]} />
        <meshStandardMaterial
          metalness={1}
          roughness={0.02}
          envMapIntensity={1.2}
        />
      </mesh>
    </>
  );
}
