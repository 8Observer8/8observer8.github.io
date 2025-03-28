"use strict";

function Scene()
{
    var self = this;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x333333);
    this.scene.add(new THREE.AmbientLight(0x333333));

    this.camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.camera.position.x = 0;
    this.camera.position.y = 5;
    this.camera.position.z = 8;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshLambertMaterial({ color: 0x591fb7 });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.y = 3;
    this.scene.add(this.cube);

    var controls = new THREE.OrbitControls(this.camera);

    var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    this.scene.add(light);
    light.position.copy(this.camera.position);

    var loader = new THREE.JSONLoader();
    var path = "assets/fonts/pincoyablack.json";
    loader.load(path, function (geometry, materials)
    {
        var mat = new THREE.MeshLambertMaterial({ color: 0x70b71f });
        var mesh = new THREE.Mesh(geometry, mat);
        mesh.position.x = -5;
        self.scene.add(mesh);
    });

    var animate = function ()
    {
        requestAnimationFrame(animate);

        self.cube.rotation.y += 0.05;
        controls.update();

        self.renderer.render(self.scene, self.camera);
    };

    animate();

    window.addEventListener("resize", onWindowResize, false);

    function onWindowResize()
    {
        self.camera.aspect = window.innerWidth / window.innerHeight;
        self.camera.updateProjectionMatrix();
        self.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
