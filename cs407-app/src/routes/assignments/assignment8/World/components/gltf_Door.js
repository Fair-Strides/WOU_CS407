import { AnimationAction, AnimationMixer, LoopOnce} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/** @type {AnimationAction} */
let actionOpen;

async function loadDoorData() {
  const loader = new GLTFLoader();
  /** 
   * @type {import('three/examples/jsm/Addons.js').GLTF}
   */
  const loadedData = await loader.loadAsync('/3d-models/sci-fi_door.glb');
  
  console.log("Door: ", loadedData);
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

  const animationOpen = data.animations[0];

  const mixer = new AnimationMixer(model);
  actionOpen = mixer.clipAction(animationOpen);
  actionOpen.setLoop(LoopOnce, 1);

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
function playDoorAnimation(animation) {
  switch (animation) {
    case 'open':
      actionOpen.reset().play();
      break;
    default:
      actionOpen.stop();
      break;
  }
}

/**
 * @param {string} animation
 * @returns {void}
 */
function stopDoorAnimations(animation) {
}

export { loadDoorData, playDoorAnimation, stopDoorAnimations};