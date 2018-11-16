"use strict";

/* jslint:  */
/* global window: false, document: false, console: false, BABYLON: false */

var Scene = (function()
{
    var _canvas = null;
    var _engine = null;
    var _scene = null;

    var _Animate = function()
    {
        _engine.runRenderLoop(function()
        {
            _scene.render();
        });

        window.addEventListener("resize", function()
        {
            _engine.resize();
        });
    };

    var _Create = function(canvasID)
    {
        _canvas = document.getElementById(canvasID);
        _engine = new BABYLON.Engine(_canvas, true);
        //_scene = new BABYLON.Scene(_engine);

        document.addEventListener('contextmenu', function(event) { event.preventDefault(); }, false);

        BABYLON.SceneLoader.Load("", "./models/Fumi-Kato.babylon", _engine,
            function(newScene)
            {
                _scene = newScene;
                var mesh = _scene.meshes[0];
                mesh.material = new BABYLON.StandardMaterial("meshMaterial", _scene);
                mesh.material.specularColor = new BABYLON.Color3(0, 0, 0);
                var meshTexturePath = "./models/Fumi-Kato.png";
                mesh.material.diffuseTexture = new BABYLON.Texture(meshTexturePath, _scene);

                var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), _scene);
                var camera = new BABYLON.ArcRotateCamera("Camera", 0, 45 * Math.PI / 180, 15, BABYLON.Vector3.Zero(), _scene);
                //camera.setPosition(new BABYLON.Vector3(0, 0, 20));
                // camera.minZ = 1;
                camera.wheelPrecision = 100;
                camera.lowerRadiusLimit = 7;
                _scene.activeCamera = camera;
                camera.attachControl(_canvas, true);

                // Ground
                var myPlane = BABYLON.MeshBuilder.CreatePlane("myPlane", { width: 20, height: 20 }, _scene);
                // myPlane.position.y = -3;
                myPlane.rotate(BABYLON.Axis.X, Math.PI / 2, BABYLON.Space.WORLD);
                myPlane.material = new BABYLON.StandardMaterial("myMaterial", _scene);
                myPlane.material.specularColor = new BABYLON.Color3(0, 0, 0);
                var myPlaneTexturePath = "https://dl.dropboxusercontent.com/s/5c4smljbpc09pw2/156.jpg";
                var myPlaneNormPath = "https://dl.dropboxusercontent.com/s/1zlbcwh37wxs8g7/156_norm.jpg";
                myPlane.material.diffuseTexture = new BABYLON.Texture(myPlaneTexturePath, _scene);
                myPlane.material.bumpTexture = new BABYLON.Texture(myPlaneNormPath, _scene);

                // Foto 1
                // var foto1 = BABYLON.MeshBuilder.CreatePlane("foto1", { width: 6, height: 8.49 }, _scene);
                // foto1.rotate(BABYLON.Axis.X, Math.PI / 4, BABYLON.Space.WORLD);
                // foto1.material = new BABYLON.StandardMaterial("foto1Material", _scene);
                // foto1.material.backFaceCulling = false;
                // foto1.material.specularColor = new BABYLON.Color3(0, 0, 0);
                // var foto1TexturePath = "./textures/fotos/4p_GXvp3fNM.jpg";
                // foto1.material.diffuseTexture = new BABYLON.Texture(foto1TexturePath, _scene);

                // Skybox
                var skybox = BABYLON.MeshBuilder.CreateBox("skybox", { size: 1000 }, _scene);
                skybox.infiniteDistance = true;
                var skyboxMaterial = new BABYLON.StandardMaterial("skybox", _scene);
                skyboxMaterial.backFaceCulling = false;
                var files = [
                    "./textures/skybox/skybox_px.jpg",
                    "./textures/skybox/skybox_py.jpg",
                    "./textures/skybox/skybox_pz.jpg",
                    "./textures/skybox/skybox_nx.jpg",
                    "./textures/skybox/skybox_ny.jpg",
                    "./textures/skybox/skybox_nz.jpg",
                ];
                skyboxMaterial.reflectionTexture = BABYLON.CubeTexture.CreateFromImages(files, _scene);
                skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
                skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                skybox.material = skyboxMaterial;

                _Animate();
            });
    };

    var mPublic = {
        Create: _Create
    };
    return mPublic;
}());