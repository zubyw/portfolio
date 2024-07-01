const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 0.3);

const geometry = new THREE.BufferGeometry();
const particles = 1000;
const positions = new Float32Array(particles * 3);
const velocities = new Float32Array(particles * 3);

for (let i = 0; i < particles * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 10;
    positions[i + 1] = (Math.random() - 0.5) * 10;
    positions[i + 2] = (Math.random() - 0.5) * 10;
    
    velocities[i] = (Math.random() - 0.5) * 0.01;
    velocities[i + 1] = (Math.random() - 0.5) * 0.01;
    velocities[i + 2] = (Math.random() - 0.5) * 0.01;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const material = new THREE.PointsMaterial({ color: 0xcccccc, size: 0.02 });
const points = new THREE.Points(geometry, material);
scene.add(points);

camera.position.z = 5;

let isScrolling = false;
let scrollDirection = 0;
let lastScrollTop = 0;
let scrollTimeout;

window.addEventListener('scroll', () => {
    isScrolling = true;
    clearTimeout(scrollTimeout);

    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop) {
        scrollDirection = 1; // Scrolling down
    } else {
        scrollDirection = -1; // Scrolling up
    }
    lastScrollTop = st <= 0 ? 0 : st;

    scrollTimeout = setTimeout(() => {
        isScrolling = false;
    }, 100); // Reset isScrolling after 100ms of no scrolling
});

function animate() {
    requestAnimationFrame(animate);

    if (isScrolling) {
        // Scrolling effect: move particles based on scroll direction
        const positions = points.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += positions[i] * 0.01 * scrollDirection;
            positions[i + 1] += positions[i + 1] * 0.01 * scrollDirection;
            positions[i + 2] += positions[i + 2] * 0.01 * scrollDirection;

            // Reset particles that go too far
            if (Math.abs(positions[i]) > 5 || Math.abs(positions[i + 1]) > 5 || Math.abs(positions[i + 2]) > 5) {
                positions[i] = (Math.random() - 0.5) * 10;
                positions[i + 1] = (Math.random() - 0.5) * 10;
                positions[i + 2] = (Math.random() - 0.5) * 10;
            }
        }
        points.geometry.attributes.position.needsUpdate = true;
    } else {
        // Original effect: gentle rotation
        points.rotation.x += 0.0005;
        points.rotation.y += 0.0005;
    }

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});