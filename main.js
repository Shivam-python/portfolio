import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// Instantiate a loader
import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('split-right');
const width = container.clientWidth || 1000;
const height = container.clientHeight || 600;
const clock = new THREE.Clock();
let mixer;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
camera.position.set(0, 1, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

function resizeRenderer() {
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

window.addEventListener('resize', resizeRenderer);
resizeRenderer();

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 2;
controls.update();


const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);


const loader = new GLTFLoader().setPath('naruto/');
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
