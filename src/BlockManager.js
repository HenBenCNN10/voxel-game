import * as THREE from 'three';
import { Body, Box } from 'cannon';

const BLOCK_TYPES = {
  grass: { color: 0x7cb342, texture: 'grass' },
  dirt: { color: 0x8d6e63, texture: 'dirt' },
  stone: { color: 0x9e9e9e, texture: 'stone' },
  candy: { color: 0xff69b4, texture: 'candy' },
  chocolate: { color: 0x8b4513, texture: 'chocolate' },
  caramel: { color: 0xd4a574, texture: 'caramel' },
  sugar: { color: 0xffffff, texture: 'sugar' },
  lollipop: { color: 0xff1493, texture: 'lollipop' },
  sand: { color: 0xf4a460, texture: 'sand' },
  water: { color: 0x1e90ff, texture: 'water' },
  ice: { color: 0xb0e0e6, texture: 'ice' }
};

export class BlockManager {
  constructor(scene) {
    this.scene = scene;
    this.blocks = new Map();
    this.blockSize = 1;
  }

  createBlock(type, x, y, z) {
    const key = `${x},${y},${z}`;
    if (this.blocks.has(key)) return null;

    const blockData = BLOCK_TYPES[type] || BLOCK_TYPES.stone;
    const geometry = new THREE.BoxGeometry(this.blockSize, this.blockSize, this.blockSize);
    const material = new THREE.MeshStandardMaterial({
      color: blockData.color,
      roughness: 0.7,
      metalness: 0.1
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x + 0.5, y + 0.5, z + 0.5);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.type = type;
    mesh.userData.coords = { x, y, z };

    this.scene.add(mesh);
    this.blocks.set(key, mesh);

    return mesh;
  }

  removeBlock(x, y, z) {
    const key = `${x},${y},${z}`;
    const block = this.blocks.get(key);
    if (block) {
      this.scene.remove(block);
      this.blocks.delete(key);
    }
  }

  getBlock(x, y, z) {
    const key = `${x},${y},${z}`;
    return this.blocks.get(key);
  }
}
