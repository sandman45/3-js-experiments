import * as THREE from 'three';
import { Projectile } from './Projectile';

export class Ship {
    public mesh: THREE.Mesh;
    private speed: number = 0.1;
    private moveForward: boolean = false;
    private moveBackward: boolean = false;
    private moveLeft: boolean = false;
    private moveRight: boolean = false;
    private moveUp: boolean = false;
    private moveDown: boolean = false;

    constructor() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.mesh = new THREE.Mesh(geometry, material);
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