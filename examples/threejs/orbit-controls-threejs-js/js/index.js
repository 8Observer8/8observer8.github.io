import * as THREE from "three";
import { OrbitControls } from "orbit-controls";

let renderer, scene, camera, controls, cube;

function main() {
    init();
    window.onresize = onWindowResize;
    animate();
}

window.onload = main;

function init() {
    const canvas = document.getElementById("renderCanvas");

    renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(5, 5, 10);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth movement

    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff88 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 4, 3);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// import * as THREE from "three";
// import { OrbitControls } from "orbit-controls";

// let renderer, scene, camera, controls, cube;

// function main() {
//     init();
//     window.onresize = onWindowResize;
//     animate();
// }

// window.onload = main;

// function init() {
//     const canvas = document.getElementById("renderCanvas");

//     renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);

//     scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x222222);

//     camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
//     camera.position.set(5, 5, 10);

//     controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true; // Smooth movement

//     const geometry = new THREE.BoxGeometry(2, 2, 2);
//     const material = new THREE.MeshStandardMaterial({ color: 0x00ff88 });
//     cube = new THREE.Mesh(geometry, material);
//     scene.add(cube);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//     directionalLight.position.set(5, 4, 3);
//     scene.add(directionalLight);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
//     scene.add(ambientLight);
// }

// function onWindowResize() {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
// }

// function animate() {
//     requestAnimationFrame(animate);
//     controls.update();
//     renderer.render(scene, camera);
// }
