import * as THREE from 'three';

export class Asteroid {
    public mesh: THREE.Mesh;

    constructor() {
        const geometry = new THREE.SphereGeometry(1, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0x888888 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
        );
    }

    public update(): void {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
    }
}