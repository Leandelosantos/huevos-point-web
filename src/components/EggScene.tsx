import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

interface EggSceneProps {
  progressRef: React.MutableRefObject<number>;
}

function createEggPoints(): THREE.Vector2[] {
  const points: THREE.Vector2[] = [];
  const girth = 0.719;
  const apex = girth * 0.111111111;

  for (let rad = 0; rad <= Math.PI; rad += 0.05) {
    points.push(
      new THREE.Vector2(
        (apex * Math.cos(rad) + girth) * Math.sin(rad),
        -Math.cos(rad)
      )
    );
  }
  return points;
}

export function EggScene({ progressRef }: EggSceneProps) {
  const pivotRef = useRef<THREE.Group>(null);
  const eggGroupRef = useRef<THREE.Group>(null);

  const { topGeometry, bottomGeometry, material } = useMemo(() => {
    const points = createEggPoints();
    const midIndex = Math.floor(points.length / 2);

    // Mitad superior: desde el extremo superior hasta el ecuador
    const topPoints = points.slice(0, midIndex + 1);
    // Tapa plana para cerrar el interior
    topPoints.push(new THREE.Vector2(0, topPoints[topPoints.length - 1].y));

    // Mitad inferior: desde el ecuador hasta el extremo inferior
    const bottomPoints = points.slice(midIndex);
    bottomPoints.unshift(new THREE.Vector2(0, bottomPoints[0].y));

    const segments = typeof window !== 'undefined' && window.innerWidth < 768 ? 16 : 32;

    const topGeom = new THREE.LatheGeometry(topPoints, segments);
    const bottomGeom = new THREE.LatheGeometry(bottomPoints, segments);

    const mat = new THREE.MeshStandardMaterial({
      color: 0xf0ead6,   // blanco cáscara natural
      roughness: 0.7,
      metalness: 0.0,
      side: THREE.DoubleSide, // muestra el interior al abrirse
    });

    return { topGeometry: topGeom, bottomGeometry: bottomGeom, material: mat };
  }, []);

  useFrame(() => {
    const p = progressRef.current ?? 0;
    // La apertura ocupa el 60% inicial del scroll
    const openProgress = Math.min(p / 0.6, 1);

    // Mitad superior: rota desde su base (el pivot está en y=0, el ecuador del huevo)
    if (pivotRef.current) {
      pivotRef.current.rotation.x = -openProgress * Math.PI * 0.55;
      pivotRef.current.position.y = openProgress * 0.3;
    }

    // Auto-rotate suave cuando está cerrado
    if (eggGroupRef.current) {
      eggGroupRef.current.rotation.y += 0.003 * (1 - openProgress);
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 3, 2]} intensity={1} />
      <directionalLight position={[-2, 1, -1]} intensity={0.4} />
      <Environment preset="studio" />

      <group ref={eggGroupRef}>
        {/* Mitad superior con pivot en el ecuador (y=0) para apertura correcta */}
        <group ref={pivotRef}>
          <mesh geometry={topGeometry} material={material} />
        </group>

        {/* Mitad inferior — estática */}
        <mesh geometry={bottomGeometry} material={material} />
      </group>
    </>
  );
}
