import { Mesh, MeshPhongMaterial, BufferGeometry, BufferAttribute} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

async function loadWolfData() {
  const loader = new GLTFLoader();
  /** 
   * @type {import('three/examples/jsm/Addons.js').GLTF}
   */
  const loadedData = await loader.loadAsync('/3d-models/scene-v1.glb');

  const wolfModel = setupModel(loadedData);

  return wolfModel;
}

/**
 * 
 * @param {import('three/examples/jsm/Addons.js').GLTF} data
 * @returns 
 */
function setupModel(data) {
  const model = data.scene.children[0];
  model.position.set(0, 0.69, 0);

  return model;
}

export { loadWolfData };