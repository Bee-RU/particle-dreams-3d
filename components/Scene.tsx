import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticleConfig, ShapeType } from '../types';
import { generateShapePositions } from '../utils/geometry';

interface SceneProps {
  config: ParticleConfig;
}

const ParticleSystem: React.FC<SceneProps> = ({ config }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const hoverRef = useRef(new THREE.Vector3(10000, 10000, 10000)); // Off-screen initially
  const { viewport, mouse } = useThree();

  // Create buffers
  // We allocate for max particles to avoid re-creating geometry buffer too often
  // But for this demo, we'll regenerate when count changes for simplicity
  const count = config.count;

  // Generate Target Positions based on Shape
  const targetPositions = useMemo(() => {
    return generateShapePositions(config.shape, count, 1.5);
  }, [config.shape, count]);

  // Initial Positions (random scatter)
  const initialPositions = useMemo(() => {
    return generateShapePositions('sphere', count, 10); // Start scattered
  }, [count]);

  // Current Positions (mutable state for animation)
  const currentPositions = useMemo(() => {
    return new Float32Array(initialPositions);
  }, [initialPositions]);

  // Colors
  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const c1 = new THREE.Color(config.colorA);
    const c2 = new THREE.Color(config.colorB);
    const tempColor = new THREE.Color();

    for (let i = 0; i < count; i++) {
        // Gradient mixing based on position index (approximate) or spatial Y
        // Let's mix randomly for sparkle effect, or linear for gradient
        const mix = Math.random();
        tempColor.lerpColors(c1, c2, mix);
        arr[i * 3] = tempColor.r;
        arr[i * 3 + 1] = tempColor.g;
        arr[i * 3 + 2] = tempColor.b;
    }
    return arr;
  }, [count, config.colorA, config.colorB]);

  // Update logic
  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    // Convert normalized mouse to world coords for interaction
    // A simple approximation for depth 0 plane
    if (config.hoverEffect) {
        hoverRef.current.set(
            (state.mouse.x * viewport.width) / 2,
            (state.mouse.y * viewport.height) / 2,
            0
        );
    } else {
        hoverRef.current.set(10000, 10000, 10000);
    }

    const damp = THREE.MathUtils.lerp(0.01, 0.1, config.speed);

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // Target
      const tx = targetPositions[ix];
      const ty = targetPositions[iy];
      const tz = targetPositions[iz];

      // Current
      let cx = currentPositions[ix];
      let cy = currentPositions[iy];
      let cz = currentPositions[iz];

      // Noise / Float
      const noiseAmp = config.noiseStrength * 0.05;
      const nx = Math.sin(time * 2 + iy) * noiseAmp;
      const ny = Math.cos(time * 1.5 + ix) * noiseAmp;
      const nz = Math.sin(time * 1.2 + iz) * noiseAmp;

      // Interactive Repulsion
      let dx = cx - hoverRef.current.x;
      let dy = cy - hoverRef.current.y;
      let dz = cz - hoverRef.current.z;
      const distSq = dx*dx + dy*dy + dz*dz;
      const minDist = 2.5; // Repel radius
      
      let fx = 0, fy = 0, fz = 0;

      if (distSq < minDist * minDist && config.hoverEffect) {
        const dist = Math.sqrt(distSq);
        const force = (minDist - dist) / minDist;
        fx = (dx / dist) * force * 5 * config.speed;
        fy = (dy / dist) * force * 5 * config.speed;
        fz = (dz / dist) * force * 5 * config.speed;
      }

      // Lerp towards target + noise
      cx += (tx + nx - cx) * damp + fx;
      cy += (ty + ny - cy) * damp + fy;
      cz += (tz + nz - cz) * damp + fz;

      // Update state
      currentPositions[ix] = cx;
      currentPositions[iy] = cy;
      currentPositions[iz] = cz;

      // Update geometry
      positions[ix] = cx;
      positions[iy] = cy;
      positions[iz] = cz;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Optional: Rotate whole system slowly
    pointsRef.current.rotation.y = time * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={currentPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={config.particleSize}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default ParticleSystem;
