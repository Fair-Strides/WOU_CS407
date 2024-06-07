import { AnimationMixer} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let actionIdle = null;

async function loadDroneData() {
  const loader = new GLTFLoader();
  /** 
   * @type {import('three/examples/jsm/Addons.js').GLTF}
   */
  const loadedData = await loader.loadAsync('/3d-models/scifi_drone_1.1.glb');
  
  console.log("Drone: ", loadedData);
  const dataModel = setupModel(loadedData);

  return dataModel;
}

/**
 * 
 * @param {import('three/examples/jsm/Addons.js').GLTF} data
 * @returns 
 */
function setupModel(data) {
  const model = data.scene.children[0];
  // model.position.set(0, 0.69, 0);

  const animationIdle = data.animations[0];

  const mixer = new AnimationMixer(model);
  actionIdle = mixer.clipAction(animationIdle);
  

  /**
   * tick: (delta: number) => void
   *
   * @param {number} delta 
   */
  model.tick = (delta) => { mixer.update(delta); };

  return model;
}

/**
 * 
 * @param {string} animation 
 */
function playAnimation(animation) {
}

/**
 * @param {string} animation
 * @returns {void}
 */
function stopAnimations(animation) {
}

export { loadDroneData };