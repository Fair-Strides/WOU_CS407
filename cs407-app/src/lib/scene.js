// @ts-nocheck
import {
	BoxGeometry,
	Color,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	Scene,
	WebGLRenderer
} from 'three';

/**
 * @type {Object} sceneOptions - Options for the scene
 * @property {HTMLElement} container - The container element for the scene
 * @property {number} containerWidth - The width of the container element
 * @property {number} containerHeight - The height of the container element
 * @property {Object} camera - Options for the camera
 * @property {number} camera.fov - The field of view for the camera
 * @property {number} camera.aspect - The aspect ratio for the camera
 * @property {number} camera.near - The near clipping plane for the camera
 * @property {number} camera.far - The far clipping plane for the camera
 * @property {Object} camera.position - The position of the camera
 * @property {number} camera.position.x - The x position of the camera
 * @property {number} camera.position.y - The y position of the camera
 * @property {number} camera.position.z - The z position of the camera
 * @property {Color} backgroundColor - The background color for the scene
 * @property {Array<Object>} startingGeometry - The starting geometry for the scene
 * @property {Function} startingGeometry.type - The type of geometry to create
 * @property {Array<number>} startingGeometry.dimensions - The dimensions of the geometry
 * @property {Object} startingGeometry.material - The material for the geometry
 * @property {Function} startingGeometry.material.type - The type of material to create
 * @property {string} startingGeometry.material.color - The color of the material
 */
let sceneOptions = {
	animate: false,
	animateId: null,
	renderMode: 'solid',
	container: window,
	containerWidth: window.innerWidth,
	containerHeight: window.innerHeight,
	camera: {
		fov: 35,
		aspect: window.innerWidth / window.innerHeight,
		near: 0.1,
		far: 100,
		position: {
			x: 0,
			y: 0,
			z: 10
		}
	},
	backgroundColor: new Color('gray'),
	startingGeometry: []
};
// create a Scene
let scene = new Scene();

// create a WebGLRenderer
let renderer = new WebGLRenderer();

// Create a camera
let camera = new PerspectiveCamera(
	sceneOptions.camera.fov,
	sceneOptions.camera.aspect,
	sceneOptions.camera.near,
	sceneOptions.camera.far
);

const resize = () => {
	renderer.setSize(sceneOptions.containerWidth, sceneOptions.containerHeight);
	camera.aspect = sceneOptions.containerWidth / sceneOptions.containerHeight;
	camera.updateProjectionMatrix();
};

export const animate = (state) => {
	console.log('Animating', state);
	sceneOptions.animate = state;
	if (state === false) {
		cancelAnimationFrame(sceneOptions.animateId);
		return;
	}

	sceneOptions.animateId = requestAnimationFrame(animate);
	for (const geometry of sceneOptions.startingGeometry) {
		if (geometry.rotate) {
			geometry.reference.rotation.x += 0.01;
			geometry.reference.rotation.y += 0.01;
		}
	}
	renderer.render(scene, camera);
};

export const renderMode = (state) => {
	console.log('Changing render mode', state);
	sceneOptions.renderMode = !state ? 'solid' : 'wireframe';
	const renderState = sceneOptions.renderMode === 'solid';
	for (const geometry of sceneOptions.startingGeometry) {
		geometry.reference.material.wireframe = !renderState;
	}

	renderer.render(scene, camera);
};

/**
 *
 * @param {HTMLElement} el - The canvas element to render the scene to
 * @param {Object} options - Options for the scene
 */
export const createScene = (el, options = {}) => {
	/**
	 * @type {HTMLElement} container - The container element for the scene
	 */

	let container = sceneOptions.container;

	// Merge the options with the defaults
	sceneOptions = { ...sceneOptions, ...options };

	if (container !== el) {
		console.log('Updating container');
		sceneOptions.container = el;
		sceneOptions.containerWidth = el.clientWidth;

		sceneOptions.containerHeight = el.clientHeight;
		sceneOptions.camera.aspect = el.clientWidth / el.clientHeight;

		console.log(sceneOptions);
	}

	// Every time we create a new scene, we want to clear the old one
	scene.clear();

	// Set the background color
	scene.background = sceneOptions.backgroundColor;

	// every object is initially created at ( 0, 0, 0 )
	// move the camera back so we can view the scene
	camera.fov = sceneOptions.camera.fov;
	camera.aspect = sceneOptions.camera.aspect;
	camera.near = sceneOptions.camera.near;
	camera.far = sceneOptions.camera.far;

	camera.position.set(
		sceneOptions.camera.position.x,
		sceneOptions.camera.position.y,
		sceneOptions.camera.position.z
	);

	// For each geometry in the sceneOptions, create a mesh and add it to the scene
	for (const geometry of sceneOptions.startingGeometry) {
		// Create a geometry
		// Then add a material to apply to it
		const geometryInstance = new geometry.type(...geometry.dimensions);
		const material = new geometry.material.type({
			color: geometry.material.color,
			wireframe: sceneOptions.renderMode === 'wireframe',
			flatShading: geometry.material.flatShading
		});

		// And now put the pieces together
		geometry.reference = new Mesh(geometryInstance, material);

		// add the mesh to the scene
		scene.add(geometry.reference);
	}

	renderer = new WebGLRenderer({ canvas: el });
	// next, set the renderer to the same size as our container element
	renderer.setSize(sceneOptions.containerWidth, sceneOptions.containerHeight);

	// finally, set the pixel ratio so that our scene will look good on HiDPI displays
	renderer.setPixelRatio(window.devicePixelRatio);

	// render, or 'create a still image', of the scene
	renderer.render(scene, camera);
	resize();

	sceneOptions.container.addEventListener('resize', resize);
};
