import { Mesh, MeshPhongMaterial, BufferGeometry, BufferAttribute, AnimationMixer} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/** @type {import('three').AnimationAction} */
let actionRun;
/** @type {import('three').AnimationAction} */
let actionWalk;
/** @type {import('three').AnimationAction} */
let actionCreep;
/** @type {import('three').AnimationAction} */
let actionIdle;
/** @type {import('three').AnimationAction} */
let actionIdle2;

async function loadWolfData() {
  const loader = new GLTFLoader();
  /** 
   * @type {import('three/examples/jsm/Addons.js').GLTF}
   */
  const loadedData = await loader.loadAsync('/3d-models/scene-v1.glb');

  console.log('loadedData', loadedData);
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

  const animationRun = data.animations[0];
  const animationWalk = data.animations[1];
  const animationCreep = data.animations[2];
  const animationIdle = data.animations[3];
  const animationIdle2 = data.animations[4];

  const mixer = new AnimationMixer(model);
  actionRun = mixer.clipAction(animationRun);
  actionWalk = mixer.clipAction(animationWalk);
  actionCreep = mixer.clipAction(animationCreep);
  actionIdle = mixer.clipAction(animationIdle);
  actionIdle2 = mixer.clipAction(animationIdle2);

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
function playAnimation(animation) {
  if(animation === 'run') {
    actionRun.play();
  } else if(animation === 'walk') {
    actionWalk.play();
  } else if(animation === 'creep') {
    actionCreep.play();
  } else if(animation === 'idle') {
    actionIdle.play();
  } else if(animation === 'idle2') {
    actionIdle2.play();
  }
}

export { loadWolfData, playAnimation };