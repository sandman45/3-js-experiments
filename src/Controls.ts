import * as THREE from 'three';
import { FlyControls } from './Controls/FlyControls';
import { Projectile } from './Projectile';

export class Controls {
    private keys: { [key: string]: boolean } = {}; // Track pressed keys
    private targetObject: THREE.Group; // The object being controlled (e.g., the ship)
    private projectiles: Projectile[] = []; // Track projectiles
    private flyControls: FlyControls; // FlyControls instance
    private throttle: number = 0; // Throttle level (0 to 1, where 0 is stopped)
    private maxThrottle: number = .5; // Maximum throttle level
    private throttleIncrement: number = 0.01; // How much throttle increases/decreases per frame
    private rollSpeed: number = .55; // Roll speed is how quickly mouse move for space ship

    constructor(targetObject: THREE.Group, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
        this.targetObject = targetObject;

        this.flyControls = new FlyControls(this.targetObject, renderer.domElement);
        this.flyControls.movementSpeed = 200;
        this.flyControls.rollSpeed = this.rollSpeed;
        this.flyControls.dragToLook = false;
        
        // Add event listeners for keyboard and mouse input
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    private handleKeyDown(event: KeyboardEvent): void {
        this.keys[event.key.toLowerCase()] = true;
    }

    private handleKeyUp(event: KeyboardEvent): void {
        this.keys[event.key.toLowerCase()] = false;
    }

    public increaseThrottle(): void {
        this.throttle = Math.min(this.throttle + this.throttleIncrement, this.maxThrottle);
    }

    public decreaseThrottle(): void {
        this.throttle = Math.max(this.throttle - this.throttleIncrement, 0); // Throttle cannot go below 0
    }

    public shoot(): Projectile | null {
        if (this.keys[' ']) { // Spacebar to shoot
            // Calculate the ship's forward vector
            const forwardVector = new THREE.Vector3(0, 0, 1);
            forwardVector.applyQuaternion(this.targetObject.quaternion); // Transform to world space

            // Create a projectile with the ship's position and forward direction
            const projectile = new Projectile(this.targetObject.position.clone(), forwardVector);
            this.projectiles.push(projectile);
            return projectile;
        }
        return null;
    }

    public getProjectiles(): Projectile[] {
        return this.projectiles;
    }

    
    public getThrottle(): number {
        return this.throttle;
    }

    public getRollSpeed(): number {
        return this.rollSpeed;
    }

    public update(delta: number): void {
       
        // Update FlyControls
        this.flyControls.update(delta);

        // Throttle controls
        if (this.keys['='] || this.keys['+']) this.increaseThrottle(); // Increase throttle
        if (this.keys['-']) this.decreaseThrottle(); // Decrease throttle

        // // Move the ship forward based on throttle // Forward direction in local space
        const forwardVector = new THREE.Vector3(0, 0, 1); 
        forwardVector.applyQuaternion(this.targetObject.quaternion); // Transform to world space

        this.targetObject.position.add(forwardVector.multiplyScalar(this.throttle));

        // Update the ship's position and rotation to match the camera
        this.targetObject.position.copy(this.flyControls.object.position);
        this.targetObject.quaternion.copy(this.flyControls.object.quaternion);


        // Update projectiles
        this.projectiles.forEach(projectile => projectile.update());
    }
}