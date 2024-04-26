/**
 * 
 * @param { HTMLElement } container
 * @param { import('three').PerspectiveCamera } camera 
 * @param { import('three').WebGLRenderer } renderer 
 */
const setSize = (container, camera, renderer) => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
  }

class Resizer {
    /**
     * @param {HTMLElement} container
     * @param {import ('three').PerspectiveCamera} camera
     * @param {import ('three').WebGLRenderer} renderer
     */
    constructor(container, camera, renderer) {
      // set initial size
      setSize(container, camera, renderer);

      // set up event listener
      window.addEventListener('resize', () => {
        // set the size again if a resize occurs
        setSize(container, camera, renderer);

        // perform any custom actions
        this.onResize();
      });
    }

    onResize() {
      // empty for now, but can be customized
    }    
  }
  
  export { Resizer };
  