var globalScene = initializeScene();
var mesh = createGeometry(globalScene.scene);
var icoPoints = createIcosahedronPoints(5);
var ico = createIcosahedron(icoPoints, globalScene.scene);
animateScene();

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

function toCartesian(radius, phi, theta) {
    var rSinTheta = radius * Math.sin(theta);
    var x = rSinTheta * Math.cos(phi);
    var y = rSinTheta * Math.sin(phi);
    var z = radius * Math.cos(theta);
    return { 'x': x, 'y': y, 'z': z };
}

function createIcosahedronPoints(radius) {
    if ((typeof radius) == 'undefined') {
        radius = 1.0;
    }

    var theta0 = 0;
    var theta1 = Math.PI / 3.0;
    var theta2 = (2.0 * Math.PI) / 3.0;
    var theta4 = Math.PI;

    var phiSlice = (2.0 * Math.PI) / 5.0;
    var halfPhiSlice = phiSlice / 2.0;

    var phi1 = [0];
    var phi2 = [halfPhiSlice];

    for (var i = 1; i < 5; ++i) {
        phi1[i] = i * phiSlice;
        phi2[i] = halfPhiSlice + (i * phiSlice);
    }

    function toCart(phi, theta) {
        return toCartesian(radius, phi, theta);
    }

    var vertices = [];
    vertices[0] = toCart(0, theta0);
    for (var i = 0; i < 6; ++i) {
        vertices[1 + i] = toCart(phi1[i], theta1);
        vertices[7 + i] = toCart(phi2[i], theta2);
    }
    vertices[13] = toCart(0, theta4);
    return vertices;
}

function createIcosahedron(vertices, scene) {
    var indices = [
        0, 2, 1,
        0, 3, 2,
        0, 4, 3,
        0, 5, 4,
        0, 1, 5
    ];

    var shape = new THREE.Geometry();
    for (var i = 0; i < vertices.length; ++i) {
        shape.vertices.push(new THREE.Vector3(vertices[i].x, vertices[i].y, vertices[i].z));
    }

    for (var i = 0; i < indices.length; i += 3) {
        shape.faces.push(new THREE.Face3(indices[i], indices[i + 1], indices[i + 2]));
    }
    //shape.faces.push(new THREE.Face3(indices[0], indices[1], indices[2]));

    var colorCodes = [0xFF0000, 0x00FF00, 0x0000FF];
    var colors = [];
    for (var i = 0; i < colorCodes.length; ++i) {
        colors[i] = new THREE.Color(colorCodes[i]);
    }

    for (var i = 0; i < shape.faces.length; ++i) {
        for (var j = 0; j < colors.length; ++j) {
            shape.faces[i].vertexColors[j] = colors[j];
        }
    }

    /*for (var i = 0; i < colors.length; ++i) {
        shape.faces[0].vertexColors[i] = new THREE.Color(colors[i]);
    }*/

    var material = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
        side: THREE.DoubleSide
    });

    var mesh = new THREE.Mesh(shape, material);
    mesh.position.set(0, 0, 0);
    
    scene.add(mesh);
    return mesh;
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
    ico.rotation.y += 0.05;
    requestAnimationFrame(animateScene);
    renderScene(globalScene.renderer, globalScene.scene, globalScene.camera);
}

function renderScene(renderer, scene, camera) {
    renderer.render(scene, camera);
}

