import * as THREE from 'three';
import { ShapeType } from '../types';

// Helper to get random point in sphere
const randomInSphere = (radius: number) => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  const sinPhi = Math.sin(phi);
  return new THREE.Vector3(
    r * sinPhi * Math.cos(theta),
    r * sinPhi * Math.sin(theta),
    r * Math.cos(phi)
  );
};

export const generateShapePositions = (type: ShapeType, count: number, scale: number = 1): Float32Array => {
  const positions = new Float32Array(count * 3);
  const tempVec = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    let x = 0, y = 0, z = 0;

    switch (type) {
      case 'sphere': {
        const p = randomInSphere(scale * 4);
        x = p.x; y = p.y; z = p.z;
        break;
      }
      case 'cube': {
        const s = scale * 3;
        x = (Math.random() - 0.5) * 2 * s;
        y = (Math.random() - 0.5) * 2 * s;
        z = (Math.random() - 0.5) * 2 * s;
        break;
      }
      case 'heart': {
        // Solid 3D Heart using Rejection Sampling
        // Formula: (x^2 + (9/4)z^2 + y^2 - 1)^3 - x^2*y^3 - (9/80)z^2*y^3 < 0
        // We map standard math Z-up to Three.js Y-up:
        // Math X -> Three X
        // Math Z -> Three Y (Height)
        // Math Y -> Three Z (Depth)
        
        while (true) {
            // Sampling box approx [-1.5, 1.5]
            const range = 1.5;
            const rx = (Math.random() - 0.5) * 2 * range;
            const ry = (Math.random() - 0.5) * 2 * range; // Height (Math Z)
            const rz = (Math.random() - 0.5) * 2 * range; // Depth (Math Y)
            
            const x2 = rx * rx;
            const y2 = ry * ry; 
            const z2 = rz * rz;
            
            // Standard equation components
            // Note: The 9/4 coefficient applies to the "depth" relative to the heart's face.
            // In our Y-up mapping, Y is height, X is width, Z is depth.
            
            // Refined formula for a nice puffy heart
            const a = x2 + (9/4) * z2 + y2 - 1;
            const a3 = a * a * a;
            const b = x2 * y2 * ry; // x^2 * y^3
            const c = (9/80) * z2 * y2 * ry; // 9/80 * z^2 * y^3
            
            if (a3 - b - c <= 0) {
                // Point is inside
                const sizeMult = 3.5; // Scale up to match other shapes
                x = rx * scale * sizeMult;
                y = ry * scale * sizeMult;
                z = rz * scale * sizeMult;
                break;
            }
        }
        break;
      }
      case 'spiral': {
        const t = i / count * 20 * Math.PI;
        const r = (i / count) * scale * 5;
        x = r * Math.cos(t);
        z = r * Math.sin(t);
        y = (i / count * 10 - 5) * scale;
        
        // Add width
        x += (Math.random() - 0.5);
        z += (Math.random() - 0.5);
        break;
      }
      case 'tree': {
        // Cone shape
        const height = 8 * scale;
        const radius = 3.5 * scale;
        const h = Math.random() * height; // Height from base
        const rAtH = (1 - h / height) * radius; // Radius at height h
        const angle = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * rAtH; // Uniform disk
        
        x = r * Math.cos(angle);
        y = h - (height / 2);
        z = r * Math.sin(angle);
        break;
      }
      case 'cat': {
        // Composite shape: Head sphere + Ear cones
        const part = Math.random();
        
        if (part > 0.2) {
            // Head (80% of particles)
            const p = randomInSphere(2.5 * scale);
            x = p.x; 
            y = p.y - 0.5 * scale; // Shift down slightly
            z = p.z * 0.8; // Flatten face slightly
        } else {
            // Ears (20% of particles)
            const isLeft = Math.random() > 0.5;
            const earHeight = 1.5 * scale;
            const earWidth = 1.0 * scale;
            
            // Local ear coordinates (Cone)
            const eh = Math.random() * earHeight;
            const er = (1 - eh/earHeight) * earWidth;
            const ea = Math.random() * Math.PI * 2;
            
            let ex = er * Math.cos(ea);
            let ey = eh;
            let ez = er * Math.sin(ea) * 0.5; // Flatten ears
            
            // Transform to head position
            const xOffset = isLeft ? -1.2 * scale : 1.2 * scale;
            const yOffset = 1.0 * scale;
            
            x = ex + xOffset;
            y = ey + yOffset;
            z = ez;
        }
        break;
      }
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  return positions;
};