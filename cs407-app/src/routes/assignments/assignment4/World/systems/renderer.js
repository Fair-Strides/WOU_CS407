import { WebGLRenderer } from 'three';

/**
 * 
 * @param {HTMLElement} container 
 * @returns 
 */
function createRenderer(container) {
  const renderer = new WebGLRenderer({canvas: container, antialias: true});
  return renderer;
}

export { createRenderer };
