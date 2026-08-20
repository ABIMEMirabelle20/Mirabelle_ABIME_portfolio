import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

// Scène locale au Hero, en plus de l'environnement 3D global (GlobalScene)
// qui court sur tout le site. Le Hero garde ainsi sa propre matière visuelle
// (particules plus denses, fils lumineux, gemmes flottantes) : c'est
// l'entrée la plus spectaculaire du portfolio.

function Particles({ count, color }) {
  const pointsRef = useRef(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * 13;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 7;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    const group = pointsRef.current;
    if (!group) return;
    group.rotation.y += delta * 0.03;
    group.rotation.x += delta * 0.006;
    const t = state.clock.elapsedTime;
    group.position.x = Math.sin(t * 0.15) * 0.25 + state.pointer.x * 0.55;
    group.position.y = Math.cos(t * 0.12) * 0.15 + state.pointer.y * 0.28;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color={color} transparent opacity={0.8} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Thread({ radius, speed, color, opacity }) {
  const ref = useRef(null);
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 72; i += 1) {
      const a = (i / 72) * Math.PI * 2;
      pts.push(Math.cos(a) * radius, Math.sin(a * 1.6) * (radius * 0.35), Math.sin(a) * radius * 0.6);
    }
    return new Float32Array(pts);
  }, [radius]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });

  return (
    <line ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={points.length / 3} array={points} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  );
}

function FloatingGem({ position, scale, color, speed, low }) {
  const mesh = useRef(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.x = t * speed * 0.18;
    mesh.current.rotation.y = t * speed * 0.12;
    mesh.current.position.y = position[1] + Math.sin(t * speed * 0.5) * 0.25;
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 0]} />
      {low ? (
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
      ) : (
        <meshPhysicalMaterial
          color={color}
          roughness={0.15}
          transmission={0.55}
          thickness={1.2}
          ior={1.2}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
          metalness={0.05}
        />
      )}
    </mesh>
  );
}

export default function HeroScene({ isMobile }) {
  return (
    <Canvas
      className="hero__canvas"
      dpr={[1, isMobile ? 1.5 : 2]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 3, 4]} intensity={0.7} color="#FFFFFF" />

      <Particles count={isMobile ? 260 : 680} color="#8B3DFF" />
      <Thread radius={3.4} speed={0.055} color="#2F6BFF" opacity={0.45} />
      {!isMobile && <Thread radius={2.3} speed={-0.04} color="#00D4FF" opacity={0.32} />}

      <FloatingGem position={[2.6, 1.1, -2]} scale={0.42} color="#2F6BFF" speed={0.9} low={isMobile} />
      {!isMobile && <FloatingGem position={[-2.4, -1.2, -1.5]} scale={0.3} color="#00D4FF" speed={1.2} low={isMobile} />}
    </Canvas>
  );
}
