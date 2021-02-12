define(["require", "exports", "gl-matrix", "./CameraRotator", "./Loaders", "./Locations", "./Object3D", "./Object3DPicked", "./ShaderProgram", "./Skybox", "./Textures", "./VertexBuffers"], function (require, exports, gl_matrix_1, CameraRotator_1, Loaders_1, Locations_1, Object3D_1, Object3DPicked_1, ShaderProgram_1, Skybox_1, Textures_1, VertexBuffers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var gl;
    var program;
    var vertShaderSrc;
    var fragShaderSrc;
    var cameraRotator;
    var cubeModelXML;
    var cubeImage;
    var cube;
    var pickedCube;
    var coneModelXML;
    var coneImage;
    var cone;
    var pickedCone;
    var cylinderModelXML;
    var cylinderImage;
    var cylinder;
    var pickedCylinder;
    var projectionMatrix;
    var viewMatrix;
    var viewProjMatrix;
    var skybox = new Skybox_1.default();
    var amountToLoad = 18;
    var xMouse;
    var yMouse;
    var pickedVertShaderSrc;
    var pickedFragShaderSrc;
    function loadAssets() {
        // Load shaders
        Loaders_1.loadFile("assets/shaders/texturedShader.vert", true, function (src) { vertShaderSrc = src; isReadToInit(); });
        Loaders_1.loadFile("assets/shaders/texturedShader.frag", true, function (src) { fragShaderSrc = src; isReadToInit(); });
        Loaders_1.loadFile("assets/shaders/skyboxShader.vert", true, function (src) { skybox.vertexShaderSource = src; isReadToInit(); });
        Loaders_1.loadFile("assets/shaders/skyboxShader.frag", true, function (src) { skybox.fragmentShaderSource = src; isReadToInit(); });
        Loaders_1.loadFile("assets/shaders/pickedShader.vert", true, function (src) { pickedVertShaderSrc = src; isReadToInit(); });
        Loaders_1.loadFile("assets/shaders/pickedShader.frag", true, function (src) { pickedFragShaderSrc = src; isReadToInit(); });
        // Load models
        Loaders_1.loadFile("assets/models/Cube.dae", false, function (xmlModel) { cubeModelXML = xmlModel; isReadToInit(); });
        Loaders_1.loadImage("assets/models/Cube.png", function (image) { cubeImage = image; isReadToInit(); });
        Loaders_1.loadFile("assets/models/Cone.dae", false, function (xmlModel) { coneModelXML = xmlModel; isReadToInit(); });
        Loaders_1.loadImage("assets/models/Cone.png", function (image) { coneImage = image; isReadToInit(); });
        Loaders_1.loadFile("assets/models/Cylinder.dae", false, function (xmlModel) { cylinderModelXML = xmlModel; isReadToInit(); });
        Loaders_1.loadImage("assets/models/Cylinder.png", function (image) { cylinderImage = image; isReadToInit(); });
        // Skybox
        Loaders_1.loadImage("assets/skybox/skybox_px.jpg", function (image) { skybox.skybox_px = image; isReadToInit(); });
        Loaders_1.loadImage("assets/skybox/skybox_py.jpg", function (image) { skybox.skybox_py = image; isReadToInit(); });
        Loaders_1.loadImage("assets/skybox/skybox_pz.jpg", function (image) { skybox.skybox_pz = image; isReadToInit(); });
        Loaders_1.loadImage("assets/skybox/skybox_nx.jpg", function (image) { skybox.skybox_nx = image; isReadToInit(); });
        Loaders_1.loadImage("assets/skybox/skybox_ny.jpg", function (image) { skybox.skybox_ny = image; isReadToInit(); });
        Loaders_1.loadImage("assets/skybox/skybox_nz.jpg", function (image) { skybox.skybox_nz = image; isReadToInit(); });
        // loadImage("assets/skybox/park/posx.jpg",
        //     (image) => { skybox.skybox_px = image; isReadToInit(); });
        // loadImage("assets/skybox/park/posy.jpg",
        //     (image) => { skybox.skybox_py = image; isReadToInit(); });
        // loadImage("assets/skybox/park/posz.jpg",
        //     (image) => { skybox.skybox_pz = image; isReadToInit(); });
        // loadImage("assets/skybox/park/negx.jpg",
        //     (image) => { skybox.skybox_nx = image; isReadToInit(); });
        // loadImage("assets/skybox/park/negy.jpg",
        //     (image) => { skybox.skybox_ny = image; isReadToInit(); });
        // loadImage("assets/skybox/park/negz.jpg",
        //     (image) => { skybox.skybox_nz = image; isReadToInit(); });
    }
    function isReadToInit() {
        amountToLoad--;
        if (amountToLoad === 0) {
            init();
        }
    }
    function init() {
        var canvas = document.getElementById("renderCanvas");
        gl = canvas.getContext("webgl");
        gl.clearColor(0.2, 0.2, 0.2, 1);
        gl.enable(gl.DEPTH_TEST);
        program = ShaderProgram_1.createShaderProgram(gl, vertShaderSrc, fragShaderSrc);
        gl.useProgram(program);
        var locations = new Locations_1.default();
        locations.aPositionLocation = gl.getAttribLocation(program, "aPosition");
        locations.aNormalLocation = gl.getAttribLocation(program, "aNormal");
        locations.aTextureCoordLocation = gl.getAttribLocation(program, "aTexCoord");
        locations.uModelMatrixLocation = gl.getUniformLocation(program, "uModelMatrix");
        locations.uNormalMatrixLocation = gl.getUniformLocation(program, "uNormalMatrix");
        locations.uMvpMatrixLocation = gl.getUniformLocation(program, "uMvpMatrix");
        var cubeVertexBuffers = VertexBuffers_1.initVertexBuffers(gl, cubeModelXML);
        var cubeTexture = Textures_1.createTexture(gl, cubeImage);
        cube = new Object3D_1.default(cubeVertexBuffers, locations, cubeTexture);
        var coneVertexBuffers = VertexBuffers_1.initVertexBuffers(gl, coneModelXML);
        var coneTexture = Textures_1.createTexture(gl, coneImage);
        cone = new Object3D_1.default(coneVertexBuffers, locations, coneTexture);
        cone.position[0] = -2;
        var cylinderVertexBuffers = VertexBuffers_1.initVertexBuffers(gl, cylinderModelXML);
        var cylinderTexture = Textures_1.createTexture(gl, cylinderImage);
        cylinder = new Object3D_1.default(cylinderVertexBuffers, locations, cylinderTexture);
        cylinder.position[0] = 2;
        projectionMatrix = gl_matrix_1.mat4.create();
        viewMatrix = gl_matrix_1.mat4.create();
        viewProjMatrix = gl_matrix_1.mat4.create();
        cameraRotator = new CameraRotator_1.CameraRotator(gl.canvas, function () { return onRotate(); }, 15);
        viewMatrix = cameraRotator.getViewMatrix();
        skybox.init(gl, 500);
        var pickedProgram = ShaderProgram_1.createShaderProgram(gl, pickedVertShaderSrc, pickedFragShaderSrc);
        var aPickedPositionLocation = gl.getAttribLocation(pickedProgram, "aPosition");
        var uPickedMvpMatrixLocation = gl.getUniformLocation(pickedProgram, "uMvpMatrix");
        var uIdLocation = gl.getUniformLocation(pickedProgram, "uId");
        window.onresize = function () {
            var w = gl.canvas.clientWidth;
            var h = gl.canvas.clientHeight;
            gl.canvas.width = w;
            gl.canvas.height = h;
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl_matrix_1.mat4.perspective(projectionMatrix, 50 * Math.PI / 180, w / h, 0.1, 1000);
            draw();
        };
        window.onresize(null);
        var cubeId = 0;
        pickedCube = new Object3DPicked_1.default(cubeId, gl, pickedProgram, aPickedPositionLocation, uPickedMvpMatrixLocation, uIdLocation, cubeVertexBuffers.vertexPosBuffer, cubeVertexBuffers.amountOfVertices);
        pickedCube.position = cube.position;
        pickedCube.rotation = cube.rotation;
        pickedCube.scale = cube.scale;
        var coneId = 1;
        pickedCone = new Object3DPicked_1.default(coneId, gl, pickedProgram, aPickedPositionLocation, uPickedMvpMatrixLocation, uIdLocation, coneVertexBuffers.vertexPosBuffer, coneVertexBuffers.amountOfVertices);
        pickedCone.position = cone.position;
        pickedCone.rotation = cone.rotation;
        pickedCone.scale = cone.scale;
        var cylinderId = 2;
        pickedCylinder = new Object3DPicked_1.default(cylinderId, gl, pickedProgram, aPickedPositionLocation, uPickedMvpMatrixLocation, uIdLocation, cylinderVertexBuffers.vertexPosBuffer, cylinderVertexBuffers.amountOfVertices);
        pickedCylinder.position = cylinder.position;
        pickedCylinder.rotation = cylinder.rotation;
        pickedCylinder.scale = cylinder.scale;
        gl.canvas.onclick = function (event) {
            xMouse = event.clientX;
            yMouse = gl.canvas.clientHeight - event.clientY - 1;
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl_matrix_1.mat4.mul(viewProjMatrix, projectionMatrix, viewMatrix);
            pickedCube.draw(viewProjMatrix);
            pickedCone.draw(viewProjMatrix);
            pickedCylinder.draw(viewProjMatrix);
            var pixels = new Uint8Array(4);
            gl.readPixels(xMouse, yMouse, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            if (pixels[0] == 255 && pixels[1] == 0 && pixels[2] == 0) {
                console.log("Cube");
            }
            else if (pixels[0] == 0 && pixels[1] == 255 && pixels[2] == 0) {
                console.log("Cone");
            }
            else if (pixels[0] == 0 && pixels[1] == 0 && pixels[2] == 255) {
                console.log("Cylinder");
            }
            draw();
        };
    }
    function onRotate() {
        viewMatrix = cameraRotator.getViewMatrix();
        draw();
    }
    function draw() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl_matrix_1.mat4.mul(viewProjMatrix, projectionMatrix, viewMatrix);
        cube.draw(gl, program, viewProjMatrix);
        cone.draw(gl, program, viewProjMatrix);
        cylinder.draw(gl, program, viewProjMatrix);
        skybox.draw(gl, viewProjMatrix);
    }
    function main() {
        loadAssets();
    }
    // Debug
    main();
});
// Release
//window.onload = () => main();
//# sourceMappingURL=main.js.map