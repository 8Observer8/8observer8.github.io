let defaultProgram, edgeProgram;
let player, floor, edge, cube;
let debugDrawer, keyboard;
let debugMode = true;
const angularSpeed = 200;
const linearSpeed = 200;
const dt = 0.015;

const forward = glMatrix.vec3.fromValues(0, 0, 1);
const zUnit = glMatrix.vec3.fromValues(0, 0, 1);
const playerRotation = glMatrix.quat.create();
glMatrix.quat.rotationTo(playerRotation, zUnit, forward);
const direction = glMatrix.vec3.fromValues(forward[0], forward[1], forward[2]);
let dirAngle = 0;

const projMatrix = glMatrix.mat4.create();
const viewMatrix = glMatrix.mat4.create();
const projViewMatrix = glMatrix.mat4.create();

initVertexBuffers(["assets/player.dae", "assets/floor.dae", "assets/cube.dae"],
    (vertPosVBOs, normalVBOs, texCoordVBOs, amounts) =>
    {
        defaultProgram = createProgram("defaultVertexShader", "defaultFragmentShader");
        edgeProgram = createProgram("edgeVertexShader", "edgeFragmentShader");
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        Ammo().then(() =>
        {
            const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
            const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
            const overlappingPairCache = new Ammo.btDbvtBroadphase();
            const solver = new Ammo.btSequentialImpulseConstraintSolver();

            world = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
            world.setGravity(new Ammo.btVector3(0, -9.81, 0));

            const playerImage = document.getElementById("playerImage");
            const playerTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, playerTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, playerImage);
            const playserSize = 0.5;
            const playerShape = new Ammo.btSphereShape(playserSize);
            player = new ObjectForPhysics(defaultProgram, [0, 3, 2], playerRotation, amounts[0],
                vertPosVBOs[0], normalVBOs[0], texCoordVBOs[0], playerTexture, playerShape, 50);
            player.scale = [playserSize, playserSize, playserSize];
            player.body.setAngularFactor(0, 1, 0);
            player.body.setDamping(0.9, 0.99);

            const floorImage = document.getElementById("floorImage");
            const floorTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, floorTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, floorImage);
            const floorSize = [10, 1, 10];
            const floorShape = new Ammo.btBoxShape(
                new Ammo.btVector3(floorSize[0] / 2, floorSize[1] / 2, floorSize[2] / 2));
            floor = new ObjectForPhysics(defaultProgram, [0, -2, 0], [0, 0, 0, 1], amounts[1],
                vertPosVBOs[1], normalVBOs[1], texCoordVBOs[1], floorTexture, floorShape, 0);
            floor.scale = [10, 5, 10];

            edge = new ObjectForEdge(edgeProgram, amounts[2], vertPosVBOs[2]);
            debugDrawer = new DebugDrawer(edge);
            debugDrawer.debugMode = 1;

            keyboard = new Keyboard();

            init();
        });
    });

function init()
{
    glMatrix.mat4.perspective(projMatrix, 55 * Math.PI / 180, 1, 0.1, 500);
    glMatrix.mat4.lookAt(viewMatrix, [0, 3, 10], [0, 0, 0], [0, 1, 0]);

    gl.useProgram(defaultProgram);
    const lightPosition = glMatrix.vec3.fromValues(2, 3, 5);
    const uLightPositionLocation = gl.getUniformLocation(defaultProgram, "uLightPosition");
    gl.uniform3fv(uLightPositionLocation, lightPosition);

    window.onresize = () =>
    {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        gl.canvas.width = w;
        gl.canvas.height = h;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        glMatrix.mat4.perspective(projMatrix, 55 * Math.PI / 180, w / h, 0.1, 500);
        createPhysicsSimulation();
        draw();
    };
    window.onresize(null);

    document.onkeydown = (event) =>
    {
        if (event.repeat) return;

        if (event.key === "b")
        {
            debugMode = !debugMode;
            if (debugMode)
            {
                debugDrawer.debugMode = 1;
            }
            else
            {
                debugDrawer.debugMode = 0;
            }
        }
    }
}

function createPhysicsSimulation()
{
    setInterval(() =>
    {
        updatePhysics();
    }, 15);
}

function updatePhysics()
{
    if (keyboard.pressed("w"))
    {
        let vy = player.body.getLinearVelocity().y();
        const impulse = new Ammo.btVector3(direction[0] * linearSpeed * dt, vy, direction[2] * linearSpeed * dt);
        player.body.setLinearVelocity(impulse);
    }
    if (keyboard.pressed("s"))
    {
        const vy = player.body.getLinearVelocity().y();
        const impulse = new Ammo.btVector3(-direction[0] * linearSpeed * dt, vy, -direction[2] * linearSpeed * dt);
        player.body.setLinearVelocity(impulse);
    }
    if (keyboard.pressed("a"))
    {
        const impulse = new Ammo.btVector3(0, angularSpeed * dt, 0);
        player.body.setAngularVelocity(impulse);
    }
    if (keyboard.pressed("d"))
    {
        const impulse = new Ammo.btVector3(0, -angularSpeed * dt, 0);
        player.body.setAngularVelocity(impulse);
    }

    glMatrix.vec3.transformQuat(direction, forward, player.rotation);
    world.stepSimulation(dt, 8);
    player.update();
}

function draw()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    glMatrix.mat4.mul(projViewMatrix, projMatrix, viewMatrix);

    player.draw(projViewMatrix);
    floor.draw(projViewMatrix);

    debugDrawer.projViewMatrix = projViewMatrix;

    if (debugMode)
    {
        world.debugDrawWorld();
    }

    requestAnimationFrame(draw);
}
