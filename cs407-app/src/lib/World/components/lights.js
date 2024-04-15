import { get } from 'svelte/store';
import { DirectionalLight, AmbientLight, PointLight, Light, SpotLight, HemisphereLight} from 'three';
import { distance } from 'three/examples/jsm/nodes/Nodes.js';

/**
 * @typedef { DirectionalLight|AmbientLight|PointLight|Light|SpotLight|HemisphereLight } LightTypes
 */

/**
 * @typedef {Object} LightInfo
 * @property {string} type
 * @property {string} color
 * @property {number} intensity
 * @property {[number, number, number]} position
 * @property {[number, number, number]} view
 * @property {LightTypes|null} reference
 */

/**
 * @param {LightInfo} lightInfo
 * @returns {LightTypes}
 */
function createLight(lightInfo) {
  // Create a directional light
  let lightType = getLightType(lightInfo.type);
  const light = new lightType(lightInfo.color, lightInfo.intensity, 200);

  // move the light right, up, and towards us
  light.position.set(...lightInfo.position);
  light.lookAt(...lightInfo.view);

  return light;
}


/**
 * 
 * @param {string} type 
 * @returns
 */
function getLightType(type) {
  switch (type) {
    case 'DirectionalLight':
      return DirectionalLight;
    case 'AmbientLight':
      return AmbientLight;
    case 'PointLight':
      return PointLight;
    case 'SpotLight':
      return SpotLight;
    case 'HemisphereLight':
      return HemisphereLight;
    default:
      throw new Error(`Unknown light type: ${type}`);
  }
}

export { createLight };
