const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

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
const material = new THREE.PointsMaterial({ 
    color: 0x2563eb, 
    size: 0.03, 
    transparent: true, 
    opacity: 0.4,
    sizeAttenuation: true 
});
const points = new THREE.Points(geometry, material);
scene.add(points);

camera.position.z = 5;

// Connection lines between particles
const lineGeometry = new THREE.BufferGeometry();
const linePositions = new Float32Array(particles * particles * 6);
lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
const lineMaterial = new THREE.LineBasicMaterial({ 
    color: 0x2563eb, 
    transparent: true, 
    opacity: 0.06,
    linewidth: 1 
});
const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
scene.add(lines);

// Mouse tracking
const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

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
    }, 100); 
});

function animate() {
    requestAnimationFrame(animate);

    // Subtle mouse influence on rotation
    points.rotation.x += (mouse.y * 0.001 - points.rotation.x * 0.001) * 0.1;
    points.rotation.y += (mouse.x * 0.001 - points.rotation.y * 0.001) * 0.1;

    if (isScrolling && scrollDirection > 0) {
        const positions = points.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += positions[i] * 0.01 * scrollDirection;
            positions[i + 1] += positions[i + 1] * 0.01 * scrollDirection;
            positions[i + 2] += positions[i + 2] * 0.01 * scrollDirection;

            if (Math.abs(positions[i]) > 5 || Math.abs(positions[i + 1]) > 5 || Math.abs(positions[i + 2]) > 5) {
                positions[i] = (Math.random() - 0.5) * 10;
                positions[i + 1] = (Math.random() - 0.5) * 10;
                positions[i + 2] = (Math.random() - 0.5) * 10;
            }
        }
        points.geometry.attributes.position.needsUpdate = true;
    } else {
        points.rotation.x += 0.0003;
        points.rotation.y += 0.0004;
    }

    // Update connection lines
    const pos = points.geometry.attributes.position.array;
    const linePos = lines.geometry.attributes.position.array;
    let lineIndex = 0;
    const maxDistance = 1.2;
    const maxLines = 200;
    let lineCount = 0;
    
    for (let i = 0; i < particles * 3 && lineCount < maxLines; i += 3) {
        for (let j = i + 3; j < particles * 3 && lineCount < maxLines; j += 3) {
            const dx = pos[i] - pos[j];
            const dy = pos[i + 1] - pos[j + 1];
            const dz = pos[i + 2] - pos[j + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (dist < maxDistance) {
                linePos[lineIndex++] = pos[i];
                linePos[lineIndex++] = pos[i + 1];
                linePos[lineIndex++] = pos[i + 2];
                linePos[lineIndex++] = pos[j];
                linePos[lineIndex++] = pos[j + 1];
                linePos[lineIndex++] = pos[j + 2];
                lineCount++;
            }
        }
    }
    
    for (let i = lineIndex; i < linePos.length; i++) {
        linePos[i] = 0;
    }
    lines.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});








// typed text 
const phrases = ["build responsive websites.", "build apps using Flutter.", "work on new projects.", "learn new frameworks."];
let currentPhraseIndex = 0;
let currentCharacterIndex = 0;
const typingSpeed = 90;
const erasingSpeed = 100;
const delayBetweenPhrases = 1000;
const typedTextElement = document.getElementById('typed-text');

function type() {
    if (currentCharacterIndex < phrases[currentPhraseIndex].length) {
        typedTextElement.textContent += phrases[currentPhraseIndex].charAt(currentCharacterIndex);
        currentCharacterIndex++;
        setTimeout(type, typingSpeed);
    } else {
        setTimeout(erase, delayBetweenPhrases);
    }
}

function erase() {
    if (currentCharacterIndex > 0) {
        typedTextElement.textContent = phrases[currentPhraseIndex].substring(0, currentCharacterIndex - 1);
        currentCharacterIndex--;
        setTimeout(erase, erasingSpeed);
    } else {
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        setTimeout(type, typingSpeed);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(type, delayBetweenPhrases);
});
