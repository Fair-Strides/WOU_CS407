import { PerspectiveCamera } from 'three';

/**
 * 
 * @param {[number, number, number]} position 
 * @param {[number, number, number]} view
 * @returns 
 */
function createCamera(position, view) {
  const camera = new PerspectiveCamera(
    75, // fov = Field Of View
    1, // aspect ratio (dummy value)
    0.1, // near clipping plane
    150, // far clipping plane
  );

  // move the camera back so we can view the scene
  camera.position.set(...position);

  camera.lookAt(...view);

  return camera;
}

export { createCamera };
