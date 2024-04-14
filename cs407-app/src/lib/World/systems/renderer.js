import { WebGLRenderer } from 'three';

function createRenderer(container) {
  const renderer = new WebGLRenderer({canvas: container, antialias: true})

  return renderer;
}

export { createRenderer };
