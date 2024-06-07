import { AnimationMixer, LoopOnce, LoopRepeat} from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

/** @type {import('three').AnimationAction} */
let actionIdle;
/** @type {import('three').AnimationAction} */
let actionJump;
/** @type {import('three').AnimationAction} */
let actionBlock;
/** @type {import('three').AnimationAction} */
let actionKick;
/** @type {import('three').AnimationAction} */
let actionCrouchIdle;
/** @type {import('three').AnimationAction} */
let actionCrouchBlock;

let crouching = false;

async function loadWomanData() {
  const loader = new GLTFLoader();
  
  const loadedData = await loader.loadAsync('/3d-models/warcraft_3_alliance_footmanfanmade.glb');
  
  console.log("Woman: ", loadedData);
  const dataModel = setupModel(loadedData);

  return dataModel;
}

/**
 * 
 * @param {*} data
 * @returns 
 */
function setupModel(data) {
  const model = data.scene.children[0];
  // model.position.set(0, 0.69, 0);

  const animationIdle = data.animations[0];
  const animationJump = data.animations[5];
  const animationBlock = data.animations[6];
  const animationKick = data.animations[10];
  const animationCrouchIdle = data.animations[7];
  const animationCrouchBlock = data.animations[8];

  const mixer = new AnimationMixer(model);
  actionIdle = mixer.clipAction(animationIdle);
  actionCrouchIdle = mixer.clipAction(animationCrouchIdle);

  actionJump = mixer.clipAction(animationJump);
  actionJump.setLoop(LoopOnce, 1);

  actionBlock = mixer.clipAction(animationBlock);
  actionBlock.setLoop(LoopOnce, 1);

  actionKick = mixer.clipAction(animationKick);
  actionKick.setLoop(LoopOnce, 1);

  actionCrouchBlock = mixer.clipAction(animationCrouchBlock);
  actionCrouchBlock.setLoop(LoopOnce, 1);

  actionIdle.play();

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
function playPlayerAnimation(animation) {
  switch (animation) {
    case 'idle':
      actionIdle.stop();
      actionCrouchIdle.stop();
      
      if (crouching) {
        actionCrouchIdle.play();
      } else {
        actionIdle.play();
      }
      break;
    case 'jump':
      actionJump.reset().play();
      break;
    case 'block':
      if (crouching) {
        actionCrouchBlock.reset().play();
      } else {
        actionBlock.reset().play();
      }
      break;
    case 'kick':
      actionKick.reset().play();
      break;
    default:
      actionIdle.play();
      break;
  }
}

/**
 * @param {string} animation
 * @returns {void}
 */
function stopPlayerAnimations(animation) {
  [actionIdle, actionJump, actionBlock, actionKick, actionCrouchIdle, actionCrouchBlock].forEach((action) => {
    if (action.isRunning() && action.getClip().name !== animation) {
      action.stop();
    }
  });
}

function toggleCrouching() {
  crouching = !crouching;
}

export { loadWomanData, playPlayerAnimation, stopPlayerAnimations, toggleCrouching };