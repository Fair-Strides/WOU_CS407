import { AnimationMixer} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

async function loadCrateData() {
  const loader = new GLTFLoader();
  /** 
   * @type {import('three/examples/jsm/Addons.js').GLTF}
   */
  const loadedData = await loader.loadAsync('/3d-models/another_sci-fi_case_animated.glb');
  
  console.log("Crate: ", loadedData);
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

  // const animationRun = data.animations[0];

  const mixer = new AnimationMixer(model);
  // actionRun = mixer.clipAction(animationRun);

  // actionIdle.play();

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

export { loadCrateData };