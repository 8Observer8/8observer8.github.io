import * as THREE from "three";
import { PointerLockControls } from "pointer-lock-controls";

let renderer, scene, camera, controls;

const clock = new THREE.Clock(); // Required to get "delta" time

const PLAYER_HEIGHT = 1.8; // Constant height in meters/units

const instructions = document.getElementById("instructions");

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

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
    camera.position.y = PLAYER_HEIGHT; // Eye level

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

    controls = new PointerLockControls(camera, canvas);

    // When the user clicks the overlay, lock the pointer
    instructions.addEventListener("click", () => {
        if (!controls.isLocked) {
            controls.lock();
        }
    });

    // Hide overlay when locked
    controls.addEventListener("lock", () => {
        instructions.style.display = "none";
    });

    // Show overlay when unlocked (e.g. user hits ESC)
    controls.addEventListener("unlock", () => {
        instructions.style.display = "flex";
    });

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize(); // Necessary for FirstPersonControls
}

function onKeyDown(event) {
    switch (event.code) {
        case "KeyW":
            moveForward = true;
            break;
        case "KeyA":
            moveLeft = true;
            break;
        case "KeyS":
            moveBackward = true;
            break;
        case "KeyD":
            moveRight = true;
            break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case "KeyW":
            moveForward = false;
            break;
        case "KeyA":
            moveLeft = false;
            break;
        case "KeyS":
            moveBackward = false;
            break;
        case "KeyD":
            moveRight = false;
            break;
    }
}

function animate() {
    requestAnimationFrame(animate);

    if (controls.isLocked) {
        const delta = clock.getDelta();

        // Friction/Damping
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);

        if (moveForward || moveBackward) {
            velocity.z -= direction.z * 100.0 * delta;
        }

        if (moveLeft || moveRight) {
            velocity.x -= direction.x * 100.0 * delta;
        }

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
    }

    renderer.render(scene, camera);
}
