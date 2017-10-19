
var stats, camera, scene, renderer;
var wallMesh, roofMesh, pipeMesh;
var backBox0Mesh, backBox1Mesh;
var topElementMesh, sideElementMesh;

var roofElement0, roofElement1, roofElement2, roofElement3;
var roofElement4, roofElement5, roofElement6, roofElement7;
var roofElement8, roofElement9, roofElement10, roofElement11;
var roofElement12, roofElement13;

var wallMaterial, roofMaterial;
var controls, config, gui;
var config;

function init()
{
    stats = new Stats();
    container.appendChild(stats.dom);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-16, 16, 16);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    scene = new THREE.Scene();

    // var axis = new THREE.AxisHelper(20);
    // scene.add(axis);

    var Configuration = function ()
    {
    };
    config = new Configuration();
    config.wall = true;
    config.roof = true;
    config.pipe = true;
    config.backBox0 = true;
    config.backBox1 = true;
    config.topElement = true;
    config.sideElement = true;
    config.pipe = true;
    config.roofElement0 = true;
    config.roofElement1 = true;
    config.roofElement2 = true;
    config.roofElement3 = true;
    config.roofElement4 = true;
    config.roofElement5 = true;
    config.roofElement6 = true;
    config.roofElement7 = true;
    config.roofElement8 = true;
    config.roofElement9 = true;
    config.roofElement10 = true;
    config.roofElement11 = true;
    config.roofElement12 = true;
    config.roofElement13 = true;

    gui = new dat.GUI();
    gui.add(config, 'wall');
    gui.add(config, 'roof');
    gui.add(config, 'pipe');
    gui.add(config, 'backBox0');
    gui.add(config, 'backBox1');
    gui.add(config, 'topElement');
    gui.add(config, 'sideElement');

    var roofElementFolder = gui.addFolder('roofElements');
    roofElementFolder.add(config, 'roofElement0');
    roofElementFolder.add(config, 'roofElement1');
    roofElementFolder.add(config, 'roofElement2');
    roofElementFolder.add(config, 'roofElement3');
    roofElementFolder.add(config, 'roofElement4');
    roofElementFolder.add(config, 'roofElement5');
    roofElementFolder.add(config, 'roofElement6');
    roofElementFolder.add(config, 'roofElement7');
    roofElementFolder.add(config, 'roofElement8');
    roofElementFolder.add(config, 'roofElement9');
    roofElementFolder.add(config, 'roofElement10');
    roofElementFolder.add(config, 'roofElement11');
    roofElementFolder.add(config, 'roofElement12');
    roofElementFolder.add(config, 'roofElement13');

    var loader = new THREE.JSONLoader();
    loader.load(
        'models/Warehouse.json',
        function (geometry, materials)
        {
            // Replace THREE.MeshPhongMaterial to THREE.MeshLambertMaterial
            // var newMaterials = new Array(materials.length);

            // for (var i = 0; i < materials.length; i++)
            // {
            //     newMaterials[i] = new THREE.MeshLambertMaterial({ color: materials[i].color });
            // }

            wallMesh = new THREE.Mesh(geometry, materials);
            scene.add(wallMesh);

            wallMaterial = materials[0];
            config.wallColor = materials[0].color;

            // var controller = gui.addColor(config, 'wallColor');
            // controller.onChange(function (colorValue)
            // {
            //     // colorValue = colorValue.replace('#', '0x');
            //     // var colorObject = new THREE.Color(colorValue);
            //     wallMaterial.color = new THREE.Color(0, 1, 0);
            // });

            gui.addColor(config, 'wallColor').onChange(
                function (color)
                {
                    wallMaterial.color = getCorrectColor(color);
                });

            tryToRunAnimate();
        });

    loader.load('./models/Roof.json', function (geometry, materials)
    {
        roofMaterial = new THREE.MeshPhongMaterial({
            color: 0xb7b7b7,
            normalMap: new THREE.TextureLoader().load('./textures/Roof_N_1024x1024.png')
        });
        roofMesh = new THREE.Mesh(geometry, roofMaterial);
        scene.add(roofMesh);

        config.roofColor = roofMaterial.color;
        gui.addColor(config, 'roofColor').onChange(function (color)
        {
            roofMaterial.color = getCorrectColor(color);
        });

        tryToRunAnimate();
    });

    loader.load('./models/Pipe.json', function (geometry, materials)
    {
        pipeMesh = new THREE.Mesh(geometry, materials);
        scene.add(pipeMesh);

        tryToRunAnimate();
    });

    loader.load('./models/TopElement.json', function (geometry, materials)
    {
        topElementMesh = new THREE.Mesh(geometry, materials);
        scene.add(topElementMesh);

        tryToRunAnimate();
    });

    loader.load('./models/SideElement.json', function (geometry, materials)
    {
        sideElementMesh = new THREE.Mesh(geometry, materials);
        scene.add(sideElementMesh);

        tryToRunAnimate();
    });

    loader.load('./models/BackBox0.json', function (geometry, materials)
    {
        backBox0Mesh = new THREE.Mesh(geometry, materials);
        scene.add(backBox0Mesh);

        tryToRunAnimate();
    });

    loader.load('./models/BackBox1.json', function (geometry, materials)
    {
        backBox1Mesh = new THREE.Mesh(geometry, materials);
        scene.add(backBox1Mesh);

        tryToRunAnimate();
    });

    loader.load('./models/roofElements/roofElement0.json', function (geometry, materials)
    {
        roofElement0 = new THREE.Mesh(geometry, materials);
        scene.add(roofElement0);

        tryToRunAnimate();
    });

    loader.load('./models/roofElements/roofElement1.json', function (geometry, materials)
    {
        roofElement1 = new THREE.Mesh(geometry, materials);
        scene.add(roofElement1);

        tryToRunAnimate();
    });

    loader.load('./models/roofElements/roofElement2.json', function (geometry, materials)
    {
        roofElement2 = new THREE.Mesh(geometry, materials);
        scene.add(roofElement2);

        tryToRunAnimate();
    });

    loader.load('./models/roofElements/roofElement3.json', function (geometry, materials)
    {
        roofElement3 = new THREE.Mesh(geometry, materials);
        scene.add(roofElement3);

        tryToRunAnimate();
    });

    loader.load('./models/roofElements/roofElement4.json', function (geometry, materials)
    {
        roofElement4 = new THREE.Mesh(geometry, materials);
        scene.add(roofElement4);
 
        tryToRunAnimate();
    });

    loader.load('./models/roofElements/roofElement5.json', function (geometry, materials)
    {
        roofElement5 = new THREE.Mesh(geometry, materials);
        scene.add(roofElement5);
 
        tryToRunAnimate();
    });

    loader.load('./models/roofElements/roofElement6.json', function (geometry, materials)
    {
        roofElement6 = new THREE.Mesh(geometry, materials);
        scene.add(roofElement6);

        tryToRunAnimate();
    });

    loader.load('./models/roofElements/roofElement7.json', function (geometry, materials)
    {
        roofElement7 = new THREE.Mesh(geometry, materials);
        scene.add(roofElement7);

        tryToRunAnimate();
    });

    loader.load('./models/roofElements/roofElement8.json', function (geometry, materials)
    {
        roofElement8 = new THREE.Mesh(geometry, materials);
        scene.add(roofElement8);

        tryToRunAnimate();
    });

    loader.load('./models/roofElements/roofElement9.json', function (geometry, materials)
    {
        roofElement9 = new THREE.Mesh(geometry, materials);
        scene.add(roofElement9);

        tryToRunAnimate();
    });

    loader.load('./models/roofElements/roofElement10.json', function (geometry, materials)
    {
        roofElement10 = new THREE.Mesh(geometry, materials);
        scene.add(roofElement10);

        tryToRunAnimate();
    });

    loader.load('./models/roofElements/roofElement11.json', function (geometry, materials)
    {
        roofElement11 = new THREE.Mesh(geometry, materials);
        scene.add(roofElement11);

        tryToRunAnimate();
    });

    loader.load('./models/roofElements/roofElement12.json', function (geometry, materials)
    {
        roofElement12 = new THREE.Mesh(geometry, materials);
        scene.add(roofElement12);

        tryToRunAnimate();
    });

    loader.load('./models/roofElements/roofElement13.json', function (geometry, materials)
    {
        roofElement13 = new THREE.Mesh(geometry, materials);
        scene.add(roofElement13);
 
        tryToRunAnimate();
    });

    var light1 = new THREE.DirectionalLight(0xffffff);
    light1.position.set(1, 1, 1);
    scene.add(light1);

    var light2 = new THREE.DirectionalLight(0xffffff);
    light2.position.set(-1, -1, -1);
    scene.add(light2);

    var light3 = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light3);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    //controls.enableZoom = false;

    window.addEventListener('resize', onWindowResize, false);
}

function tryToRunAnimate()
{
    if (wallMesh !== undefined && roofMesh !== undefined &&
        pipeMesh !== undefined &&
        backBox0Mesh !== undefined && backBox1Mesh !== undefined &&
        topElementMesh !== undefined && sideElementMesh !== undefined &&
        roofElement0 !== undefined && roofElement1 !== undefined &&
        roofElement2 !== undefined && roofElement3 !== undefined &&
        roofElement4 !== undefined && roofElement5 !== undefined &&
        roofElement6 !== undefined && roofElement7 !== undefined &&
        roofElement8 !== undefined && roofElement9 !== undefined &&
        roofElement10 !== undefined && roofElement11 !== undefined &&
        roofElement12 !== undefined && roofElement13 !== undefined)
    {
        animate();
    }
}

function animate()
{
    controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
    stats.update();

    wallMesh.visible = config.wall;
    roofMesh.visible = config.roof;
    pipeMesh.visible = config.pipe;
    backBox0Mesh.visible = config.backBox0;
    backBox1Mesh.visible = config.backBox1;
    topElementMesh.visible = config.topElement;
    sideElementMesh.visible = config.sideElement;
    roofElement0.visible = config.roofElement0;
    roofElement1.visible = config.roofElement1;
    roofElement2.visible = config.roofElement2;
    roofElement3.visible = config.roofElement3;
    roofElement4.visible = config.roofElement4;
    roofElement5.visible = config.roofElement5;
    roofElement6.visible = config.roofElement6;
    roofElement7.visible = config.roofElement7;
    roofElement8.visible = config.roofElement8;
    roofElement9.visible = config.roofElement9;
    roofElement10.visible = config.roofElement10;
    roofElement11.visible = config.roofElement11;
    roofElement12.visible = config.roofElement12;
    roofElement13.visible = config.roofElement13;

    requestAnimationFrame(animate);
    render();
}

function render()
{
    renderer.render(scene, camera);
}

function getCorrectColor(color)
{
    var newColor;
    if (color.r > 1 || color.g > 1 || color.b > 1)
    {
        newColor = new THREE.Color(color.r / 255, color.g / 255, color.b / 255);
    }
    else
    {
        newColor = new THREE.Color(color);
    }
    return newColor;
}

function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

window.onload = function ()
{
    init();
};
