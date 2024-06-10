import { AnimationAction, AnimationMixer, LoopOnce, LoopRepeat} from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

/** @type {AnimationAction} */
let actionIdle;
/** @type {AnimationAction} */
let actionMove;
/** @type {AnimationAction} */
let actionJump;
/** @type {AnimationAction} */
let actionBlock;
/** @type {AnimationAction} */
let actionKick;
/** @type {AnimationAction} */
let actionSlash;
/** @type {AnimationAction} */
let actionCrouchIdle;
/** @type {AnimationAction} */
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
  const animationMove = data.animations[2];
  const animationJump = data.animations[5];
  const animationBlock = data.animations[6];
  const animationCrouchIdle = data.animations[7];
  const animationCrouchBlock = data.animations[8];
  const animationKick = data.animations[10];
  const animationSlash = data.animations[12];

  const mixer = new AnimationMixer(model);
  actionIdle = mixer.clipAction(animationIdle);
  actionMove = mixer.clipAction(animationMove);
  actionCrouchIdle = mixer.clipAction(animationCrouchIdle);

  actionJump = mixer.clipAction(animationJump);
  actionJump.setLoop(LoopOnce, 1);

  actionBlock = mixer.clipAction(animationBlock);
  actionBlock.setLoop(LoopOnce, 1);

  actionKick = mixer.clipAction(animationKick);
  actionKick.setLoop(LoopOnce, 1);

  actionCrouchBlock = mixer.clipAction(animationCrouchBlock);
  actionCrouchBlock.setLoop(LoopOnce, 1);

  actionSlash = mixer.clipAction(animationSlash);
  actionSlash.setLoop(LoopOnce, 1);

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
      actionMove.stop();

      if (crouching) {
        actionCrouchIdle.play();
      } else {
        actionIdle.play();
      }
      break;
    case 'move':
      actionIdle.stop();
      actionCrouchIdle.stop();

      actionMove.play();
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
    case 'attack':
      actionSlash.reset().play();
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