/* jshint node: true */
/* global window: false, document: false, BABYLON: false */

"use strict";

var Scene = (function() {
    var canvas = null;
    var engine = null;
    var scene = null;
    var shapes = {};
    var previousShape = null;

    function initialize(canvasID) {
        canvas = document.getElementById(canvasID);
        engine = new BABYLON.Engine(canvas, true);

        document.addEventListener('contextmenu', function(event) { event.preventDefault(); }, false);

        scene = createScene();

        animate();
    }

    function createScene() {
        var scene = new BABYLON.Scene(engine);

        // var light0 = new BABYLON.PointLight("pointlight1", new BABYLON.Vector3(2, 2, -1), scene);
        // light0.position.y = 10;
        // var light1 = new BABYLON.HemisphericLight("hemiLight1", new BABYLON.Vector3(2, 2, -1), scene);
        // light1.groundColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        //light1.intensity = 1.0;
        var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-20, -20, 10), scene);
        light2.position = new BABYLON.Vector3(20, 20, -10);

        var hemiLight = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        hemiLight.intensity = 0.4;
        hemiLight.groundColor = new BABYLON.Color3(0.8, 0.8, 0.8);

        var camera = new BABYLON.ArcRotateCamera("camera1", -120 * Math.PI / 180, 70 * Math.PI / 180, 2, new BABYLON.Vector3(0, 0.5, 0), scene);
        camera.minZ = 0.1;
        camera.wheelPrecision = 100;
        camera.attachControl(canvas, true);

        var cube = BABYLON.MeshBuilder.CreateBox("box1", { size: 1 }, scene);
        cube.position.y = 0.5;
        shapes.cube = cube;
        cube.setEnabled(0);
        var cubeMaterial = new BABYLON.StandardMaterial("cubeMaterial", scene);
        var texCubeScale = 1;
        // Diffuse Texture
        cubeMaterial.diffuseTexture = new BABYLON.Texture("https://dl.dropboxusercontent.com/s/h7zwfpw4v4fjwag/154.jpg", scene);
        cubeMaterial.diffuseTexture.uScale = texCubeScale;
        cubeMaterial.diffuseTexture.vScale = texCubeScale;
        // Normal Map
        cubeMaterial.bumpTexture = new BABYLON.Texture("https://dl.dropboxusercontent.com/s/t4xbe49r1hnymdg/154_norm.jpg", scene);
        cubeMaterial.bumpTexture.uScale = texCubeScale;
        cubeMaterial.bumpTexture.vScale = texCubeScale;
        cubeMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        // cubeMaterial.invertNormalMapX = true;
        // cubeMaterial.invertNormalMapY = true;
        cube.material = cubeMaterial;

        var sphere = BABYLON.MeshBuilder.CreateSphere('sphere1', { diameter: 1 }, scene);
        sphere.position.y = 0.5;
        shapes.sphere = sphere;
        previousShape = "sphere";
        var sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
        var texSphereScale = 1;
        // Diffuse Texture
        sphereMaterial.diffuseTexture = new BABYLON.Texture("https://dl.dropboxusercontent.com/s/pjul4mif4kqfpo0/167.jpg", scene);
        sphereMaterial.diffuseTexture.uScale = texSphereScale;
        sphereMaterial.diffuseTexture.vScale = texSphereScale;
        // Normal Map
        sphereMaterial.bumpTexture = new BABYLON.Texture("https://dl.dropboxusercontent.com/s/775ddnv0hhj7gcx/167_norm.jpg?dl=0", scene);
        sphereMaterial.bumpTexture.uScale = texSphereScale;
        sphereMaterial.bumpTexture.vScale = texSphereScale;
        sphereMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        // sphereMaterial.invertNormalMapX = true;
        // sphereMaterial.invertNormalMapY = true;
        sphere.material = sphereMaterial;

        var cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder1", { diameterTop: 0.5, diameterBottom: 0.5, height: 1 }, scene);
        cylinder.position.y = 0.5;
        shapes.cylinder = cylinder;
        cylinder.setEnabled(0);
        var cylinderMaterial = new BABYLON.StandardMaterial("cylinderMaterial", scene);
        var texCylinderScale = 1;
        // Diffuse Texture
        cylinderMaterial.diffuseTexture = new BABYLON.Texture("https://dl.dropboxusercontent.com/s/x3o1bawspbv0brf/191.jpg", scene);
        cylinderMaterial.diffuseTexture.uScale = texCylinderScale;
        cylinderMaterial.diffuseTexture.vScale = texCylinderScale;
        // Normal Map
        cylinderMaterial.bumpTexture = new BABYLON.Texture("https://dl.dropboxusercontent.com/s/39axbqz2heaksjh/191_norm.jpg", scene);
        cylinderMaterial.bumpTexture.uScale = texCylinderScale;
        cylinderMaterial.bumpTexture.vScale = texCylinderScale;
        cylinderMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        // cylinderMaterial.invertNormalMapX = true;
        // cylinderMaterial.invertNormalMapY = true;
        cylinder.material = cylinderMaterial;

        var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);
        var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        //groundMaterial.diffuseColor = new BABYLON.Color3(0.839, 0.972, 0.807);
        groundMaterial.diffuseTexture = new BABYLON.Texture("https://dl.dropboxusercontent.com/s/5c4smljbpc09pw2/156.jpg", scene);
        var scale = 4;
        groundMaterial.diffuseTexture.uScale = scale;
        groundMaterial.diffuseTexture.vScale = scale;
        groundMaterial.bumpTexture = new BABYLON.Texture("https://dl.dropboxusercontent.com/s/1zlbcwh37wxs8g7/156_norm.jpg", scene);
        groundMaterial.bumpTexture.uScale = scale;
        groundMaterial.bumpTexture.vScale = scale;
        groundMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        // groundMaterial.invertNormalMapX = true;
        // groundMaterial.invertNormalMapY = true;
        ground.material = groundMaterial;

        // Shadows
        var shadowGenerator = new BABYLON.ShadowGenerator(512, light2);
        shadowGenerator.getShadowMap().renderList.push(cube);
        shadowGenerator.getShadowMap().renderList.push(sphere);
        shadowGenerator.getShadowMap().renderList.push(cylinder);

        // shadowGenerator.useBlurExponentialShadowMap = true;
        // shadowGenerator.useBlurVarianceShadowMap = true;
        shadowGenerator.usePoissonSampling = true;
        shadowGenerator.bias = 0.00001;
        // shadowGenerator.useKernelBlur = true;
        // shadowGenerator.blurKernel = 64;

        ground.receiveShadows = true;

        // Skybox
        var skybox = BABYLON.MeshBuilder.CreateBox("skybox", { size: 1000 }, scene);
        skybox.infiniteDistance = true;
        var skyboxMaterial = new BABYLON.StandardMaterial("skyboxMat", scene);
        skyboxMaterial.backFaceCulling = false;
        var files = [
            "https://dl.dropboxusercontent.com/s/d6pb1vco30tb1qd/skybox_px.jpg",
            "https://dl.dropboxusercontent.com/s/j8r319homxctq46/skybox_py.jpg",
            "https://dl.dropboxusercontent.com/s/owtkos3hjayv819/skybox_pz.jpg",
            "https://dl.dropboxusercontent.com/s/fn49xqtrz18h6vn/skybox_nx.jpg",
            "https://dl.dropboxusercontent.com/s/jdtd2cgpe13930o/skybox_ny.jpg",
            "https://dl.dropboxusercontent.com/s/shin4itwifrypl5/skybox_nz.jpg",
        ];
        skyboxMaterial.reflectionTexture = BABYLON.CubeTexture.CreateFromImages(files, scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        return scene;
    }

    function setShape(name) {
        shapes[previousShape].setEnabled(0);
        previousShape = name;
        shapes[name].setEnabled(1);
    }

    function animate() {
        engine.runRenderLoop(function() {
            scene.render();
        });

        window.addEventListener("resize", function() {
            engine.resize();
        });
    }

    return {
        initialize: initialize,
        setShape: setShape
    };
}());