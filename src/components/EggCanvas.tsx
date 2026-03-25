import { Canvas } from '@react-three/fiber';
import { EggScene } from '@/components/EggScene';

interface EggCanvasProps {
  progressRef: React.MutableRefObject<number>;
}

export default function EggCanvas({ progressRef }: EggCanvasProps) {
  return (
    <Canvas
      frameloop="always"
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4], fov: 45 }}
      gl={{ powerPreference: 'high-performance', antialias: true }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <EggScene progressRef={progressRef} />
    </Canvas>
  );
}
