import * as THREE from 'three';
import { World } from 'cannon';
import { Game } from './Game.js';
import { Player } from './Player.js';
import { WorldGenerator } from './WorldGenerator.js';
import { BlockManager } from './BlockManager.js';

// Initialize the game
const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);
const worldGenerator = new WorldGenerator();
const blockManager = new BlockManager(game.scene);
const player = new Player(game.camera, game.physics);

// Generate initial world
const terrain = worldGenerator.generateTerrain(0, 0, 8);
terrain.forEach(voxel => {
  const block = blockManager.createBlock(voxel.type, voxel.x, voxel.y, voxel.z);
  game.scene.add(block);
  game.physics.addBody(voxel.body);
});

// Input handling
const keys = {};
window.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
});
window.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
});

// Mouse handling for camera
let mouseDown = false;
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousedown', (e) => {
  if (e.button === 0) mouseDown = true;
  if (e.button === 2) {
    // Right click - place block
    player.placeBlock(game.scene, blockManager);
  }
});

document.addEventListener('mouseup', (e) => {
  if (e.button === 0) mouseDown = false;
});

document.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    player.rotateCamera(e.movementX, e.movementY);
  }
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Lock pointer on click
canvas.addEventListener('click', () => {
  canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
  canvas.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement === canvas) {
    console.log('Pointer locked');
  }
});

// Main game loop
function gameLoop() {
  requestAnimationFrame(gameLoop);

  // Update player movement
  player.update(keys);

  // Update physics
  game.physics.step(1 / 60);

  // Update camera position
  game.camera.position.copy(player.position);
  game.camera.lookAt(player.position.clone().add(player.direction));

  // Render
  game.render();
}

gameLoop();
