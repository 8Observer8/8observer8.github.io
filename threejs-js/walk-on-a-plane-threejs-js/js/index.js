import * as THREE from "three";
import { FirstPersonControls } from "first-person-controls";

let renderer, scene, camera, controls;

const clock = new THREE.Clock(); // Required to get "delta" time

const PLAYER_HEIGHT = 1.8; // Constant height in meters/units

function main() {
    init();
    window.addEventListener("resize", onWindowResize, false);
    animate();
}

// Ensure the DOM is loaded
window.onload = main;

function init() {
    const canvas = document.getElementById("renderCanvas");

    renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 10); // Sit slightly above the floor

    const grid = new THREE.GridHelper(100, 100);
    scene.add(grid);

    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshStandardMaterial({ color: 0x808080 })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    // Initialize FirstPersonControls
    controls = new FirstPersonControls(camera, canvas);
    controls.movementSpeed = 10; // How fast you move
    controls.lookSpeed = 0.1; // How fast you turn
    controls.lookVertical = true; // Allow looking up and down
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize(); // Necessary for FirstPersonControls
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    controls.update(delta); // Critical: Updates camera position based on keys/mouse

    // Lock the Y-axis to simulate walking on a floor
    camera.position.y = PLAYER_HEIGHT;

    renderer.render(scene, camera);
}
