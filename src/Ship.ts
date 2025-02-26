import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Projectile } from './Projectile';

export class Ship {
    public mesh: THREE.Group;
    private speed: number = 0.1;
    private moveForward: boolean = false;
    private moveBackward: boolean = false;
    private moveLeft: boolean = false;
    private moveRight: boolean = false;
    private moveUp: boolean = false;
    private moveDown: boolean = false;

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
                this.mesh.rotation.set(0, 3.15, 0); // Set initial position
            },
            undefined,
            (error) => {
                console.error('Error loading Ship model:', error);
            }
        );
    }

    public update(): void {
        // Move the ship based on keyboard input
        if (this.moveForward) this.mesh.position.z -= this.speed;
        if (this.moveBackward) this.mesh.position.z += this.speed;
        if (this.moveLeft) this.mesh.position.x -= this.speed;
        if (this.moveRight) this.mesh.position.x += this.speed;
        if (this.moveUp) this.mesh.position.y += this.speed;
        if (this.moveDown) this.mesh.position.y -= this.speed;
    }

    public setMovement(key: string, isMoving: boolean): void {
        console.log(`key: ${key}`);
        switch (key) {
            case 'w': this.moveForward = isMoving; break;
            case 's': this.moveBackward = isMoving; break;
            case 'a': this.moveLeft = isMoving; break;
            case 'd': this.moveRight = isMoving; break;
            case 'q': this.moveUp = isMoving; break;
            case 'e': this.moveDown = isMoving; break;
        }
    }

    public shoot(): Projectile {
        const projectile = new Projectile(this.mesh.position.clone());
        return projectile;
    }
}