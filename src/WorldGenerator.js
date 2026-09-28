import * as THREE from 'three';
import { Body, Box } from 'cannon';

export class WorldGenerator {
  constructor() {
    this.seed = Math.random() * 10000;
    this.scale = 50;
  }

  // Simple Perlin-like noise function
  noise(x, y) {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
  }

  // Improved noise for smoother terrain
  perlinNoise(x, y) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;

    // Smoothstep interpolation
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);

    const n00 = this.noise(xi, yi);
    const n10 = this.noise(xi + 1, yi);
    const n01 = this.noise(xi, yi + 1);
    const n11 = this.noise(xi + 1, yi + 1);

    const nx0 = n00 * (1 - u) + n10 * u;
    const nx1 = n01 * (1 - u) + n11 * u;
    return nx0 * (1 - v) + nx1 * v;
  }

  generateTerrain(offsetX, offsetZ, chunkSize) {
    const voxels = [];
    const chunkWidth = 16;
    const chunkHeight = 64;
    const maxHeight = 40;
    const waterLevel = 20;

    for (let x = 0; x < chunkWidth * chunkSize; x++) {
      for (let z = 0; z < chunkWidth * chunkSize; z++) {
        // Generate height using noise
        const noiseX = (offsetX + x) / this.scale;
        const noiseZ = (offsetZ + z) / this.scale;

        let height = 0;
        let amplitude = 1;
        let frequency = 1;
        let maxAmplitude = 0;

        // Octave-based noise for natural terrain
        for (let i = 0; i < 4; i++) {
          height += this.perlinNoise(noiseX * frequency, noiseZ * frequency) * amplitude;
          maxAmplitude += amplitude;
          amplitude *= 0.5;
          frequency *= 2;
        }

        height = (height / maxAmplitude) * maxHeight + 15;
        height = Math.floor(height);

        // Generate vertical column
        for (let y = 0; y < height; y++) {
          let blockType = 'stone';

          if (y < 5) {
            blockType = 'stone';
          } else if (y < height - 3) {
            blockType = Math.random() > 0.7 ? 'chocolate' : 'dirt';
          } else if (y < height - 1) {
            blockType = 'dirt';
          } else if (y === height - 1) {
            blockType = y > waterLevel ? 'grass' : 'sand';
          }

          // Add some candy blocks for fun
          if (Math.random() < 0.05 && y > 5 && y < height - 5) {
            blockType = ['candy', 'caramel', 'lollipop'][Math.floor(Math.random() * 3)];
          }

          const worldX = offsetX + x;
          const worldZ = offsetZ + z;

          voxels.push({
            type: blockType,
            x: worldX,
            y: y,
            z: worldZ,
            body: this.createBlockBody(worldX, y, worldZ)
          });
        }

        // Add water
        if (height < waterLevel) {
          for (let y = height; y < waterLevel; y++) {
            const worldX = offsetX + x;
            const worldZ = offsetZ + z;
            voxels.push({
              type: 'water',
              x: worldX,
              y: y,
              z: worldZ,
              body: this.createBlockBody(worldX, y, worldZ)
            });
          }
        }
      }
    }

    return voxels;
  }

  createBlockBody(x, y, z) {
    const shape = new Box(new THREE.Vec3(0.5, 0.5, 0.5));
    const body = new Body({ mass: 0, shape });
    body.position.set(x + 0.5, y + 0.5, z + 0.5);
    return body;
  }
}
