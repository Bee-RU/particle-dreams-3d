export type ShapeType = 'sphere' | 'cube' | 'heart' | 'tree' | 'cat' | 'spiral';

export interface ParticleConfig {
  count: number;
  shape: ShapeType;
  colorA: string;
  colorB: string;
  particleSize: number;
  speed: number;
  noiseStrength: number;
  hoverEffect: boolean;
}

export interface ShapeGeneratorParams {
  count: number;
  scale: number;
}
