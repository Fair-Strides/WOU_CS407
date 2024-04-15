import { createCamera } from './components/camera.js';
import { createGeometry } from './components/shape.js';
import { createLights } from './components/lights.js';
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
/** @type {import('three').DirectionalLight} */
let light;

class World {
  /**
   * @param {HTMLCanvasElement} container 
   * @param {import('./components/shape.js').GeometryInfo[]} startingGeometry 
   */
  constructor(container, startingGeometry = []) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer(container);
    light = createLights();
    // container.append(renderer.domElement);


    // For each geometry in the sceneOptions, create a mesh and add it to the scene
	for (const geometry of startingGeometry) {
    /** @type {import('three').Mesh} */
		const mesh = createGeometry(geometry);
        mesh.position.set(...geometry.position);

		// add the mesh to the scene
		scene.add(mesh);
	}
    light = createLights();
    scene.add(light);

    const resizer = new Resizer(container, camera, renderer);
  }

  render() {
    // draw a single frame
    renderer.render(scene, camera);
  }

  /**
   * 
   * @param {string} color 
   */
  changeLightColor(color) {
    console.log(color);
    light.color.set(color);

    renderer.render(scene, camera);
  }
}

export { World };
