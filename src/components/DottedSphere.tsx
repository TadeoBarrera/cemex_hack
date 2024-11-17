import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

const DottedSphere: React.FC = () => {
  const points = Array.from({ length: 5000 }, () => [
    (Math.random() - 0.5) * 2,
    (Math.random() - 0.5) * 2,
    (Math.random() - 0.5) * 2,
  ]);

  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
      }}
      camera={{ position: [0, 0, 5] }}
    >
      <Points>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flat())}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial
          attach="material"
          size={0.01}
          color="#ffffff"
          transparent
          opacity={0.8}
        />
      </Points>
    </Canvas>
  );
};

export default DottedSphere;
