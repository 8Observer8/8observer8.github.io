
function init()
{
    initHUD();
    initAndRun3DScene();
}

function initHUD()
{
    // Get the modal
    var modal = document.getElementById('myModal');

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var img = document.getElementById('imgPlan');
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    img.onclick = function ()
    {
        modal.style.display = "block";
        modalImg.src = img.src; //this.src;
        captionText.innerHTML = img.alt; //this.alt;
    };

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function ()
    {
        modal.style.display = "none";
    };
}

function initAndRun3DScene()
{
    var canvasContainer = document.getElementById('renderCanvas');

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    canvasContainer.appendChild(renderer.domElement);

    var camera = new THREE.PerspectiveCamera(
        50,
        canvasContainer.clientWidth / canvasContainer.clientHeight);
    camera.position.set(0, 7, 10);

    var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.target = new THREE.Vector3(0, 0, 0);

    var scene = new THREE.Scene();

    // var axis = new THREE.AxisHelper(10, 10, 10);
    // scene.add(axis);
    
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight();
    directionalLight.position.set(0.5, 0.9, 1);
    scene.add(directionalLight);

    var loader = new THREE.JSONLoader();
    loader.load('./models/flat_01.json', function (geometry, materials)
    {
        var material = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load('./textures/flat_01_ao.png')
        });
        scene.add(new THREE.Mesh(geometry, material));
    });

    loader.load('./models/flat_02.json', function (geometry, materials)
    {
        var material = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load('./textures/flat_02_ao.png')
        });
        scene.add(new THREE.Mesh(geometry, material));
    });

    loader.load('./models/floor_01.json', function (geometry, materials)
    {
        var material = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load('./textures/floor_01_color.png')
        });
        scene.add(new THREE.Mesh(geometry, material));
    });

    loader.load('./models/floor_02.json', function (geometry, materials)
    {
        var material = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load('./textures/floor_02_color.png')
        });
        scene.add(new THREE.Mesh(geometry, material));
    });

    update();

    function update()
    {
        orbitControls.update();

        requestAnimationFrame(update);
        render();
    }

    function render()
    {
        renderer.render(scene, camera);
    }
}

window.onload = init;
