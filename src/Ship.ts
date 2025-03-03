import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Projectile } from './Projectile';

export class Ship {
    public mesh: THREE.Group;
    private speed: number = 0.1;
    private throttle: number = 0; // Throttle level (0 to 1)
    private maxThrottle: number = 2; // Maximum throttle level
    private throttleIncrement: number = 0.01; // How much throttle increases/decreases per frame
    private rotationSpeed: number = 0.02; // Speed of rotation based on mouse movement
    private strafeSpeed: number = 0.05; // Speed of strafing (side-to-side and up-down movement)

    constructor() {
        this.mesh = new THREE.Group();
        this.loadModel();
    }

    private loadModel(): void {
        const loader = new GLTFLoader();
        const modelPath = '/x-wing.glb';
        loader.load(
            modelPath, // Path to your 3D model
            (gltf) => {
                this.mesh.add(gltf.scene); // Add the loaded model to the ship's mesh
                this.mesh.scale.set(1, 1, 1); // Scale the model if needed
                this.mesh.position.set(0, 1, 0);
                this.mesh.rotation.set(0, 0, 0); // Set initial position (0,3.15,0)
            },
            undefined,
            (error) => {
                console.error('Error loading Ship model:', error);
            }
        );
    }

    public update(): void {
        // Move the ship forward based on throttle
        const forwardVector = new THREE.Vector3(0, 0, 1); // Forward direction in local space
        forwardVector.applyQuaternion(this.mesh.quaternion); // Transform to world space
        this.mesh.position.add(forwardVector.multiplyScalar(this.throttle * this.speed));
    }

    public setMovement(key: string, isMoving: boolean): void {
        console.log(`key: ${key}`);
    }
    
    public increaseThrottle(): void {
        this.throttle = Math.min(this.throttle + this.throttleIncrement, this.maxThrottle);
    }

    public decreaseThrottle(): void {
        this.throttle = Math.max(this.throttle - this.throttleIncrement, 0);
    }

    public pitch(amount: number): void {
        // Rotate the ship up or down (pitch)
        this.mesh.rotation.x += amount * this.rotationSpeed;
    }

    public yaw(amount: number): void {
        // Rotate the ship left or right (yaw)
        this.mesh.rotation.y += amount * this.rotationSpeed;
    }

    public roll(amount: number): void {
        // Rotate the ship around the forward axis (roll)
        this.mesh.rotation.z += amount * this.rotationSpeed;
    }

    public rotateShip(mouseX: number, mouseY: number): void {
        // Rotate the ship based on mouse movement
        this.mesh.rotation.y = -mouseX * this.rotationSpeed;
        this.mesh.rotation.x = -mouseY * this.rotationSpeed;
    }

    
    public strafe(horizontal: number, vertical: number): void {
        // Calculate the right and up vectors based on the ship's current rotation
        const rightVector = new THREE.Vector3(1, 0, 0); // Right direction in local space
        rightVector.applyQuaternion(this.mesh.quaternion); // Transform to world space

        const upVector = new THREE.Vector3(0, 1, 0); // Up direction in local space
        upVector.applyQuaternion(this.mesh.quaternion); // Transform to world space

        // Move the ship side-to-side and up-down based on strafe input
        this.mesh.position.add(rightVector.multiplyScalar(horizontal * this.strafeSpeed));
        this.mesh.position.add(upVector.multiplyScalar(vertical * this.strafeSpeed));
    }

    public shoot(): Projectile {
       // Calculate the ship's forward vector
       const forwardVector = new THREE.Vector3(0, 0, 1);
       forwardVector.applyQuaternion(this.mesh.quaternion); // Transform to world space

       // Create a projectile with the ship's position and forward direction
       const projectile = new Projectile(this.mesh.position.clone(), forwardVector);
       return projectile;
    }
}