import { createCamera } from './components/camera.js';
import { createGeometry } from './components/shape.js';
import { createLight } from './components/lights.js';
import { createScene } from './components/scene.js';

import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';

// These variables are module-scoped: we cannot access them
// from outside the module
/** @type {import('three').PerspectiveCamera} */
let camera;
/** @type {import('three').WebGLRenderer} */
let renderer;
/** @type {import('three').Scene} */
let scene;
/** @type {import('./components/lights.js').LightTypes[]}*/
let lights = [];

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
    camera = createCamera(cameraPosition, cameraView);
    scene = createScene();
    renderer = createRenderer(container);
    // container.append(renderer.domElement);


    // For each geometry in the sceneOptions, create a mesh and add it to the scene
    for (const geometry of startingGeometry) {
      /** @type {import('three').Mesh} */
      const mesh = createGeometry(geometry);
          mesh.position.set(...geometry.position);

      // add the mesh to the scene
      scene.add(mesh);
    }

    // For each light in the lightOptions, create a light and add it to the scene
    for (const light of startingLights) {
      light.reference = createLight(light);
      lights.push(light.reference);
    }
    scene.add(...lights);

    const resizer = new Resizer(container, camera, renderer);
  }

  render() {
    // draw a single frame
    renderer.render(scene, camera);
  }

  /**
   * @param {number} index
   * @param {string} color 
   */
  changeLightColor(index, color) {
    console.log(`Light: ${index}: ${color}`);
    lights[index].color.set(color);

    renderer.render(scene, camera);
  }
}

export { World };
