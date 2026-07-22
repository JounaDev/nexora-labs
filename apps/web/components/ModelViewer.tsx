"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Bounds,
  Center,
  Environment,
  useGLTF,
} from "@react-three/drei";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

export default function ModelViewer({ url }: { url: string }) {
  return (
    <div className="w-full h-[700px]">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ fov: 45, position: [0, 0, 5] }}
      >
        {/* Luz ambiental */}
        <ambientLight intensity={0.8} />

        {/* Luz principal */}
        <directionalLight
          position={[5, 10, 5]}
          intensity={2}
          castShadow
        />

        {/* Luz de relleno */}
        <directionalLight
          position={[-5, 4, -5]}
          intensity={0.8}
        />

        {/* Luz frontal */}
        <pointLight
          position={[0, 3, 3]}
          intensity={1.2}
        />

        {/* Entorno tipo estudio */}
        <Environment preset="studio" />

        {/* Ajusta automáticamente la cámara */}
        <Bounds fit clip observe margin={1.2}>
          <Model url={url} />
        </Bounds>

        {/* Controles */}
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.5}
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
          minDistance={0.5}
          maxDistance={3}
        />
      </Canvas>
    </div>
  );
}