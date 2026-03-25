import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
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
  const yolkRef = useRef<THREE.Mesh>(null);
  const eggWhiteRef = useRef<THREE.Mesh>(null);

  const meshes = useMemo(() => {
    const points = createEggPoints();
    const midIndex = Math.floor(points.length / 2);
    const segments = typeof window !== 'undefined' && window.innerWidth < 768 ? 16 : 32;

    // ── Mitades SIN tapas planas → crea el hueco visible al abrirse ──
    const topGeom = new THREE.LatheGeometry(points.slice(0, midIndex + 1), segments);
    const bottomGeom = new THREE.LatheGeometry(points.slice(midIndex), segments);

    // Cáscara: DoubleSide para ver el interior al abrirse
    const shellMat = new THREE.MeshPhongMaterial({
      color: 0xf0ead6,      // crema natural
      specular: 0x999999,
      shininess: 55,
      side: THREE.DoubleSide,
    });

    // Clara: semitransparente, gelatinosa
    const whiteMat = new THREE.MeshPhongMaterial({
      color: 0xfff8e0,
      specular: 0x555555,
      shininess: 120,
      transparent: true,
      opacity: 0.88,
    });

    // Yema: ámbar vibrante con emisión propia
    const yolkMat = new THREE.MeshPhongMaterial({
      color: 0xf5a623,
      specular: 0xffcc44,
      shininess: 160,
      emissive: 0x401800,
      emissiveIntensity: 0.5,
    });

    // Yema: esfera ligeramente achatada
    const yolkGeom = new THREE.SphereGeometry(0.21, 24, 18);
    yolkGeom.scale(1, 0.88, 1);

    // Clara: disco aplanado justo en el ecuador, visible al abrirse
    const whiteGeom = new THREE.SphereGeometry(0.52, 20, 14);
    whiteGeom.scale(1, 0.28, 1);

    return { topGeom, bottomGeom, shellMat, whiteMat, yolkMat, yolkGeom, whiteGeom };
  }, []);

  useFrame(() => {
    const p = progressRef.current ?? 0;

    // openProgress: 0 → 1 durante el 60% inicial del scroll total
    const openProgress = Math.min(p / 0.6, 1);

    // ── Apertura de la mitad superior ──
    if (pivotRef.current) {
      pivotRef.current.rotation.x = -openProgress * Math.PI * 0.58;
      pivotRef.current.position.y = openProgress * 0.25;
    }

    // ── Yema cae con aceleración tipo gravedad ──
    if (yolkRef.current) {
      // Empieza a caer al 20% del scroll total, cae durante los próximos 40%
      const t = Math.max(0, Math.min((p - 0.20) / 0.40, 1));
      const fall = t * t * t; // ease-in cúbico = gravedad

      yolkRef.current.position.y = -0.12 - fall * 4.0;
      // Gira levemente mientras cae
      yolkRef.current.rotation.z = t * Math.PI * 0.6;
      // Ligera oscilación lateral (rebote natural)
      yolkRef.current.position.x = Math.sin(t * Math.PI * 1.5) * 0.06 * t;
    }

    // ── Clara: aparece al mismo tiempo que empieza a abrirse ──
    if (eggWhiteRef.current) {
      const whiteOpacity = Math.min(openProgress * 2, 1);
      (eggWhiteRef.current.material as THREE.MeshPhongMaterial).opacity =
        0.88 * whiteOpacity;
    }

    // Auto-rotate suave cuando está cerrado
    if (eggGroupRef.current) {
      eggGroupRef.current.rotation.y += 0.003 * (1 - openProgress);
    }
  });

  return (
    <>
      <color attach="background" args={['#0C0A09']} />

      {/* Iluminación completa sin dependencias externas */}
      <hemisphereLight args={[0xfff5e4, 0x1a1008, 1.3]} />
      <directionalLight position={[3, 4, 3]} intensity={2.0} />
      <directionalLight position={[-2, 1, -2]} intensity={0.7} />
      <pointLight position={[0, 0, 5]} intensity={1.0} />
      {/* Luz de relleno desde abajo para iluminar el interior */}
      <pointLight position={[0, -2, 2]} intensity={0.6} color={0xffeedd} />

      <group ref={eggGroupRef}>
        {/* Mitad superior — gira al abrirse */}
        <group ref={pivotRef}>
          <mesh geometry={meshes.topGeom} material={meshes.shellMat} />
        </group>

        {/* Mitad inferior — estática */}
        <mesh geometry={meshes.bottomGeom} material={meshes.shellMat} />

        {/* Clara — disco gelatinoso visible en el ecuador al abrirse */}
        <mesh
          ref={eggWhiteRef}
          geometry={meshes.whiteGeom}
          material={meshes.whiteMat}
          position={[0, 0.08, 0]}
        />

        {/* Yema — cae al abrirse el huevo */}
        <mesh
          ref={yolkRef}
          geometry={meshes.yolkGeom}
          material={meshes.yolkMat}
          position={[0, -0.12, 0]}
        />
      </group>
    </>
  );
}
