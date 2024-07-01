
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 0.3); // Set a slightly transparent white background

const geometry = new THREE.BufferGeometry();
const particles = 1000;
const positions = new Float32Array(particles * 3);

for (let i = 0; i < particles * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 10;
    positions[i + 1] = (Math.random() - 0.5) * 10;
    positions[i + 2] = (Math.random() - 0.5) * 10;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const material = new THREE.PointsMaterial({ color: 0xcccccc, size: 0.02 });
const points = new THREE.Points(geometry, material);
scene.add(points);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    points.rotation.x += 0.0005;
    points.rotation.y += 0.0005;
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
