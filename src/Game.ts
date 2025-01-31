import * as THREE from 'three';
import { Ship } from './Ship';
import { Asteroid } from './Asteroid';
import { Projectile } from './Projectile';

export class Game {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private ship: Ship;
    private asteroids: Asteroid[] = [];
    private projectiles: Projectile[] = [];

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.ship = new Ship();
        this.scene.add(this.ship.mesh);

        this.createAsteroids(5);

        this.camera.position.z = 20;
        this.camera.lookAt(this.ship.mesh.position);

        // Add keyboard event listeners
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    private createAsteroids(count: number): void {
        for (let i = 0; i < count; i++) {
            const asteroid = new Asteroid();
            this.asteroids.push(asteroid);
            this.scene.add(asteroid.mesh);
        }
    }

    private handleKeyDown(event: KeyboardEvent): void {
        // this.ship.setMovement(event.key.toLowerCase(), true);

        // Shoot projectiles when Space is pressed
        if (event.code === 'Space') {
            const projectile = this.ship.shoot();
            this.projectiles.push(projectile);
            this.scene.add(projectile.mesh);
        }
    }

    private handleKeyUp(event: KeyboardEvent): void {
        // this.ship.setMovement(event.key.toLowerCase(), false);
    }

    public start(): void {
        const animate = () => {
            requestAnimationFrame(animate);

            this.ship.update();
            this.asteroids.forEach(asteroid => asteroid.update());
            this.projectiles.forEach(projectile => projectile.update());

            // Check for collisions
            this.projectiles.forEach((projectile, pIndex) => {
                this.asteroids.forEach((asteroid, aIndex) => {
                    if (projectile.mesh.position.distanceTo(asteroid.mesh.position) < 2) {
                        this.scene.remove(projectile.mesh);
                        this.scene.remove(asteroid.mesh);
                        this.projectiles.splice(pIndex, 1);
                        this.asteroids.splice(aIndex, 1);
                    }
                });
            });

            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }
}