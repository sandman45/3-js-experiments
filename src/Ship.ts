import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Controls } from './Controls';

export class Ship {
    public mesh: THREE.Group;
    private controls: Controls;
   
    constructor(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
        this.mesh = new THREE.Group();
        this.loadModel();

        // Initialize controls for this ship
        this.controls = new Controls(this.mesh, camera, renderer);
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
                this.mesh.rotation.set(0, 3.15, 0); // Set initial position (0,3.15,0)
            },
            undefined,
            (error) => {
                console.error('Error loading Ship model:', error);
            }
        );
    }

    public getControls(): Controls {
        return this.controls;
    }

    public update(delta: number): void {

        // Update controls (e.g., handle input and apply movement/rotation)
        this.controls.update(delta);
    }
}