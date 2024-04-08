import {
    BoxGeometry,
    Color,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from 'three';

// Get our scene container
const container = document.querySelector('#scene-container');

// create a Scene
const scene = new Scene();

// create a WebGLRenderer
const renderer = new WebGLRenderer();

let cameraData = {
    fov: 35,
    aspect: container.clientWidth / container.clientHeight,
    near: 0.1,
    far: 100
};

console.log(`Hello, three.js! Container Dimensions are ${container.clientWidth} x ${container.clientHeight}`);
// Set the background color
scene.background = new Color('gray');

// Create a camera
const camera = new PerspectiveCamera(cameraData.fov, cameraData.aspect, cameraData.near, cameraData.far);

// every object is initially created at ( 0, 0, 0 )
// move the camera back so we can view the scene
camera.position.set(0, 0, 10);

// Create a geometry
// Then add a material to apply to it
const geometry = new BoxGeometry(2, 2, 2);
const material = new MeshBasicMaterial({ color: 'green'});

// And now put the pieces together
const cube = new Mesh(geometry, material);

// add the mesh to the scene
scene.add(cube);

// next, set the renderer to the same size as our container element
renderer.setSize(container.clientWidth, container.clientHeight);

// finally, set the pixel ratio so that our scene will look good on HiDPI displays
renderer.setPixelRatio(window.devicePixelRatio);

// add the automatically created <canvas> element to the page
container.append(renderer.domElement);

// render, or 'create a still image', of the scene
renderer.render(scene, camera);