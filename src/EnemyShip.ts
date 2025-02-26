import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class EnemyShip {
    public mesh: THREE.Group;

    constructor() {
        this.mesh = new THREE.Group();
        this.loadModel();
        this.mesh.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
        );
    }

    private loadModel(): void {
        const loader = new GLTFLoader();
        const modelPath = '/tie-bomber.glb';
        loader.load(
            modelPath, // Path to your 3D model
            (gltf) => {
                this.mesh.add(gltf.scene); // Add the loaded model to the ship's mesh
                this.mesh.scale.set(0.5, 0.5, 0.5); // Scale the model if needed
                this.mesh.position.set(
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20
                ); // Set initial position
            },
            undefined,
            (error) => {
                console.error('Error loading EnemyShip model:', error);
            }
        );
    }


    public update(): void {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
    }
}