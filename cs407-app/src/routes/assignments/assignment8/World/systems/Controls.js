import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { PerspectiveCamera, Raycaster, Vector3 } from 'three';
import { playPlayerAnimation, toggleCrouching } from '../components/gltf_Woman';

/** @type {import('three').Mesh} */
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
/** @type {import('three').Mesh} */
let playerModel;

class Controls {
    /**
     * @param {PerspectiveCamera} camera
     * @param {HTMLElement} container
     * @param {import('three').Mesh} floor
     * @param {import('three').Mesh} playerMesh
     */
    constructor(camera, container, floor, playerMesh) {
    floorMesh = floor;
    playerModel = playerModel;
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
        this.updatePlayerPosition(delta);
        this.updateCameraPosition();
        this.updatePlayerRotation();
        // this.updateControls(delta);

        if ( this.controls.getObject().position.y < 2.5 ) {
          velocity.y = 0;
          this.controls.getObject().position.y = 1.5;

          canJump = true;
        }

        rotation.set(this.controls.getObject().rotation.x, this.controls.getObject().rotation.y, this.controls.getObject().rotation.z);
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
            break;
  
          case 'KeyK':
            playPlayerAnimation('kick');
            break;
        
          case 'KeyB':
            playPlayerAnimation('block');
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
        if (moveForward || moveBackward) velocity.z -= direction.z * 40.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 40.0 * delta;
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
    
    updatePlayerRotation() {
        playerModel.rotation.x = -Math.PI / 2 - (this.controls.getObject().rotation.x - rotation.x);
        playerModel.rotation.z = 0.0 - ((-this.controls.getObject().rotation.z - rotation.z));
    }
    
    /**
     * @param {number} delta
     */
    updateControls(delta) {
        this.controls.moveRight(-velocity.x * delta);
        this.controls.moveForward(-velocity.z * delta);
        this.controls.getObject().position.y += velocity.y * delta;
    }
}

export { Controls };