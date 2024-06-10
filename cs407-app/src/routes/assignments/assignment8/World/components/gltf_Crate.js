import { AnimationMixer, LoopOnce} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/** @type {import('three').AnimationAction} */
let actionIdle;
/** @type {import('three').AnimationAction} */
let actionOpen;
/** @type {import('three').AnimationAction} */
let actionOpenClose;

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

  const animationOpen = data.animations[2];

  const mixer = new AnimationMixer(model);
  actionOpen = mixer.clipAction(animationOpen);

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
function playCrateAnimation(animation) {
  switch (animation) {
    case 'open':
      actionOpen.reset().play();
      break;
    default:
      actionOpenClose.stop();
      actionOpen.stop();
      break;
  }
}

/**
 * @param {string} animation
 * @returns {void}
 */
function stopCrateAnimations(animation) {
}

export { loadCrateData, playCrateAnimation, stopCrateAnimations};