import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerformanceMonitor } from '@react-three/drei';
import './GlobalScene.css';

/**
 * GlobalScene
 * -----------
 * Un seul environnement 3D, fixé derrière tout le site (une seule fois monté
 * dans App), qui dérive doucement avec le scroll et la souris. Remplace les
 * anciennes scènes séparées (Hero + Projects) qui donnaient l'impression de
 * "zones" 3D isolées plutôt qu'un environnement continu.
 */

const PALETTE = ['#2F6BFF', '#8B3DFF', '#00D4FF'];

function Particles({ count, low }) {
  const ref = useRef(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = Math.random() * -68 + 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 14 - 4;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={low ? 0.05 : 0.045}
        color="#8B3DFF"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Thread({ radius, speed, color, opacity, position }) {
  const ref = useRef(null);
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i += 1) {
      const a = (i / 64) * Math.PI * 2;
      pts.push(Math.cos(a) * radius, Math.sin(a * 1.6) * (radius * 0.35), Math.sin(a) * radius * 0.6);
    }
    return new Float32Array(pts);
  }, [radius]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });

  return (
    <line ref={ref} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={points.length / 3} array={points} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  );
}

function FloatingShape({ position, scale, color, geo, low, speed = 1 }) {
  const mesh = useRef(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.x = t * speed * 0.06;
    mesh.current.rotation.y = t * speed * 0.04;
  });

  return (
    <Float speed={speed} rotationIntensity={0.2} floatIntensity={1}>
      <mesh ref={mesh} position={position} scale={scale}>
        {geo === 'icosahedron' && <icosahedronGeometry args={[1, 0]} />}
        {geo === 'octahedron' && <octahedronGeometry args={[1, 0]} />}
        {geo === 'sphere' && <sphereGeometry args={[1, low ? 14 : 28, low ? 14 : 28]} />}
        {low ? (
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.15} />
        ) : (
          <meshPhysicalMaterial
            color={color}
            roughness={0.2}
            transmission={0.45}
            thickness={1.3}
            ior={1.15}
            clearcoat={0.5}
            clearcoatRoughness={0.3}
            metalness={0.05}
          />
        )}
      </mesh>
    </Float>
  );
}

function SignatureKnot({ low }) {
  const mesh = useRef(null);
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.z = state.clock.elapsedTime * 0.045;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.15;
  });

  return (
    <mesh ref={mesh} position={[3.4, -28, -6]} scale={1.3}>
      <torusKnotGeometry args={[0.9, 0.24, low ? 56 : 160, low ? 8 : 20, 2, 3]} />
      {low ? (
        <meshStandardMaterial color="#2F6BFF" roughness={0.4} metalness={0.2} />
      ) : (
        <meshPhysicalMaterial
          color="#2F6BFF"
          roughness={0.15}
          transmission={0.3}
          thickness={1.5}
          clearcoat={0.6}
          metalness={0.1}
        />
      )}
    </mesh>
  );
}

// Le rig suit le scroll (0→1 sur toute la page) pour donner l'impression de
// traverser une seule scène continue, plus une parallaxe souris légère.
function Rig({ enablePointer }) {
  const scrollRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      scrollRef.current = max > 0 ? el.scrollTop / max : 0;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFrame((state) => {
    const depth = scrollRef.current * 66;
    const pointerX = enablePointer ? state.pointer.x * 0.6 : 0;
    const pointerY = enablePointer ? state.pointer.y * 0.35 : 0;
    state.camera.position.z = 8 + Math.sin(state.clock.elapsedTime * 0.05) * 0.3;
    state.camera.position.x += (pointerX - state.camera.position.x) * 0.02;
    state.camera.position.y += (-depth + pointerY - state.camera.position.y) * 0.04;
    state.camera.lookAt(0, -depth, 0);
  });

  return null;
}

const GEOS = ['icosahedron', 'sphere', 'octahedron'];

function Scene({ low, enablePointer }) {
  // Formes générées à intervalles réguliers sur toute la hauteur du site
  // (au lieu d'être concentrées près du Hero) : la densité visuelle reste
  // la même, du Hero jusqu'au Footer.
  const shapes = useMemo(() => {
    const list = [];
    const step = 5.2;
    const count = 14;
    for (let i = 0; i < count; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      list.push({
        position: [side * (3.2 + (i % 3) * 0.6), 3 - i * step, -3 - (i % 4)],
        scale: 0.45 + ((i * 7) % 5) * 0.08,
        geo: GEOS[i % GEOS.length],
        speed: 0.7 + ((i * 3) % 5) * 0.12,
      });
    }
    return list;
  }, []);

  const threads = useMemo(() => {
    const list = [];
    const step = 11;
    const count = 6;
    for (let i = 0; i < count; i += 1) {
      list.push({
        position: [0, 2 - i * step, -5],
        radius: 3.2 + (i % 2) * 0.6,
        speed: i % 2 === 0 ? 0.05 : -0.045,
        color: i % 2 === 0 ? '#2F6BFF' : '#00D4FF',
        opacity: 0.32,
      });
    }
    return list;
  }, []);

  const visibleShapes = low ? shapes.filter((_, i) => i % 2 === 0) : shapes;
  const visibleThreads = low ? threads.filter((_, i) => i % 2 === 0) : threads;

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 4, 5]} intensity={0.85} color="#FFFFFF" />
      <pointLight position={[-4, -2, 2]} intensity={0.4} color="#00D4FF" />

      <Particles count={low ? 260 : 620} low={low} />

      {visibleShapes.map((s, i) => (
        <FloatingShape key={i} {...s} color={PALETTE[i % PALETTE.length]} low={low} />
      ))}

      {visibleThreads.map((th, i) => (
        <Thread key={i} {...th} />
      ))}

      <SignatureKnot low={low} />
      <Rig enablePointer={enablePointer} />
    </>
  );
}

export default function GlobalScene() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [low, setLow] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const widthQuery = window.matchMedia('(max-width: 700px)');
    const update = () => {
      setReducedMotion(motionQuery.matches);
      setIsMobile(widthQuery.matches);
      setLow(widthQuery.matches);
    };
    update();
    motionQuery.addEventListener('change', update);
    widthQuery.addEventListener('change', update);
    return () => {
      motionQuery.removeEventListener('change', update);
      widthQuery.removeEventListener('change', update);
    };
  }, []);

  if (reducedMotion) {
    // Respecte la préférence utilisateur : fond statique (dégradé CSS pris
    // en charge par .global-scene__fallback), aucune charge WebGL.
    return <div className="global-scene__fallback" aria-hidden="true" />;
  }

  return (
    <div className="global-scene" aria-hidden="true">
      <Canvas
        dpr={isMobile ? 1 : [1, 1.6]}
        gl={{ antialias: !low, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 8], fov: 42 }}
      >
        <PerformanceMonitor onDecline={() => setLow(true)} onIncline={() => !isMobile && setLow(false)} />
        <Suspense fallback={null}>
          <Scene low={low} enablePointer={!isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
