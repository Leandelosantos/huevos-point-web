import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EggSceneProps {
  progressRef: React.MutableRefObject<number>;
}

const EGG_GIRTH = 0.719;
const EGG_APEX = EGG_GIRTH * 0.111111111;

function eggVertex(rad: number, theta: number): THREE.Vector3 {
  const r = (EGG_APEX * Math.cos(rad) + EGG_GIRTH) * Math.sin(rad);
  const y = -Math.cos(rad);
  return new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta));
}

function createEggPoints(): THREE.Vector2[] {
  const points: THREE.Vector2[] = [];
  for (let rad = 0; rad <= Math.PI; rad += 0.05) {
    const v = eggVertex(rad, 0);
    points.push(new THREE.Vector2(Math.hypot(v.x, v.z), v.y));
  }
  return points;
}

// PRNG determinístico (mulberry32) — evita Math.random durante el render
function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const smoothstep = (a: number, b: number, t: number) =>
  clamp01((t - a) / Math.max(b - a, 0.0001)) ** 2 * (3 - 2 * clamp01((t - a) / Math.max(b - a, 0.0001)));

export function EggScene({ progressRef }: EggSceneProps) {
  const eggGroupRef = useRef<THREE.Group>(null);
  const intactRef = useRef<THREE.Mesh>(null);
  const yolkRef = useRef<THREE.Mesh>(null);
  const eggWhiteRef = useRef<THREE.Mesh>(null);
  const shardMeshesRef = useRef<THREE.Mesh[]>([]);

  const data = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const segments = isMobile ? 16 : 32;
    const rows = isMobile ? 6 : 8;
    const cols = isMobile ? 8 : 12;
    const shardCount = isMobile ? 6 : 9;

    // ── Cáscara intacta (estado de reposo, sin costuras visibles) ──
    const points = createEggPoints();
    const intactGeom = new THREE.LatheGeometry(points, segments);

    // ── Cáscara: material físico cremoso ──
    const makeShellMat = () =>
      new THREE.MeshPhysicalMaterial({
        color: 0xf0ead6,
        roughness: 0.45,
        clearcoat: 0.15,
        clearcoatRoughness: 0.3,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1,
      });

    const intactMat = makeShellMat();

    // ── Grilla de fragmentos irregulares (cráter de rotura) ──
    const radSteps: number[] = [];
    for (let i = 0; i <= rows; i++) radSteps.push((i / rows) * Math.PI);
    const thetaSteps: number[] = [];
    for (let j = 0; j <= cols; j++) thetaSteps.push((j / cols) * Math.PI * 2);

    // Semillas Voronoi (una por fragmento) en espacio de celdas
    const rand = createSeededRandom(1337);
    const seeds = Array.from({ length: shardCount }, () => ({
      row: rand() * rows,
      col: rand() * cols,
    }));

    const cellsByShard: number[][][] = Array.from({ length: shardCount }, () => []);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const cr = i + 0.5;
        const cc = j + 0.5;
        let best = 0;
        let bestDist = Infinity;
        seeds.forEach((seed, si) => {
          const rowDist = cr - seed.row;
          let colDist = Math.abs(cc - seed.col);
          colDist = Math.min(colDist, cols - colDist); // wrap alrededor del huevo
          const dist = rowDist * rowDist + colDist * colDist;
          if (dist < bestDist) {
            bestDist = dist;
            best = si;
          }
        });
        cellsByShard[best].push([i, j]);
      }
    }

    const shards = cellsByShard
      .filter((cells) => cells.length > 0)
      .map((cells) => {
        const positions: number[] = [];
        cells.forEach(([i, j]) => {
          const a = eggVertex(radSteps[i], thetaSteps[j]);
          const b = eggVertex(radSteps[i], thetaSteps[j + 1]);
          const c = eggVertex(radSteps[i + 1], thetaSteps[j + 1]);
          const d = eggVertex(radSteps[i + 1], thetaSteps[j]);
          positions.push(
            a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z,
            a.x, a.y, a.z, c.x, c.y, c.z, d.x, d.y, d.z
          );
        });

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.computeVertexNormals();

        // Centro y dirección hacia afuera del fragmento
        const center = new THREE.Vector3();
        for (let k = 0; k < positions.length; k += 3) {
          center.x += positions[k];
          center.y += positions[k + 1];
          center.z += positions[k + 2];
        }
        center.divideScalar(positions.length / 3);
        const outward = center.clone().normalize();

        return {
          geometry,
          material: makeShellMat(),
          outward,
          spin: new THREE.Vector3(
            (rand() - 0.5) * Math.PI,
            (rand() - 0.5) * Math.PI,
            (rand() - 0.5) * Math.PI
          ),
          delay: rand() * 0.15,
        };
      });

    // Clara: gelatinosa y translúcida
    const whiteMat = new THREE.MeshPhysicalMaterial({
      color: 0xfff8e0,
      roughness: 0.2,
      transmission: 0.5,
      thickness: 0.3,
      ior: 1.33,
      transparent: true,
      opacity: 0,
    });

    // Yema: ámbar vibrante, brillante y húmeda
    const yolkMat = new THREE.MeshPhysicalMaterial({
      color: 0xf5a623,
      roughness: 0.25,
      clearcoat: 0.4,
      clearcoatRoughness: 0.15,
      emissive: 0x401800,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0,
    });

    const yolkGeom = new THREE.SphereGeometry(0.21, 24, 18);
    yolkGeom.scale(1, 0.88, 1);

    const whiteGeom = new THREE.SphereGeometry(0.52, 20, 14);
    whiteGeom.scale(1, 0.28, 1);

    return { intactGeom, intactMat, shards, whiteMat, yolkMat, yolkGeom, whiteGeom };
  }, []);

  useFrame(() => {
    const p = clamp01(progressRef.current ?? 0);

    // ── Fase de quiebre: la cáscara intacta se desvanece y aparecen los fragmentos ──
    const crackPhase = smoothstep(0, 0.08, p);

    if (intactRef.current) {
      (intactRef.current.material as THREE.MeshPhysicalMaterial).opacity = 1 - crackPhase;
      intactRef.current.visible = crackPhase < 1;
    }

    // ── Fragmentos: estallan hacia afuera, giran y se desvanecen ──
    data.shards.forEach((shard, i) => {
      const mesh = shardMeshesRef.current[i];
      if (!mesh) return;

      const start = shard.delay;
      const localT = clamp01((p - start) / Math.max(1 - start, 0.0001));
      const fly = easeOutCubic(localT);

      mesh.position.set(
        shard.outward.x * fly * 1.1,
        shard.outward.y * fly * 1.1 + fly * fly * 0.4,
        shard.outward.z * fly * 1.1
      );
      mesh.rotation.set(shard.spin.x * fly, shard.spin.y * fly, shard.spin.z * fly);
      (mesh.material as THREE.MeshPhysicalMaterial).opacity = crackPhase * (1 - fly);
    });

    // ── Interior: se asoma brevemente al quebrarse y luego se desvanece ──
    const innerFadeOut = 1 - smoothstep(0.15, 0.6, p);
    const innerOpacity = crackPhase * innerFadeOut;

    if (yolkRef.current) {
      const jiggle = Math.sin(crackPhase * Math.PI) * 0.04;
      yolkRef.current.position.y = -0.12 - jiggle;
      yolkRef.current.scale.setScalar(1 + jiggle * 0.6);
      (yolkRef.current.material as THREE.MeshPhysicalMaterial).opacity = innerOpacity;
    }

    if (eggWhiteRef.current) {
      (eggWhiteRef.current.material as THREE.MeshPhysicalMaterial).opacity = 0.88 * innerOpacity;
    }

    // Auto-rotate suave cuando está cerrado
    if (eggGroupRef.current) {
      eggGroupRef.current.rotation.y += 0.003 * (1 - crackPhase);
    }
  });

  return (
    <>
      {/* Iluminación completa sin dependencias externas */}
      <hemisphereLight args={[0xfff5e4, 0x1a1008, 1.3]} />
      <directionalLight position={[3, 4, 3]} intensity={2.0} />
      <directionalLight position={[-2, 1, -2]} intensity={0.7} />
      <pointLight position={[0, 0, 5]} intensity={1.0} />
      {/* Luz de relleno desde abajo para iluminar el interior */}
      <pointLight position={[0, -2, 2]} intensity={0.6} color={0xffeedd} />

      <group ref={eggGroupRef}>
        {/* Cáscara intacta — visible en reposo, se desvanece al quebrarse */}
        <mesh ref={intactRef} geometry={data.intactGeom} material={data.intactMat} />

        {/* Fragmentos irregulares — aparecen y estallan al quebrarse */}
        {data.shards.map((shard, i) => (
          <mesh
            key={i}
            ref={(el) => {
              if (el) shardMeshesRef.current[i] = el;
            }}
            geometry={shard.geometry}
            material={shard.material}
          />
        ))}

        {/* Clara — se asoma al quebrarse */}
        <mesh
          ref={eggWhiteRef}
          geometry={data.whiteGeom}
          material={data.whiteMat}
          position={[0, 0.08, 0]}
        />

        {/* Yema — se asoma al quebrarse */}
        <mesh
          ref={yolkRef}
          geometry={data.yolkGeom}
          material={data.yolkMat}
          position={[0, -0.12, 0]}
        />
      </group>
    </>
  );
}
