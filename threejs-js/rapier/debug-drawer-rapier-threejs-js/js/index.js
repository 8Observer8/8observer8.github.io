import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";

async function runDemo() {
    // Initialize Rapier Physics
    await RAPIER.init();
    const gravity = { x: 0.0, y: -9.81, z: 0.0 };
    const world = new RAPIER.World(gravity);

    // Setup Three.js Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, 10);

    const canvas = document.getElementById("renderCanvas");
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Resize Handler
    window.addEventListener("resize", () => {
        // Update Camera
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        // Update Renderer
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Debug Mesh
    const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true });
    const lineGeometry = new THREE.BufferGeometry();
    const debugMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(debugMesh);

    // Create Physics Objects
    // Static Floor
    const groundDesc = RAPIER.RigidBodyDesc.fixed();
    const groundBody = world.createRigidBody(groundDesc);
    const groundCollider = RAPIER.ColliderDesc.cuboid(5, 0.1, 5);
    world.createCollider(groundCollider, groundBody);
    // Dynamic Cube
    const cubeBody = world.createRigidBody(
        RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 10, 0)
    );
    world.createCollider(RAPIER.ColliderDesc.cuboid(1, 1, 1), cubeBody);

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        // Step physics
        world.step();

        const { vertices, colors } = world.debugRender();

        lineGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
        lineGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 4));

        renderer.render(scene, camera);
    }

    animate();
}

runDemo();
