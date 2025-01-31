import * as THREE from 'three';

export class Projectile {
    public mesh: THREE.Mesh;
    private speed: number = 0.5;

    constructor(position: THREE.Vector3) {
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
    }

    public update(): void {
        this.mesh.position.z -= this.speed;
    }
}