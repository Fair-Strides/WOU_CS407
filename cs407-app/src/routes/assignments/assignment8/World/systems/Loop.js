import { Clock, Mesh } from 'three';
import { FirstPersonControls, PointerLockControls } from 'three/examples/jsm/Addons.js';

const clock = new Clock();

class Loop {
    /**
     * 
     * @param {import('three').PerspectiveCamera} camera 
     * @param {import('three').Scene} scene 
     * @param {import('three').WebGLRenderer} renderer 
     */
  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    /** @type {Array<Mesh|PointerLockControls>} */
    this.updatables = [];
    this.delta = 0;
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      // tell every animated object to tick forward one frame
      this.tick();

      // render a frame
      this.renderer.render(this.scene, this.camera);
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick() {
    // only call the getDelta function once per frame!
    this.delta = clock.getDelta();

    for (const object of this.updatables) {
      // @ts-ignore
      object.tick(this.delta);
    }
  }

  /**
   * 
   * @returns the current frame rate in frames per second
   */
  getFrameRate() {
    if (this.delta === 0) return 0;
    return 1 / this.delta;
  }
}

export { Loop };