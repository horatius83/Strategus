var globalScene = initializeScene();
var mesh = createGeometry(globalScene.scene);
animateScene(mesh, globalScene.renderer, globalScene.scene, globalScene.camera);

function initializeScene() {
    var renderer;
    if (Detector.webgl) {
        renderer = new THREE.WebGLRenderer({ antialias: true });
    } else {
        renderer = new THREE.CanvasRenderer();
    }

    renderer.setClearColor(0x000000, 1);

    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;

    renderer.setSize(canvasWidth, canvasHeight);

    $('#container').append(renderer.domElement);

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 100);
    camera.position.set(0, 0, 10);
    camera.lookAt(scene.position);
    scene.add(camera);
    
    return { 'scene': scene, 'camera': camera, 'renderer': renderer };
}

function createGeometry(scene) {
    var triangleGeometry = new THREE.Geometry();
    function push(x, y, z) {
        triangleGeometry.vertices.push(new THREE.Vector3(x, y, z));
    }
    push(0, 1, 0);
    push(-1, -1, 0);
    push(1, -1, 0);
    triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));

    var vertColors = triangleGeometry.faces[0].vertexColors;
    vertColors[0] = new THREE.Color(0xFF0000);
    vertColors[1] = new THREE.Color(0x00FF00);
    vertColors[2] = new THREE.Color(0x0000FF);

    var triangleMaterial = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
        side: THREE.DoubleSide
    });

    var triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);
    triangleMesh.position.set(-1.5, 0, 4);
    scene.add(triangleMesh);
    return triangleMesh;
}

function animateScene() {
    mesh.rotation.y += 0.1;
    requestAnimationFrame(animateScene);
    renderScene(globalScene.renderer, globalScene.scene, globalScene.camera);
}

function renderScene(renderer, scene, camera) {
    renderer.render(scene, camera);
}

/*// Scene size
var sceneSize = {
    WIDTH: 400,
    HEIGHT: 300
}

// Camera attributes
var cameraAttributes = {
    VIEW_ANGLE: 45,
    ASPECT: sceneSize.WIDTH / sceneSize.HEIGHT,
    NEAR: 0.1,
    FAR: 10000
}

// Get the DOM element to attach to
var container = $('#container');

var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(cameraAttributes.VIEW_ANGLE,
					 cameraAttributes.ASPECT,
					 cameraAttributes.NEAR,
					 cameraAttributes.FAR);
var scene = new THREE.Scene();

camera.position.z = 300;

renderer.setSize(sceneSize.WIDTH, sceneSize.HEIGHT);

container.append(renderer.domElement);

var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xCC0000 });

var sphereAttributes = {
    radius: 50,
    segments: 16,
    rings: 16
}

var sphere = new THREE.Mesh(new THREE.SphereGeometry(
    sphereAttributes.radius, sphereAttributes.segments, sphereAttributes.rings),
    sphereMaterial);

scene.add(sphere);

scene.add(camera);

var pointLight = new THREE.PointLight(0xffffff);
var p = pointLight.position;
p.x = 10; p.y = 50; p.z = 130;

scene.add(pointLight);

renderer.render(scene, camera)
*/