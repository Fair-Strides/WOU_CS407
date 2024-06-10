import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { PerspectiveCamera, Raycaster, Vector3 } from 'three';
import { playPlayerAnimation, toggleCrouching } from '../components/gltf_Woman';
import { playCrateAnimation } from '../components/gltf_Crate';
import { playDoorAnimation } from '../components/gltf_Door';
import { toggleInScene } from '../components/shaderObject';
import { Mesh, Scene } from 'three';
import { playDroneAnimation } from '../components/gltf_Drone';

/** @type {Mesh} */
let floorMesh;

/** @type {Raycaster} */
let raycaster = new Raycaster( new Vector3(), new Vector3( 0, - 1, 0 ), 0, 1 );
let onObject = false;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
const velocity = new Vector3();
const direction = new Vector3();
const rotation = new Vector3();
/** @type {Mesh} */
let playerModel;
/** @type {Mesh} */
let crateModel;
/** @type {Mesh} */
let doorModel;
/** @type {Mesh} */
let droneModel;
/** @type {Mesh} */
let crateModelCylinder;
/** @type {Scene}  */
let scene;

class Controls {
    /**
     * @param {Scene} myScene
     * @param {PerspectiveCamera} camera
     * @param {HTMLElement} container
     * @param {Mesh} floor
     * @param {Mesh} crateMesh
     * @param {Mesh} crateCylinder
     * @param {Mesh} doorMesh
     * @param {Mesh} droneMesh
     * @param {Mesh} playerMesh
     */
    constructor(myScene, camera, container, floor, crateMesh, crateCylinder, doorMesh, droneMesh, playerMesh) {
    scene = myScene;
    floorMesh = floor;
    playerModel = playerMesh;
    crateModel = crateMesh;
    crateModelCylinder = crateCylinder;
    doorModel = doorMesh;
    droneModel = droneMesh;

    this.controls = new PointerLockControls(camera, container);
    this.controls.tick = (delta) => {
      if ( this.controls.isLocked === true ) {
        raycaster.ray.origin.copy( this.controls.getObject().position );
        raycaster.ray.origin.y -= 10;

        const intersections = raycaster.intersectObjects( [floorMesh], false );

        onObject = intersections.length > 0;

        velocity.x -= velocity.x * 100.0 * delta;
        velocity.z -= velocity.z * 100.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        this.updateDirection();
        this.updateVelocity(delta);
        this.updateControls(delta);
        // this.updateCameraPosition();

        // Calculate the position in front of the camera
        const distanceInFrontOfCamera = 1.5; // Change this to the desired distance
        const distanceFromCameraToFloor = this.controls.getObject().position.distanceTo(floorMesh.position);
        const cameraDirection = new Vector3();
        this.controls.getDirection(cameraDirection);
        const playerPosition = new Vector3().copy(this.controls.getObject().position).add(cameraDirection.multiplyScalar(distanceInFrontOfCamera));
        playerPosition.y = Math.max(0, playerPosition.y - Math.min(1.5, distanceFromCameraToFloor)); // Set the playerModel's position

        // Set the playerModel's position
        playerModel.position.lerp(playerPosition, 0.1);

        // Make the playerModel face the same direction as the camera
        let playerRotationX = (Math.PI / 2) - -this.controls.getObject().rotation.x;
        if(playerRotationX > (1.5 * Math.PI)) playerRotationX -= 2 * Math.PI;
        else if(playerRotationX > (0.5 * Math.PI)) playerRotationX = -0.5 * Math.PI;

        playerModel.rotation.x = playerRotationX;

        if ( moveForward || moveBackward || moveLeft || moveRight ) {
            playPlayerAnimation('move');
        } else {
            playPlayerAnimation('idle');
        }

        if ( this.controls.getObject().position.y < 2.5 ) {
          velocity.y = 0;
          this.controls.getObject().position.y = 1.5;

          canJump = true;
        }
      }
    };

    container.addEventListener( 'keydown', this.onKeyDown.bind(this) );
    container.addEventListener( 'keyup', this.onKeyUp.bind(this) );
    
    container.addEventListener('click', () => {
      this.controls.lock();
    }, false);

    container.addEventListener('keypress', (event) => {
      if (this.controls.isLocked && event.key === 'Escape') {
        this.controls.unlock();
      }
    });
}

    /**
     * 
     * @param {*} event 
     */
    onKeyDown( event ) {
        switch ( event.code ) {
          case 'ArrowUp':
          case 'KeyW':
            moveForward = true;
            break;
  
          case 'ArrowLeft':
          case 'KeyA':
            moveLeft = true;
            break;
  
          case 'ArrowDown':
          case 'KeyS':
            moveBackward = true;
            break;
  
          case 'ArrowRight':
          case 'KeyD':
            moveRight = true;
            break;
  
          case 'Space':
            event.preventDefault();
            if ( canJump === true ) {
                velocity.y += 50;
                playPlayerAnimation('jump');
            }
            canJump = false;
            break;
  
          case 'KeyC':
            toggleCrouching();
            // playPlayerAnimation('idle');
            break;
  
          case 'KeyK':
            playPlayerAnimation('kick');

            // Check if the player is close to the crate
            const playerPosition = new Vector3();
            const otherPosition = new Vector3();
            const distanceBetweenPlayerAndCrate = playerModel.getWorldPosition(playerPosition).distanceTo(crateModel.getWorldPosition(otherPosition));
            const distanceBetweenPlayerAndDoor = playerModel.getWorldPosition(playerPosition).distanceTo(doorModel.getWorldPosition(otherPosition));
            
            if(distanceBetweenPlayerAndCrate < 2) {
                playCrateAnimation('open');
                toggleInScene(scene, crateModelCylinder);
            }
            if(distanceBetweenPlayerAndDoor < 2) {
                playDoorAnimation('open');
            }
            break;
        
          case 'KeyX':
            playPlayerAnimation('attack');
            playDroneAnimation('dodge');
            break;

          case 'KeyB':
            playPlayerAnimation('block');
            break;
        
          case 'KeyF':
            playDroneAnimation('fire');
            break;
        }
    };
  
    /**
     * 
     * @param {*} event 
     */
    onKeyUp ( event ) {
        switch ( event.code ) {

            case 'ArrowUp':
            case 'KeyW':
            moveForward = false;
            break;

            case 'ArrowLeft':
            case 'KeyA':
            moveLeft = false;
            break;

            case 'ArrowDown':
            case 'KeyS':
            moveBackward = false;
            break;

            case 'ArrowRight':
            case 'KeyD':
            moveRight = false;
            break;
        }

        if ( !moveForward && !moveBackward && !moveLeft && !moveRight ) {
            playPlayerAnimation('idle');
        }
    };

    updateDirection() {
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();
        direction.applyEuler(playerModel.rotation);
    }
    
    /**
     * @param {number} delta
     */
    updateVelocity(delta) {
        if (moveForward || moveBackward) velocity.z -= direction.z * 200.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 200.0 * delta;
        if (onObject === true) {
            velocity.y = Math.max(0, velocity.y);
            canJump = true;
        }
    }
    
    /**
     * @param {number} delta
     */
    updatePlayerPosition(delta) {
        playerModel.position.x -= velocity.x * delta;
        playerModel.position.z -= velocity.z * delta;
    }
    
    updateCameraPosition() {
        const distanceBehindPlayer = 1.5;
        const cameraPosition = new Vector3();
        cameraPosition.x = playerModel.position.x - distanceBehindPlayer * Math.sin(playerModel.rotation.y);
        cameraPosition.y = playerModel.position.y;
        cameraPosition.z = playerModel.position.z - distanceBehindPlayer * Math.cos(playerModel.rotation.y);
        this.controls.getObject().position.copy(cameraPosition);
    }
    
    /**
     * @param {number} delta
     */
    updateControls(delta) {
        this.controls.moveRight(-velocity.x * delta);
        this.controls.moveForward(velocity.z * delta);
        this.controls.getObject().position.y += velocity.y * delta;
    }
}

export { Controls };