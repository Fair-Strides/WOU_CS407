import { createCamera } from './components/camera.js';
import { createGeometry } from './components/shape.js';
import { createLight } from './components/lights.js';
import { createScene } from './components/scene.js';

import { Loop } from './systems/Loop.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { GridHelper, AxesHelper, Mesh } from 'three';

import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { loadWolfData } from './components/gltfWolf.js';

// These variables are module-scoped: we cannot access them
// from outside the module
/** @type {import('three').PerspectiveCamera} */
let camera;
/** @type {OrbitControls} */
let controls;
/** @type {import('three').WebGLRenderer} */
let renderer;
/** @type {import('three').Scene} */
let scene;
/** @type {import('three').GridHelper} */
let grid;
/** @type {import('./components/lights.js').LightTypes[]} */
let lights = [];
/** @type {import('./components/shape.js').GeometryInfo[]} */
let geometry = [];
let renderMode = 'Show';
let renderGrid = 'Hide';
/** @type {number | null} */
let animateId = null;
/** @type {boolean | number} */
let animateStatus;
/** @type {Loop} */
let loop;

/**
 * @typedef WorldOptions
 * @property {HTMLCanvasElement} container
 * @property {import('./components/shape.js').GeometryInfo[]} startingGeometry
 * @property {import('./components/lights.js').LightInfo[]} startingLights
 * @property {[number, number, number]} cameraPosition
 * @property {[number, number, number]} cameraView
 */
class World {
  /**
   * @param {WorldOptions} options
   */
  constructor({
    container,
    startingGeometry = [],
    startingLights = [],
    cameraPosition = [0, 0, 0],
    cameraView = [0, 0, 0],
  }) {
    geometry = startingGeometry
    camera = createCamera(cameraPosition, cameraView);
    scene = createScene();
    renderer = createRenderer(container);
    loop = new Loop(camera, scene, renderer);
    renderMode = 'solid';
    animateId = null;
    animateStatus = false;
    lights = [];
    container = container;

    // For each geometry in the sceneOptions, create a mesh and add it to the scene
    for (const geometry of startingGeometry) {
      /** @type {import('three').Mesh} */
      const mesh = createGeometry(geometry);
          mesh.position.set(...geometry.position);

      // add the mesh to the scene
      scene.add(mesh);
      loop.updatables.push(mesh);
    }

    // For each light in the lightOptions, create a light and add it to the scene
    for (const light of startingLights) {
      light.reference = createLight(light);
      lights.push(light.reference);
    }
    scene.add(...lights);

    const resizer = new Resizer(container, camera, renderer);

    // create a grid
    grid = new GridHelper(25, 25, 'white', 'white');
    grid.name = 'Grid';
    scene.add(grid);

    let axesHelper = new AxesHelper(5);
    scene.add(axesHelper);

    // create an orbit control
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
  }

  async init() {
    // load the 3D model
    const wolf = await loadWolfData();
    scene.add(wolf);

    controls.target.copy(wolf.position);
  }

  render() {
    // draw a single frame
    renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }

  /**
   * @param {number} index
   * @param {string} color 
   */
  changeLightColor(index, color) {
    lights[index].color.set(color);

    this.render();
  }

  /**
   * @param {number} index
   * @param {number} intensity 
   */
  changeLightIntensity(index, intensity) {
    lights[index].intensity = +intensity;

    this.render();
  }

  /**
   * @param {string} mode
   */
  renderMode(mode) {
    renderMode = mode;
    const renderState = renderMode === 'Show';

    /** @type {Mesh} geoObject */
    for (const geoObject of scene.children.filter((obj) => obj instanceof Mesh)) {
      geoObject.material.wireframe = !renderState;
    }
  }

  /**
   * @param {string} mode
   */
  renderGrid(mode) {
    renderGrid = mode;
    const renderGridState = renderGrid === 'Show';

    var grid = scene.getObjectByName('Grid');
    if (scene && grid) {
      grid.visible = renderGridState;
    }
  }

  /**
   * @param {string} direction
   */
  rotateCamera(direction) {
    let angle = 0.01;
    if (direction === 'left') {
      camera.rotation.y += angle;
    } else if (direction === 'right') {
      camera.rotation.y -= angle;
    } else if (direction === 'up') {
      camera.rotation.x += angle;
    } else if (direction === 'down') {
      camera.rotation.x -= angle;
    }

    this.render();
  }

  /**
   * @param {string} direction
   */
  moveCamera(direction) {
    let distance = 0.1;
    if (direction === 'left') {
      camera.position.x -= distance;
    } else if (direction === 'down') {
      camera.position.z += distance;
    } else if (direction === 'up') {
      camera.position.z -= distance;
    } else if (direction === 'right') {
      camera.position.x += distance;
    } else if (direction === 'forward') {
      camera.position.y += distance;
    } else if (direction === 'backward') {
      camera.position.y -= distance;
    }

    this.render();
  }
}

export { World };
