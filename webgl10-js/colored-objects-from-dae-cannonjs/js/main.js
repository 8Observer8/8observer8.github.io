let ground, sphere, cone, monkey;
let cubes = [];

const projMatrix = glMatrix.mat4.create();
const viewMatrix = glMatrix.mat4.create();
const projViewMatrix = glMatrix.mat4.create();

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

initVertexBuffers(["assets/cube.dae", "assets/sphere.dae", "assets/cone.dae", "assets/monkey.dae"],
    (vertPosVBOs, normalVBOs, amounts) =>
    {
        const groundSize = [5, 5, 0.25];
        const groundShape = new CANNON.Box(new CANNON.Vec3(groundSize[0], groundSize[1], groundSize[2]));
        ground = new ObjectForPhysics(program, [0, -2, 0], glMatrix.quat.fromValues(-0.707, 0, 0, 0.707), groundSize,
            [0.584, 0.774, 0.474], amounts[0], vertPosVBOs[0], normalVBOs[0], null, null, world, groundShape, true);

        const cubeSize = [0.5, 0.5, 0.5];
        const cubeShape = new CANNON.Box(new CANNON.Vec3(cubeSize[0], cubeSize[1], cubeSize[2]));
        for (let i = 0; i < 5; ++i)
        {
            const cube = new ObjectForPhysics(program, [-2, i * 2, i * 0.11], glMatrix.quat.fromValues(-0.707, 0, 0, 0.707), cubeSize,
                [0.784, 0.274, 0.474], amounts[0], vertPosVBOs[0], normalVBOs[0], null, null, world, cubeShape, false);
            cubes.push(cube);
        }

        sphere = new ObjectForGraphics(program, [2, 1, 0], [0.796, 0.403, 0.101], amounts[1], vertPosVBOs[1], normalVBOs[1], null, null,);
        cone = new ObjectForGraphics(program, [0, 2, 0], [0.101, 0.556, 0.796], amounts[2], vertPosVBOs[2], normalVBOs[2], null, null,);
        monkey = new ObjectForGraphics(program, [0, 0, 0], [0.321, 0.796, 0.101], amounts[3], vertPosVBOs[3], normalVBOs[3], null, null,);
        init();
    });

function init()
{
    glMatrix.mat4.perspective(projMatrix, 55 * Math.PI / 180, 1, 0.1, 500);
    glMatrix.mat4.lookAt(viewMatrix, [3, 2, 12], [0, 0, 0], [0, 1, 0]);

    const lightPosition = glMatrix.vec3.fromValues(5, 7, 9);
    const uLightPositionLocation = gl.getUniformLocation(program, "uLightPosition");
    gl.uniform3fv(uLightPositionLocation, lightPosition);

    window.onresize = () =>
    {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        gl.canvas.width = w;
        gl.canvas.height = h;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        glMatrix.mat4.perspective(projMatrix, 55 * Math.PI / 180, w / h, 0.1, 500);
        simulationLoop();
    };
    window.onresize(null);
}

const fixedTimeStep = 0.015;
const maxSubSteps = 3;
let lastTime, dt;

function simulationLoop(time)
{
    requestAnimationFrame(simulationLoop);
    if (lastTime !== undefined)
    {
        dt = (time - lastTime) / 1000;
        world.step(fixedTimeStep, dt, maxSubSteps);
        for (let i = 0; i < 5; ++i)
        {
            cubes[i].update();
        }
        draw();
    }
    lastTime = time;
}

function draw()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    glMatrix.mat4.mul(projViewMatrix, projMatrix, viewMatrix);

    ground.draw(projViewMatrix);
    for (let i = 0; i < 5; ++i)
    {
        cubes[i].draw(projViewMatrix);
    }
    sphere.draw(projViewMatrix);
    cone.draw(projViewMatrix);
    monkey.draw(projViewMatrix);
}
