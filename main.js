// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 20);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 10);
scene.add(light);

// Stars background
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];
for (let i = 0; i < 1000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = (Math.random() - 0.5) * 2000;
  starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Player spaceship
const shipGeometry = new THREE.ConeGeometry(1, 3, 16);
const shipMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const ship = new THREE.Mesh(shipGeometry, shipMaterial);
ship.position.set(0, 0, 0);
scene.add(ship);

// Ship movement
const shipSpeed = 0.1;
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp': ship.position.y += shipSpeed; break;
    case 'ArrowDown': ship.position.y -= shipSpeed; break;
    case 'ArrowLeft': ship.position.x -= shipSpeed; break;
    case 'ArrowRight': ship.position.x += shipSpeed; break;
  }
});


// Enemies and asteroids
const enemies = [];
const asteroidGeometry = new THREE.SphereGeometry(1, 8, 8);
const asteroidMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });

function spawnEnemy() {
  const enemy = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
  enemy.position.set(
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
    -50
  );
  scene.add(enemy);
  enemies.push(enemy);
}

// Spawn enemies periodically
setInterval(spawnEnemy, 2000);


// Bullets
const bullets = [];
const bulletGeometry = new THREE.SphereGeometry(0.1);
const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

function shoot() {
  const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
  bullet.position.copy(ship.position);
  scene.add(bullet);
  bullets.push(bullet);
}

document.addEventListener('keydown', (event) => {
  if (event.key === ' ') shoot(); // Spacebar to shoot
});

// Update bullets
function updateBullets() {
  bullets.forEach((bullet, index) => {
    bullet.position.z -= 0.5;
    if (bullet.position.z < -50) {
      scene.remove(bullet);
      bullets.splice(index, 1);
    }
  });
}



function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
      enemies.forEach((enemy, enemyIndex) => {
        if (bullet.position.distanceTo(enemy.position) < 1) {
          scene.remove(bullet);
          scene.remove(enemy);
          bullets.splice(bulletIndex, 1);
          enemies.splice(enemyIndex, 1);
        }
      });
    });
  }


// Render loop
  function animate() {
    requestAnimationFrame(animate);
  
    // Move enemies
    enemies.forEach(enemy => {
      enemy.position.z += 0.1;
      if (enemy.position.z > 10) {
        scene.remove(enemy);
        enemies.splice(enemies.indexOf(enemy), 1);
      }
    });
  
    // Update bullets and check collisions
    updateBullets();
    checkCollisions();
  
    renderer.render(scene, camera);
  }
  animate();