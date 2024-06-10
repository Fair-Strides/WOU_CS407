import { AnimationMixer, LoopOnce} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/** @type {import('three').AnimationAction} */
let actionAttack;
/** @type {import('three').AnimationAction} */
let actionDodgeLeft;
/** @type {import('three').AnimationAction} */
let actionDodgeRight;
/** @type {import('three').AnimationAction} */
let actionFire;
/** @type {import('three').AnimationAction} */
let actionIdle;

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
  
  const animationAttack = data.animations[0];
  const animationDodgeLeft = data.animations[1];
  const animationDodgeRight = data.animations[2];
  const animationFire = data.animations[3];
  const animationIdle = data.animations[4];

  const mixer = new AnimationMixer(model);
  actionAttack = mixer.clipAction(animationAttack);
  actionAttack.setLoop(LoopOnce, 1);

  actionDodgeLeft = mixer.clipAction(animationDodgeLeft);
  actionDodgeLeft.setLoop(LoopOnce, 1);

  actionDodgeRight = mixer.clipAction(animationDodgeRight);
  actionDodgeRight.setLoop(LoopOnce, 1);
  
  actionFire = mixer.clipAction(animationFire);
  actionFire.setLoop(LoopOnce, 4);

  actionIdle = mixer.clipAction(animationIdle);
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
function playDroneAnimation(animation) {
  switch(animation) {
    case 'idle':
      actionIdle.play();
      break;
    case 'dodge':
      const choice = Math.round(Math.random());
      if(choice === 0) {
        actionDodgeLeft.reset().play();
      } else {
        actionDodgeRight.reset().play();
      }
      break;
    case 'attack':
      actionAttack.reset().play();
      break;
    case 'fire':
      actionFire.reset().play();
      break;
  }

}

/**
 * @param {string} animation
 * @returns {void}
 */
function stopDoneAnimations(animation) {
}

export { loadDroneData, playDroneAnimation, stopDoneAnimations };