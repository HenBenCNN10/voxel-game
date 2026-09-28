import * as THREE from 'three';
import { Body, Sphere, Box } from 'cannon';

export class Player {
  constructor(camera, physicsWorld) {
    this.camera = camera;
    this.physicsWorld = physicsWorld;
    this.position = new THREE.Vector3(0, 50, 0);
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3(0, 0, -1);
    this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
    this.PI_2 = Math.PI / 2;

    // Player physics body
    const playerShape = new Sphere(0.5);
    this.body = new Body({ mass: 1, shape: playerShape });
    this.body.linearDamping = 0.3;
    this.body.position.set(this.position.x, this.position.y, this.position.z);
    physicsWorld.addBody(this.body);

    // Camera offset from body
    this.cameraOffset = new THREE.Vector3(0, 0.6, 0);

    // Movement properties
    this.speed = 20;
    this.jumpForce = 15;
    this.isGrounded = false;
    this.canJump = true;

    // Raycaster for block interaction
    this.raycaster = new THREE.Raycaster();
    this.selectedBlock = null;
    this.blockReach = 5;
  }

  update(keys) {
    // Calculate movement direction
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    const moveDirection = new THREE.Vector3();

    // Get camera direction
    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    if (keys['w']) moveDirection.add(forward);
    if (keys['s']) moveDirection.sub(forward);
    if (keys['a']) moveDirection.sub(right);
    if (keys['d']) moveDirection.add(right);

    if (moveDirection.length() > 0) {
      moveDirection.normalize();
      this.body.velocity.x = moveDirection.x * this.speed;
      this.body.velocity.z = moveDirection.z * this.speed;
    } else {
      this.body.velocity.x *= 0.8;
      this.body.velocity.z *= 0.8;
    }

    // Jump
    if (keys[' '] && this.canJump) {
      this.body.velocity.y = this.jumpForce;
      this.canJump = false;
      this.isGrounded = false;
    }

    // Gravity and ground detection
    this.body.velocity.y -= 9.8 * 0.016; // Simple gravity

    // Update position from physics body
    this.position.copy(this.body.position);

    // Update camera position
    this.camera.position.copy(this.position).add(this.cameraOffset);
  }

  rotateCamera(deltaX, deltaY) {
    const sensitivity = 0.003;
    this.euler.setFromQuaternion(this.camera.quaternion);
    this.euler.rotateY(-deltaX * sensitivity);
    this.euler.rotateX(-deltaY * sensitivity);
    this.euler.x = Math.max(-this.PI_2, Math.min(this.PI_2, this.euler.x));
    this.camera.quaternion.setFromEuler(this.euler);
  }

  placeBlock(scene, blockManager) {
    // Cast ray to find block placement position
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const intersects = this.raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const pos = hit.point.clone();
      const normal = hit.face.normal.clone();
      normal.transformDirection(hit.object.matrixWorld);

      // Place block next to hit position
      const newPos = pos.clone().add(normal);
      const blockType = 'candy';
      blockManager.createBlock(blockType, Math.round(newPos.x), Math.round(newPos.y), Math.round(newPos.z));
    }
  }
}
