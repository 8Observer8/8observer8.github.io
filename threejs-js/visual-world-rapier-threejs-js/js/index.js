import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";

async function runDemo() {
    // Initialize Rapier Physics
    await RAPIER.init();
    const gravity = { x: 0.0, y: -9.81, z: 0.0 };
    const world = new RAPIER.World(gravity);

    // Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x22262e);
    scene.fog = new THREE.Fog(0x22262e, 10, 50);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 10, 10);
    camera.lookAt(0, 0, 0);

    const canvas = document.getElementById("renderCanvas");
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Add simple lighting for the graphics
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // Debug Lines Setup
    const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true });
    const lineGeometry = new THREE.BufferGeometry();
    const debugMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(debugMesh);

    let showDebug = true;
    window.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "l") {
            showDebug = !showDebug;
            debugMesh.visible = showDebug;
        }
    });

    // Ground (Physics + Visual)
    const groundSize = { x: 10, y: 0.2, z: 10 };
    // Physics    
    const groundDesc = RAPIER.RigidBodyDesc.fixed();
    const groundBody = world.createRigidBody(groundDesc);
    const groundCollider = RAPIER.ColliderDesc.cuboid(groundSize.x / 2,
        groundSize.y / 2, groundSize.z / 2);
    world.createCollider(groundCollider, groundBody);
    // Visual
    const groundMesh = new THREE.Mesh(
        new THREE.BoxGeometry(groundSize.x, groundSize.y, groundSize.z),
        new THREE.MeshStandardMaterial({
            color: 0xaaaaaa,
            roughness: 0.4,
            metalness: 0.2
        })
    );
    scene.add(groundMesh);

    // Cube (Physics + Visual)
    const cubeSize = { x: 2, y: 2, z: 2 };
    // Physics
    const cubeDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(0, 10, 0)
        .setRotation({ w: 1, x: 0, y: 0.4, z: 0 });
    const cubeBody = world.createRigidBody(cubeDesc);
    const cubeCollider = RAPIER.ColliderDesc.cuboid(cubeSize.x / 2,
        cubeSize.y / 2, cubeSize.z / 2);
    world.createCollider(cubeCollider, cubeBody);
    // Visual
    const cubeMesh = new THREE.Mesh(
        new THREE.BoxGeometry(cubeSize.x, cubeSize.y, cubeSize.z),
        new THREE.MeshStandardMaterial({
            color: 0x00ff66, // High-vis vibrant orange
            roughness: 0.3,
            metalness: 0.1
        })
    );
    scene.add(cubeMesh);

    // Resize Handler
    window.addEventListener("resize", () => {
        // Update Camera
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        // Update Renderer
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        // Step physics
        world.step();

        // Sync Cube Visual with Physics
        const position = cubeBody.translation();
        const rotation = cubeBody.rotation();
        cubeMesh.position.set(position.x, position.y, position.z);
        cubeMesh.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);

        if (showDebug) {
            const { vertices, colors } = world.debugRender();
            lineGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
            lineGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 4));
        }

        renderer.render(scene, camera);
    }

    animate();
}

runDemo();
