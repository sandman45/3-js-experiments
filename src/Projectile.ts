import * as THREE from 'three';

export class Projectile {
    public mesh: THREE.Mesh;
    private velocity: THREE.Vector3; // Velocity vector of the projectile

    constructor(position: THREE.Vector3, direction: THREE.Vector3) {
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        // Set the projectile's velocity based on the direction it's fired
        this.velocity = direction.clone().normalize().multiplyScalar(0.5); // Adjust speed as needed
    }

    public update(): void {
        // Update the projectile's position based on its velocity
        this.mesh.position.add(this.velocity);
    }
}