import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";

async function runDemo() {
    // Initialize Rapier Physics
    await RAPIER.init();
    const gravity = { x: 0.0, y: -9.81, z: 0.0 };
    const world = new RAPIER.World(gravity);

    // Scene & Renderer Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(12, 12, 12);
    camera.lookAt(0, 0, 0);

    const canvas = document.getElementById("renderCanvas");
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Enable Shadows
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Add simple lighting for the graphics
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(10, 20, 10);
    sunLight.castShadow = true;
    // Improve shadow quality
    sunLight.shadow.camera.left = -10;
    sunLight.shadow.camera.right = 10;
    sunLight.shadow.camera.top = 10;
    sunLight.shadow.camera.bottom = -10;
    scene.add(sunLight);

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

    // Ground (Light Gray / Neutral)
    const groundSize = { x: 20, y: 0.5, z: 20 };

    // Physics    
    const groundDesc = RAPIER.RigidBodyDesc.fixed();
    const groundBody = world.createRigidBody(groundDesc);
    const groundCollider = RAPIER.ColliderDesc.cuboid(groundSize.x / 2,
        groundSize.y / 2, groundSize.z / 2);
    world.createCollider(groundCollider, groundBody);

    // Visual
    const groundMesh = new THREE.Mesh(
        new THREE.BoxGeometry(groundSize.x, groundSize.y, groundSize.z),
        new THREE.MeshStandardMaterial({ color: 0xeeeeee })
    );
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Multi-Cube Logic
    const dynamicObjects = [];

    function spawnCube(x, y, z) {
        const cubeSize = 1;

        // Physics
        const cubeDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(0, 10, 0)
            .setRotation({ w: 1, x: Math.random(), y: Math.random(), z: Math.random() });
        const cubeBody = world.createRigidBody(cubeDesc);
        const cubeCollider = RAPIER.ColliderDesc.cuboid(cubeSize / 2,
            cubeSize / 2, cubeSize / 2);
        world.createCollider(cubeCollider, cubeBody);

        // Visual
        const cubeMesh = new THREE.Mesh(
            new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
            new THREE.MeshStandardMaterial({
                color: 0x00ff66, // High-vis vibrant orange
                roughness: 0.3
            })
        );
        cubeMesh.castShadow = true;
        cubeMesh.receiveShadow = true;
        scene.add(cubeMesh);

        dynamicObjects.push({ cubeBody, cubeMesh });
    }

    // Spawn a stack of cubes
    for (let i = 0; i < 8; i++) {
        spawnCube(0, 5 + (i * 1.2), 0);
    }

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
        dynamicObjects.forEach(obj => {
            const position = obj.cubeBody.translation();
            const rotation = obj.cubeBody.rotation();
            obj.cubeMesh.position.set(position.x, position.y, position.z);
            obj.cubeMesh.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
        });

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
