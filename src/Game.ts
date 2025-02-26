import * as THREE from 'three';
import { Ship } from './Ship';
import { EnemyShip } from './EnemyShip';
import { Asteroid } from './Asteroid';
import { Projectile } from './Projectile';
import { Lighting } from './Lighting';
import { SkyBox } from './SkyBox';

export class Game {
    private scene: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private lighting: Lighting;
    private ship: Ship;
    private goal: THREE.Object3D;
    private asteroids: Asteroid[] = [];
    private enemyShips: EnemyShip[] = [];
    private projectiles: Projectile[] = [];
    private skybox: SkyBox;

    constructor() {
        this.scene = new THREE.Scene();
        // this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.buildCamera({width: window.innerWidth, height: innerHeight});


        document.body.appendChild(this.renderer.domElement);
        this.skybox = new SkyBox();
        this.scene.add(this.skybox.mesh);
        this.scene.background = new THREE.Color(0xada2a2); // Hex color code

        this.ship = new Ship();
        this.scene.add(this.ship.mesh);
       
        this.lighting = new Lighting();
        this.scene.add(this.lighting.spotLight);
        this.scene.add(this.lighting.ambientLight);

        this.createAsteroids(4);
        this.createEnemyShips(8);

        // Add keyboard event listeners
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));

        this.goal = new THREE.Object3D();
        this.ship.mesh.add(this.goal);
        this.goal.position.set(0, 1, -4);
        this.setCameraPositionRelativeToMeshAndFollow();
    }

    private buildCamera({ width, height }: { width: number; height: number }) {
        const aspectRatio = width / height;
        const fieldOfView = 60;
        const nearPlane = 1;
        const farPlane = 3000;
        this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

        this.camera.position.y = 10;

        this.scene.add(this.camera);
    }

    private setCameraPositionRelativeToMeshAndFollow() {
        const temp = new THREE.Vector3();
        temp.setFromMatrixPosition(this.goal.matrixWorld);
        this.camera.position.lerp(temp, .2);
        this.camera.lookAt( this.ship.mesh.position );
    }

    private createAsteroids(count: number): void {
        for (let i = 0; i < count; i++) {
            const asteroid = new Asteroid();
            this.asteroids.push(asteroid);
            this.scene.add(asteroid.mesh);
        }
    }

    private createEnemyShips(count: number): void {
        for (let i = 0; i < count; i++) {
            const enemyShip = new EnemyShip();
            this.enemyShips.push(enemyShip);
            this.scene.add(enemyShip.mesh);
        }
    }

    private handleKeyDown(event: KeyboardEvent): void {
        this.ship.setMovement(event.key.toLowerCase(), true);
            
        // Shoot projectiles when Space is pressed
        if (event.code === 'Space') {
            const projectile = this.ship.shoot();
            this.projectiles.push(projectile);
            this.scene.add(projectile.mesh);
        }
        if (event.code === 'NumpadAdd' || event.code === 'Equal'){
            this.goal.position.y++;
        }
        if (event.code === 'NumpadSubtract' || event.code === 'Minus'){
            this.goal.position.y--;
        }
    }

    private handleKeyUp(event: KeyboardEvent): void {
        this.ship.setMovement(event.key.toLowerCase(), false);
    }

    public start(): void {
        const animate = () => {
            requestAnimationFrame(animate);

            this.ship.update();
            this.asteroids.forEach(asteroid => asteroid.update());
            this.enemyShips.forEach(enemyShip => enemyShip.update());
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
                this.enemyShips.forEach((enemyShip, aIndex) => {
                    if (projectile.mesh.position.distanceTo(enemyShip.mesh.position) < 2) {
                        this.scene.remove(projectile.mesh);
                        this.scene.remove(enemyShip.mesh);
                        this.projectiles.splice(pIndex, 1);
                        this.enemyShips.splice(aIndex, 1);
                    }
                });
            });

            this.setCameraPositionRelativeToMeshAndFollow();

            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }
}