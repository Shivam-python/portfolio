import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// Instantiate a loader
import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('contact-div');
const width = Math.max(container.clientWidth, 350) || 600;
const height = container.clientHeight || 600;
console.log('width', width);
console.log('height', height);
let fov = fetchFov(width);
const clock = new THREE.Clock();
let mixer;

const scene = new THREE.Scene();
function setCamera(fov, width, height) {
    // confirm(fov)
    let camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 100);
    camera.position.set(2, 0, 5);
    return camera
}

function fetchFov(width) {
    if (width <= 400) {
        return 45;
    } else if (width < 800) {
        return 28;
    } else {
        return 20;
    }
}
const camera = setCamera(fov, width, height);


const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(width, height);
container.appendChild(renderer.domElement);


function resizeRenderer() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    fov = fetchFov(width);
    const camera = setCamera(fov, width, height);
    camera.aspect = width / height;

    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

window.addEventListener('resize', resizeRenderer);
resizeRenderer();

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableZoom = false;
controls.maxPolarAngle = Math.PI / 2; // 90 degrees = horizontal
controls.minPolarAngle = Math.PI / 2; // also 90 = lock to horizontal
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

controls.update();

const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
scene.add(ambientLight);

const loader = new GLTFLoader().setPath('earth_cartoon/');
loader.load('scene.gltf', async function (gltf) {

    const model = gltf.scene;
    await renderer.compileAsync(model, camera, scene);
    scene.add(model);

    // Setup animation mixer if animations exist
    if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach(clip => {
            mixer.clipAction(clip).play();
        });
    }

});

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    controls.update();  // ✅ This is necessary for autoRotate to work


    renderer.render(scene, camera);
}
animate();
