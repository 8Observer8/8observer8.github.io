
const worldScale = 30;
const world = new planck.World({ gravity: planck.Vec2(0, 9.8) });

const projMatrix = glMatrix.mat4.create();
const viewMatrix = glMatrix.mat4.create();
const projViewMatrix = glMatrix.mat4.create();

const fieldWidth = 5;
const fieldHeight = 5;

let elements = new Array(fieldHeight);
let mouseVec;

const output = document.getElementById("output");

function getBodyCallback(fixture)
{
    if (fixture.getShape().testPoint(fixture.getBody().getTransform(), mouseVec))
    {
        const userData = fixture.getUserData();
        const column = userData.position[0];
        const row = userData.position[1];

        if (elements[row][column].mine)
        {
            uncoverMines();
            console.log("you lose");
            output.innerHTML = "you lose";
            draw();
        }
        else
        {
            elements[row][column].setElementType(adjacentMines(column, row));

            const visited = new Array(fieldHeight);
            for (let r = 0; r < fieldHeight; ++r)
            {
                visited[r] = new Array(fieldWidth);
            }
            floodFillUncover(column, row, visited);

            if (isFinished())
            {
                console.log("you win");
                output.innerHTML = "you win";
            }

            draw();
        }
    }
    return true;
}

function uncoverMines()
{
    for (let r = 0; r < fieldHeight; ++r)
    {
        for (let c = 0; c < fieldWidth; ++c)
        {
            if (elements[r][c].mine)
            {
                elements[r][c].setElementType(ElementType.Mine);
            }
        }
    }
}

function mineAt(x, y)
{
    if (x >= 0 && y >= 0 && x < fieldWidth && y < fieldHeight)
    {
        return elements[y][x].mine;
    }
    return false;
}

function adjacentMines(x, y)
{
    let count = 0;

    if (mineAt(x, y - 1)) ++count;      // top
    if (mineAt(x + 1, y - 1)) ++count;  // top-right
    if (mineAt(x + 1, y)) ++count;      // right
    if (mineAt(x + 1, y + 1)) ++count;  // bottom-right
    if (mineAt(x, y + 1)) ++count;      // bottom
    if (mineAt(x - 1, y + 1)) ++count;  // bottom-left
    if (mineAt(x - 1, y)) ++count;      // left
    if (mineAt(x - 1, y - 1)) ++count;  // top-left

    return count;
}

function floodFillUncover(x, y, visited)
{
    if (x >= 0 && y >= 0 && x < fieldWidth && y < fieldHeight)
    {
        if (visited[x][y])
        {
            return;
        }

        elements[y][x].setElementType(adjacentMines(x, y));

        if (adjacentMines(x, y) > 0)
        {
            return;
        }

        visited[x][y] = true;

        floodFillUncover(x - 1, y, visited);
        floodFillUncover(x + 1, y, visited);
        floodFillUncover(x, y - 1, visited);
        floodFillUncover(x, y + 1, visited);
    }
}

function isFinished()
{
    for (let r = 0; r < fieldHeight; ++r)
    {
        for (let c = 0; c < fieldWidth; ++c)
        {
            if (elements[r][c].covered && !elements[r][c].mine)
            {
                return false;
            }
        }
    }
    return true;
}

function createTexCoordBuffer(frameName, atlasJson)
{
    const frame = atlasJson.frames[frameName].frame;
    const texCoords = [];
    texCoords.push(
        frame.x / atlasJson.meta.size.w, frame.y / atlasJson.meta.size.h,
        frame.x / atlasJson.meta.size.w, (frame.y + frame.h) / atlasJson.meta.size.h,
        (frame.x + frame.w) / atlasJson.meta.size.w, frame.y / atlasJson.meta.size.h,
        (frame.x + frame.w) / atlasJson.meta.size.w, frame.y / atlasJson.meta.size.h,
        frame.x / atlasJson.meta.size.w, (frame.y + frame.h) / atlasJson.meta.size.h,
        (frame.x + frame.w) / atlasJson.meta.size.w, (frame.y + frame.h) / atlasJson.meta.size.h
    );
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    return texCoordBuffer;
}

function draw()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_TEST);
    glMatrix.mat4.mul(projViewMatrix, projMatrix, viewMatrix);

    for (let r = 0; r < fieldHeight; ++r)
    {
        for (let c = 0; c < fieldWidth; ++c)
        {
            elements[r][c].draw(projViewMatrix);
        }
    }
}

async function init()
{
    if (!initWebGLContext("renderCanvas")) return;

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
    gl.clearColor(0.2, 0.2, 0.2, 1);

    gl.canvas.onmousedown = (e) =>
    {
        const mouseX = (e.clientX - gl.canvas.offsetLeft) / worldScale;
        const mouseY = (e.clientY - gl.canvas.offsetTop) / worldScale;
        mouseVec = planck.Vec2(mouseX, mouseY);

        const aabb = new planck.AABB();
        aabb.lowerBound.set(mouseX - 0.001, mouseY - 0.001);
        aabb.upperBound.set(mouseX + 0.001, mouseY + 0.001);

        world.queryAABB(aabb, getBodyCallback);
    };

    glMatrix.mat4.ortho(projMatrix, 0, 200, 200, 0, 100, -100);
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, 90], [0, 0, 0], [0, 1, 0]);

    const defaultProgram = createProgram("defaultVertexShader", "defaultFragmentShader");

    const assetsImage = document.getElementById("assetsImage");
    const assetsTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, assetsTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, assetsImage);

    const vertPositions = new Float32Array([
        0, 0, 0,
        0, 1, 0,
        1, 0, 0,
        1, 0, 0,
        0, 1, 0,
        1, 1, 0

        // -0.5, -0.5, 0,
        // -0.5, 0.5, 0,
        // 0.5, -0.5, 0,
        // 0.5, -0.5, 0,
        // -0.5, 0.5, 0,
        // 0.5, 0.5, 0
    ]);
    const vertPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertPosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertPositions, gl.STATIC_DRAW);

    const jsonResponse = await fetch("assets/assets.json");
    const content = await jsonResponse.text();
    const atlasJson = JSON.parse(content);

    const defaultTexCoordBuffer = createTexCoordBuffer("default.png", atlasJson);
    const empty0TexCoordBuffer = createTexCoordBuffer("empty0.png", atlasJson);
    const empty1TexCoordBuffer = createTexCoordBuffer("empty1.png", atlasJson);
    const empty2TexCoordBuffer = createTexCoordBuffer("empty2.png", atlasJson);
    const empty3TexCoordBuffer = createTexCoordBuffer("empty3.png", atlasJson);
    const empty4TexCoordBuffer = createTexCoordBuffer("empty4.png", atlasJson);
    const empty5TexCoordBuffer = createTexCoordBuffer("empty5.png", atlasJson);
    const empty6TexCoordBuffer = createTexCoordBuffer("empty6.png", atlasJson);
    const empty7TexCoordBuffer = createTexCoordBuffer("empty7.png", atlasJson);
    const empty8TexCoordBuffer = createTexCoordBuffer("empty8.png", atlasJson);
    const mineTexCoordBuffer = createTexCoordBuffer("mine.png", atlasJson);

    for (let r = 0; r < fieldHeight; ++r)
    {
        elements[r] = new Array(fieldWidth);
    }

    for (let r = 0; r < fieldHeight; ++r)
    {
        for (let c = 0; c < fieldWidth; ++c)
        {
            let element = new FieldElement(defaultProgram, [c, r, 0], [37, 37], vertPosBuffer,
                defaultTexCoordBuffer, empty0TexCoordBuffer, empty1TexCoordBuffer, empty2TexCoordBuffer,
                empty3TexCoordBuffer, empty4TexCoordBuffer, empty5TexCoordBuffer, empty6TexCoordBuffer,
                empty7TexCoordBuffer, empty8TexCoordBuffer, mineTexCoordBuffer, assetsTexture);
            element.mine = Math.random() < 0.15;
            elements[r][c] = element;
        }
    }

    draw();
}

window.onload = () =>
{
    init()
};
