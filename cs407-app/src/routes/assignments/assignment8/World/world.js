import { createCamera } from './components/camera.js';
import { createGeometry } from './components/shape.js';
import { createLight } from './components/lights.js';
import { createScene } from './components/scene.js';
import { loadBulletData } from './components/gltf_Bullet.js';
import { loadCrateData } from './components/gltf_Crate.js';
import { loadDoorData } from './components/gltf_Door.js';
import { loadDroneData } from './components/gltf_Drone.js';
import { loadHelmetData } from './components/gltf_Helmet.js';
import { loadWomanData } from './components/gltf_Woman.js';
import { createCylinder, setFragmentShader, setVertexShader } from './components/shaderObject.js';
import { createRooms } from './components/rooms.js';

import { Loop } from './systems/Loop.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Controls } from './systems/Controls.js';
import { GridHelper, AxesHelper, Mesh, Vector3, Raycaster, PlaneGeometry, MeshPhongMaterial, MeshStandardMaterial } from 'three';

import { OrbitControls, FirstPersonControls, PointerLockControls } from 'three/examples/jsm/Addons.js';
import { PlayerControls } from './systems/PlayerControls.js';
import { degToRad } from 'three/src/math/MathUtils.js';
import { floor } from 'three/examples/jsm/nodes/Nodes.js';

// These variables are module-scoped: we cannot access them
// from outside the module
/** @type {HTMLCanvasElement} */
let container;
/** @type {Mesh} */
let floorMesh;
/** @type {import('three').PerspectiveCamera} */
let camera;
/** @type {Controls} */
let controls;
/** @type {import('three').WebGLRenderer} */
let renderer;
/** @type {import('three').Scene} */
let scene;
/** @type {import('three').GridHelper} */
let grid;
/** @type {import('./components/lights.js').LightTypes[]} */
let lights = [];
/** @type {import('./components/shape.js').GeometryInfo[]} */
let geometry = [];
let renderMode = 'Show';
let renderGrid = 'Hide';
/** @type {number | null} */
let animateId = null;
/** @type {boolean | number} */
let animateStatus;
/** @type {Loop} */
let loop;
/** @type {Mesh} */
let cylinder;

/**
 * @typedef WorldOptions
 * @property {HTMLCanvasElement} container
 * @property {import('./components/shape.js').GeometryInfo[]} startingGeometry
 * @property {import('./components/lights.js').LightInfo[]} startingLights
 * @property {[number, number, number]} cameraPosition
 * @property {[number, number, number]} cameraView
 */
class World {
  /**
   * @param {WorldOptions} options
   */
  constructor({
    container,
    startingGeometry = [],
    startingLights = [],
    cameraPosition = [0, 0, 0],
    cameraView = [0, 0, 0],
  }) {
    geometry = startingGeometry
    container = container;
    camera = createCamera(cameraPosition, cameraView);
    scene = createScene();
    renderer = createRenderer(container);
    loop = new Loop(camera, scene, renderer);
    renderMode = 'solid';
    animateId = null;
    animateStatus = false;
    lights = [];
    container = container;

    // For each geometry in the sceneOptions, create a mesh and add it to the scene
    for (const geometry of startingGeometry) {
      /** @type {import('three').Mesh} */
      const mesh = createGeometry(geometry);
      if(geometry.name) mesh.name = geometry.name;

      mesh.position.set(...geometry.position);
      const rotationInRadians = geometry.rotation.map((deg) => degToRad(deg));
      mesh.rotation.set(...rotationInRadians );

      // add the mesh to the scene
      scene.add(mesh);
      // loop.updatables.push(mesh);
    }

    // Create a sphere
    cylinder = createCylinder(1, 5, 32, [0, 0.35, 3]);
    cylinder.name = 'Cylinder';

    let vertexShaderText = `varying vec2 uvCoords;
    uniform float xValue;
    uniform float yValue;
    uniform float zValue;

    void main() {
      uvCoords = uv;
      vec3 newPosition = vec3(xValue, yValue, zValue);
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position + newPosition, 1.0 );
    }
    `;

    let fragmentShaderText = `precision mediump float;
    varying vec2 uvCoords;

    uniform vec3 uvColor;

    void main() {
      float lineThickness = 0.003;
      float lineFrequency = 9.0;
      
      // Calculate the distance from the top-left corner to the bottom-right corner
      float diagonalDistance = length(uvCoords - vec2(0.5, 0.5));
      
      float remainder = mod(diagonalDistance, 1.0 / lineFrequency);

      float distanceToLine = min(remainder, 1.0 / lineFrequency - remainder);
      float alpha = 1.0 - smoothstep(0.0, lineThickness, distanceToLine);

      if(remainder < lineThickness || remainder > (1.0 / lineFrequency) - lineThickness) {
        gl_FragColor = vec4( uvColor, alpha );
      } else if(remainder < 2.0 * lineThickness || remainder > (2.0 / lineFrequency) - 2.0 * lineThickness) {
        gl_FragColor = vec4( uvColor, alpha );
      } else if(remainder < 3.0 * lineThickness || remainder > (3.0 / lineFrequency) - 3.0 * lineThickness) {
        gl_FragColor = vec4( uvColor, alpha );
      } else {  
        gl_FragColor = vec4( 0.0, 0.0, 0.0, 0.0 );
      }
    }`;

    setVertexShader(cylinder, vertexShaderText);
    setFragmentShader(cylinder, fragmentShaderText);

    let floorGeometry = new PlaneGeometry( 2000, 2000, 100, 100 );
    floorGeometry.rotateX( - Math.PI / 2 );
    let floorMaterial = new MeshStandardMaterial( { color: 0x808080, metalness: 0.75, roughness: 0.25 });
    floorMesh = new Mesh( floorGeometry, floorMaterial );
    floorMesh.receiveShadow = true;
    scene.add( floorMesh );

    // For each light in the lightOptions, create a light and add it to the scene
    for (const light of startingLights) {
      light.reference = createLight(light);
      lights.push(light.reference);
    }
    scene.add(...lights);

    const resizer = new Resizer(container, camera, renderer);

    // create the rooms
    const rooms = createRooms();
    scene.add(rooms);

    // create a grid
    grid = new GridHelper(250, 250, 'white', 'white');
    grid.name = 'Grid';
    scene.add(grid);

    let axesHelper = new AxesHelper(5);
    scene.add(axesHelper);

    // create an orbit control
    // controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.25;
    // controls.enableZoom = true;

    // controls = new FirstPersonControls(camera, renderer.domElement);
    // controls.movementSpeed = 150;
    // controls.lookSpeed = 0.1;
  }

  async init() {
    // load the 3D model
    // const bullet = await loadBulletData();
    // bullet.scale.set(0.05, 0.05, 0.05);
    // scene.add(bullet);

    const door = await loadDoorData();
    scene.add(door);
    door.scale.set(0.0075, 0.0075, 0.0075);
    door.position.set(-5, 0, 0);

    const crate = await loadCrateData();
    scene.add(crate);
    crate.position.set(0, 0.35, 3);

    const drone = await loadDroneData();
    scene.add(drone);
    drone.scale.set(0.005, 0.005, 0.005);
    drone.position.set(-13, 1.88, 0);
    drone.rotation.set(-Math.PI / 2, Math.PI / 6, Math.PI / 2);

    const woman = await loadWomanData();
    scene.add(woman);
    woman.position.set(0, 0, 0);
    // woman.scale.set(0.01, 0.01, 0.01);
    woman.rotation.set(-Math.PI / 2, 0, 0);

    // const helmet = await loadHelmetData();
    // scene.add(helmet );
    // helmet.scale.set(0.01, 0.01, 0.01);
    // helmet.position.set(0, 1.45, -0.02);

    // controls.target.copy(woman.position);
    // woman.add(camera);
    // camera.position.set(0, 0, -0.5);
    // camera.lookAt(woman);
    loop.updatables.push(crate);
    loop.updatables.push(drone);
    loop.updatables.push(door);
    loop.updatables.push(woman);

    // controls = new PlayerControls(camera, woman, renderer.domElement);
    // controls.tick = (delta) => {
    //   controls.update(delta);
    // };

    // loop.updatables.push(controls);
    controls = new Controls(scene, camera, renderer.domElement, floorMesh, crate, cylinder, door, drone, woman);
    scene.add(controls.controls.getObject());
    loop.updatables.push(controls.controls);
  }

  render() {
    // update the controls
    // controls.update();

    // draw a single frame
    renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }

  /**
   * @param {number} index
   * @param {string} color
   */
  changeLightColor(index, color) {
    lights[index].color.set(color);

    this.render();
  }

  /**
   * @param {number} index
   * @param {number} intensity
   */
  changeLightIntensity(index, intensity) {
    lights[index].intensity = +intensity;

    this.render();
  }

  /**
   * @param {string} mode
   */
  renderMode(mode) {
    renderMode = mode;
    const renderState = renderMode === 'Show';

    /** @type {Mesh} geoObject */
    for (const geoObject of scene.children.filter((obj) => obj instanceof Mesh)) {
      // @ts-expect-error
      geoObject.material.wireframe = !renderState;
    }
  }

  /**
   * @param {string} mode
   */
  renderGrid(mode) {
    renderGrid = mode;
    const renderGridState = renderGrid === 'Show';

    var grid = scene.getObjectByName('Grid');
    if (scene && grid) {
      grid.visible = renderGridState;
    }
  }

  /**
   * @param {string} direction
   */
  rotateCamera(direction) {
    let angle = 0.01;
    if (direction === 'left') {
      camera.rotation.y += angle;
    } else if (direction === 'right') {
      camera.rotation.y -= angle;
    } else if (direction === 'up') {
      camera.rotation.x += angle;
    } else if (direction === 'down') {
      camera.rotation.x -= angle;
    }

    this.render();
  }

  /**
   * @param {string} direction
   */
  moveCamera(direction) {
    let distance = 0.1;
    if (direction === 'left') {
      camera.position.x -= distance;
    } else if (direction === 'down') {
      camera.position.z += distance;
    } else if (direction === 'up') {
      camera.position.z -= distance;
    } else if (direction === 'right') {
      camera.position.x += distance;
    } else if (direction === 'forward') {
      camera.position.y += distance;
    } else if (direction === 'backward') {
      camera.position.y -= distance;
    }

    this.render();
  }

  /**
   * @returns {number}
   */
  getFrameRate() {
    return loop.getFrameRate();
  }
}

export { World };
