import { get } from 'svelte/store';
import { BoxGeometry, ConeGeometry, RingGeometry, TubeGeometry, EdgesGeometry, LatheGeometry, PlaneGeometry,
  ShapeGeometry, TorusGeometry, CircleGeometry, SphereGeometry, CapsuleGeometry, ExtrudeGeometry, CylinderGeometry,
  TorusKnotGeometry, WireframeGeometry, OctahedronGeometry, PolyhedronGeometry, IcosahedronGeometry, TetrahedronGeometry,
  DodecahedronGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial, MeshDepthMaterial, MeshDistanceMaterial, MeshLambertMaterial,
  MeshMatcapMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshToonMaterial,
  Vector3,
  Color,
  Light,
  PointLight,
  Matrix3,
  Group,
  Object3D} from 'three';
import { degToRad } from 'three/src/math/MathUtils.js';

function createSolarSystem() {
  let sunGeo = new SphereGeometry(3, 32, 16);
  let sunMaterial = new MeshStandardMaterial({color: 0xffff00});
  let sun = new Mesh(sunGeo, sunMaterial);
  sun.name = "Sun";
  sun.position.set(0, 0, 0);

  let orbitColor = "#808080"
  createPlanet(sun, "Mercury",  10, orbitColor, 1, "#888888", "#FF0000");    // Mercury
  createPlanet(sun, "Venus",    15, orbitColor, 1, "#845e12", "#FFAA00");  // Venus
  createPlanet(sun, "Earth",    20, orbitColor, 1, "#122e84", "#FFFFAA");    // Earth
  createPlanet(sun, "Mars",     25, orbitColor, 1, "#842912", "#8A8A8A");  // Mars
  createPlanet(sun, "Jupiter",  30, orbitColor, 1, "#c44b17", "#00FFFF");    // Jupiter
  createPlanet(sun, "Saturn",   35, orbitColor, 1, "#906d3f", "#FF00FF");  // Saturn
  createPlanet(sun, "Uranus",   40, orbitColor, 1, "#2cd0d0", "#FFAAFF");    // Uranus
  createPlanet(sun, "Neptune",  45, orbitColor, 1, "#2c5bd0", "#AAFFFF");  // Neptune

  /**
   * @param {number} delta
   */
  // @ts-ignore
  sun.tick = (delta) => {
    for (const geometry of sun.children ?? []) {
      for (const planet of geometry.children[0].children) {
        if(planet.name.includes('PlanetMesh')) {
          let angle = getAngle(planet.name) * delta;
          rotateAroundOrbit(planet, angle);
        }
      }
    }
  };

  return sun;
}

/**
 * 
 * @param {Mesh} sun
 * @param {string} planetName
 * @param {number} orbitRadius 
 * @param {string | Color} orbitColor 
 * @param {number} planetRadius 
 * @param {string | Color} planetColor 
 * @param {string | Color} planetLightColor
 */
function createPlanet(sun, planetName, orbitRadius, orbitColor, planetRadius, planetColor, planetLightColor) {
  let group = new Group();
  group.name = planetName;
  let orbit = new RingGeometry(orbitRadius, orbitRadius + 0.25, 48);
  let orbitMaterial = new MeshBasicMaterial({color: orbitColor, side: 2});
  let orbitMesh = new Mesh(orbit, orbitMaterial);
  orbitMesh.name = `${planetName}OrbitMesh`;
  group.add(orbitMesh);

  let planetGeo = new SphereGeometry(planetRadius, 32, 16);
  let planetMaterial = new MeshStandardMaterial({color: "#8A8A8A", metalness: 0.8, flatShading: false});
  // let planetMaterial = new MeshStandardMaterial({color: planetColor, transparent: false, opacity: 0.8, emissive: planetLightColor, emissiveIntensity: 0.9});
  let planetMesh = new Mesh(planetGeo, planetMaterial);
  planetMesh.name = `${planetName}PlanetMesh`;
  group.add(planetMesh);

  let planetLight = new PointLight(planetLightColor, 200, 5, 0.5);
  planetLight.castShadow = true;
  planetLight.name = `${planetName}PlanetLight`;
  group.add(planetLight);

  planetMesh.add(planetLight);
  orbitMesh.add(planetMesh);
  sun.add(group);
  
  setNewPositionFromObject(planetMesh, orbitMesh, new Vector3(0, orbitRadius, 0));
  planetLight.position.set(0, 0, -5);
  
  // Align the orbit to the ground
  rotateToGround(orbitMesh);
}


/**
 * @param {Mesh | PointLight} object
 * @param {Mesh} target
 * @param {Vector3} vectorDistance
 * @param {boolean} randomRotation
 * @returns {Vector3}
 */
 function setNewPositionFromObject(object, target, vectorDistance, randomRotation = true) {
  const distanceVector = target.position.clone().add(vectorDistance);

  if (randomRotation) {
    const randomAngle = degToRad(Math.random() * 360);
    
    // Setting up a matrix for rotation of the distance vector
    const rotationMatrix = new Matrix3().set(
      Math.cos(randomAngle), -Math.sin(randomAngle), 0,
      Math.sin(randomAngle), Math.cos(randomAngle), 0,
      0, 0, 1
    );

    distanceVector.applyMatrix3(rotationMatrix);
  }

  // Rotate the distance vector
  object.position.set(distanceVector.x, distanceVector.y, distanceVector.z);
  return object.position.clone();
}

/**
 * @param {Mesh} object
 */
function rotateToGround(object) {
  object.rotation.x = Math.PI / 2;
}

/**
 * @param {Object3D<import('three').Object3DEventMap>} object
 * @param {number} angle
 */
function rotateAroundOrbit(object, angle) {
  const distanceVector = object.position.clone();

  const randomAngle = degToRad(angle);

  const rotationMatrix = new Matrix3().set(
    Math.cos(randomAngle), -Math.sin(randomAngle), 0,
    Math.sin(randomAngle), Math.cos(randomAngle), 0,
    0, 0, 1
  );

  distanceVector.applyMatrix3(rotationMatrix);

  // Rotate the distance vector
  object.position.set(distanceVector.x, distanceVector.y, distanceVector.z);
}

/**
 * @param {string} name
 * @returns {number}
 */
function getAngle(name) {
  let angle = 0;
  switch(name) {
    case "MercuryPlanetMesh":
      angle = 100;
      break;
    case "VenusPlanetMesh":
      angle = 50;
      break;
    case "EarthPlanetMesh":
      angle = 10;
      break;
    case "MarsPlanetMesh":
      angle = 5;
      break;
    case "JupiterPlanetMesh":
      angle = 1;
      break;
    case "SaturnPlanetMesh":
      angle = 0.5;
      break;
    case "UranusPlanetMesh":
      angle = 0.1;
      break;
    case "NeptunePlanetMesh":
      angle = 0.05;
      break;
  }

  return angle;
}

export { createSolarSystem, rotateAroundOrbit };