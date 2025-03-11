import * as THREE from 'three';
import { Projectile } from './Projectile';

export class Controls {
    private keys: { [key: string]: boolean } = {}; // Track pressed keys
    private mousePos: THREE.Vector2 = new THREE.Vector2();
    private maxMousePos: THREE.Vector2 = new THREE.Vector2(1, 1); // Normalized mouse position range
    private targetObject: THREE.Group; // The object being controlled (e.g., the ship)
    private positionalAcceleration: THREE.Vector3 = new THREE.Vector3(0.1, 0.1, 0.1);
    private positionalDeceleration: THREE.Vector3 = new THREE.Vector3(0.05, 0.05, 0.05);
    private maxPositionalVelocity: THREE.Vector3 = new THREE.Vector3(10, 10, 10);
    private maxNegativePositionalVelocity: THREE.Vector3 = new THREE.Vector3(-10, -10, -10);
    private maxRotationVelocity: THREE.Vector3 = new THREE.Vector3(Math.PI / 4, Math.PI / 4, Math.PI / 4);
    private rollAcceleration: number = 0.1;
    private rollDeceleration: number = 0.05;
    // Throttle
    private throttle: number = 0;
    private throttleIncrement:number = 0.005;
    private maxThrottle: number = 1;
    //speeds 
    private speed:number = 0;
    private rotationSpeed: number = .5;
    private strafeSpeed: number = .5;

    // Dead zone radius (20% of screen width/height)
    private deadZone: number = 0.2; 

    private projectiles: Projectile[] = []; // Track projectiles


    constructor(targetObject: THREE.Group) {
        this.targetObject = targetObject;

        // Add event listeners for keyboard and mouse input
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    private handleKeyDown(event: KeyboardEvent): void {
        this.keys[event.key.toLowerCase()] = true;
    }

    private handleKeyUp(event: KeyboardEvent): void {
        this.keys[event.key.toLowerCase()] = false;
    }

    private handleMouseMove(event: MouseEvent): void {
         // Calculate mouse position relative to the center of the screen
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1; // Range: [-1, 1]
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1; // Range: [-1, 1]

        // Apply dead zone
        this.mousePos.x = Math.abs(mouseX) > this.deadZone ? mouseX : 0;
        this.mousePos.y = Math.abs(mouseY) > this.deadZone ? mouseY : 0;
    }

    public setMovement(key: string, isMoving: boolean): void {
        console.log(`key: ${key}`);
    }
    
    public increaseThrottle(): void {
        this.throttle = Math.min(this.throttle + this.throttleIncrement, this.maxThrottle);
    }

    public decreaseThrottle(): void {
        // Throttle cannot go below 0
        this.throttle = Math.max(this.throttle - this.throttleIncrement, 0);
    }

    public pitch(amount: number): void {
        // Rotate the ship up or down (pitch)
        this.targetObject.rotation.x -= amount * this.rotationSpeed;
    }

    public yaw(amount: number): void {
        // Rotate the ship left or right (yaw)
        this.targetObject.rotation.y -= amount * this.rotationSpeed;
    }

    public roll(amount: number): void {
        // Rotate the ship around the forward axis (roll)
        this.targetObject.rotation.z += amount * this.rotationSpeed;
    }

    public rotateShip(mouseX: number, mouseY: number): void {
        // Rotate the ship based on mouse movement
        this.targetObject.rotation.y = -mouseX * this.rotationSpeed;
        this.targetObject.rotation.x = -mouseY * this.rotationSpeed;
    }

    
    public strafe(horizontal: number, vertical: number): void {
        // Calculate the right and up vectors based on the ship's current rotation
        const rightVector = new THREE.Vector3(1, 0, 0); // Right direction in local space
        rightVector.applyQuaternion(this.targetObject.quaternion); // Transform to world space

        const upVector = new THREE.Vector3(0, 1, 0); // Up direction in local space
        upVector.applyQuaternion(this.targetObject.quaternion); // Transform to world space

        // Move the ship side-to-side and up-down based on strafe input
        this.targetObject.position.add(rightVector.multiplyScalar(horizontal * this.strafeSpeed));
        this.targetObject.position.add(upVector.multiplyScalar(vertical * this.strafeSpeed));
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

    public update(): void {
        // Throttle controls
        if (this.keys['-']) this.decreaseThrottle(); // Decrease throttle
        if (this.keys['='] || this.keys['+']) this.increaseThrottle(); // Increase throttle

        // Move the ship forward based on throttle // Forward direction in local space
        const forwardVector = new THREE.Vector3(0, 0, 1); 
        forwardVector.applyQuaternion(this.targetObject.quaternion); // Transform to world space

        // Forward direction in local space
        this.targetObject.position.add(forwardVector.multiplyScalar(this.throttle));

        // Pitch controlsd
        if (this.keys['w']) this.targetObject.rotation.x -= 0.02; // Pitch up
        if (this.keys['s']) this.targetObject.rotation.x += 0.02; // Pitch down

        // Yaw controls
        if (this.keys['a']) this.targetObject.rotation.y += 0.02; // Yaw left
        if (this.keys['d']) this.targetObject.rotation.y -= 0.02; // Yaw right

        // Roll controls
        if (this.keys['q']) this.targetObject.rotation.z -= 0.02; // Roll left
        if (this.keys['e']) this.targetObject.rotation.z += 0.02; // Roll right

        // Strafe controls
        if (this.keys['r']) this.targetObject.position.y += 0.1; // Strafe up
        if (this.keys['f']) this.targetObject.position.y -= 0.1; // Strafe down

        // Mouse-based rotation (optional)
        this.targetObject.rotation.y += this.mousePos.x * 0.02; // Yaw based on mouse X
        this.targetObject.rotation.x += this.mousePos.y * 0.02; // Pitch based on mouse Y

        // Update projectiles
        this.projectiles.forEach(projectile => projectile.update());
    }
}