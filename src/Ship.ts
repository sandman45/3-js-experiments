import * as THREE from 'three';
import { Projectile } from './Projectile';

export class Ship {
    public mesh: THREE.Mesh;
    private speed: number = 0.1;

    constructor() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.mesh = new THREE.Mesh(geometry, material);
    }

    public update(): void {
        if (this.mesh.position.x > 10 || this.mesh.position.x < -10) {
            this.mesh.position.x = 0;
        }
        if (this.mesh.position.y > 10 || this.mesh.position.y < -10) {
            this.mesh.position.y = 0;
        }
    }

    public shoot(): Projectile {
        const projectile = new Projectile(this.mesh.position.clone());
        return projectile;
    }
}