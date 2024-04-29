import { createCamera } from './components/camera.js';
import { createGeometry } from './components/shape.js';
import { createLight } from './components/lights.js';
import { createScene } from './components/scene.js';
import { createSolarSystem, rotateAroundOrbit } from './components/solarSystem.js';

import { Loop } from './systems/Loop.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { GridHelper, AxesHelper } from 'three';

// These variables are module-scoped: we cannot access them
// from outside the module
/** @type {import('three').PerspectiveCamera} */
let camera;
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
let renderMode = 'solid';
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
    
    // container.append(renderer.domElement);


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

    let solarSystem = createSolarSystem();
    scene.add(solarSystem);
    loop.updatables.push(solarSystem);

    // create a grid
    // grid = new GridHelper(25, 25, 'white', 'white');
    // scene.add(grid);

    let axesHelper = new AxesHelper(5);
    scene.add(axesHelper);
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
   * @param {string} direction
   */
  rotateSun(direction) {
    let angle = 0.01;
    let sun = scene.getObjectByName("Sun");

    if(!sun) return;

    if (direction === 'left') {
      sun.rotation.y -= angle;
    } else if (direction === 'right') {
      sun.rotation.y += angle;
    } else if (direction === 'up') {
      sun.rotation.x += angle;
    } else if (direction === 'down') {
      sun.rotation.x -= angle;
    }

    this.render();
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
   * @param {string} direction
   */
  rotateCamera(direction) {
    let angle = 0.01;
    if (direction === 'left') {
      camera.rotation.y -= angle;
    } else if (direction === 'right') {
      camera.rotation.y += angle;
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
