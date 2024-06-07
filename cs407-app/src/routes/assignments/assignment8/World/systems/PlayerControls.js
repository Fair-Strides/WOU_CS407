import * as THREE from 'three';

class PlayerControls {
    // internals

    // this.scope = this;

    static STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2 };
    
    /**
     * 
     * @param {THREE.PerspectiveCamera} camera
     * @param {THREE.Object3D} player
     * @param {HTMLElement} domElement
     */
    constructor( camera, player, domElement ) {
	    this.camera = camera;
        this.player = player;
        this.domElement = ( domElement !== undefined ) ? domElement : document;

        // API
        this.enabled = true;

        this.center = new THREE.Vector3( player.position.x, player.position.y, player.position.z );

        this.moveSpeed = 0.2;
        this.turnSpeed = 0.1;

        this.userZoom = true;
        this.userZoomSpeed = 1.0;

        this.userRotate = true;
        this.userRotateSpeed = 1.5;

        this.autoRotate = false;
        this.autoRotateSpeed = 0.1;
        this.YAutoRotation = false;

        this.minPolarAngle = 0;
        this.maxPolarAngle = Math.PI;

        this.lastPosition = new THREE.Vector3( player.position.x, player.position.y, player.position.z );
        this.playerIsMoving = false;

        this.minDistance = 0;
        this.maxDistance = Infinity;

        this.EPS = 0.000001;
        this.PIXELS_PER_ROUND = 1800;
    
        this.rotateStart = new THREE.Vector2();
        this.rotateEnd = new THREE.Vector2();
        this.rotateDelta = new THREE.Vector2();
    
        this.zoomStart = new THREE.Vector2();
        this.zoomEnd = new THREE.Vector2();
        this.zoomDelta = new THREE.Vector2();
    
        this.phiDelta = 0;
        this.thetaDelta = 0;
        this.scale = 1;

        /** @type {Record<number, boolean>} */
        this.keyState = {};
        this.currentState = PlayerControls.STATE.NONE;

        // events

        this.changeEvent = { type: 'change' };

        this.domElement.addEventListener('contextmenu', function( event ) { event.preventDefault(); }, false );
        this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false );
        this.domElement.addEventListener('mousewheel', this.onMouseWheel.bind(this), false );
        this.domElement.addEventListener('DOMMouseScroll', this.onMouseWheel.bind(this), false ); // firefox
        this.domElement.addEventListener('keydown', this.onKeyDown.bind(this), false );
        this.domElement.addEventListener('keyup', this.onKeyUp.bind(this), false );
    }

    /**
     * 
     * @param {number} angle 
     */
    rotateLeft( angle ) {

        if ( angle === undefined ) {

            angle = this.getAutoRotationAngle();

        }

        this.thetaDelta -= angle;

    };

    /**
     * 
     * @param {number} angle 
     */
    rotateRight ( angle ) {

        if ( angle === undefined ) {
            angle = this.getAutoRotationAngle();

        }

        this.thetaDelta += angle;

    };

    /**
     * 
     * @param {number} angle 
     */
    rotateUp ( angle ) {

        if ( angle === undefined ) {

            angle = this.getAutoRotationAngle();

        }

        this.phiDelta -= angle;

    };

    /**
     * 
     * @param {number} angle 
     */
    rotateDown( angle ) {

        if ( angle === undefined ) {

            angle = this.getAutoRotationAngle();

        }

        this.phiDelta += angle;

    };

    /**
     * 
     * @param {number} zoomScale 
     */
    zoomIn ( zoomScale ) {

        if ( zoomScale === undefined ) {

            zoomScale = this.getZoomScale();

        }

        this.scale /= zoomScale;

    };

    /**
     * 
     * @param {number} zoomScale 
     */
    zoomOut ( zoomScale ) {

        if ( zoomScale === undefined ) {

            zoomScale = this.getZoomScale();

        }

        this.scale *= zoomScale;

    };

    init() {

        this.camera.position.x = this.player.position.x + 2;
        this.camera.position.y = this.player.position.y + 2;
        this.camera.position.z = this.player.position.x + 2;

        this.camera.lookAt( this.player.position );
        
    };

    checkKeyStates() {
        if (this.keyState[38] || this.keyState[87]) {

            // up arrow or 'w' - move forward

            this.player.position.x -= this.moveSpeed * Math.sin( this.player.rotation.y );
            this.player.position.z -= this.moveSpeed * Math.cos( this.player.rotation.y );

            this.camera.position.x -= this.moveSpeed * Math.sin( this.player.rotation.y );
            this.camera.position.z -= this.moveSpeed * Math.cos( this.player.rotation.y );

        }

        if (this.keyState[40] || this.keyState[83]) {

            // down arrow or 's' - move backward
            this.playerIsMoving = true;

            this.player.position.x += this.moveSpeed * Math.sin( this.player.rotation.y );
            this.player.position.z += this.moveSpeed * Math.cos( this.player.rotation.y );

            this.camera.position.x += this.moveSpeed * Math.sin( this.player.rotation.y );
            this.camera.position.z += this.moveSpeed * Math.cos( this.player.rotation.y );

        }

        if (this.keyState[37] || this.keyState[65]) {

            // left arrow or 'a' - rotate left
            this.playerIsMoving = true;

            this.player.rotation.z += this.turnSpeed;

        }

        if (this.keyState[39] || this.keyState[68]) {

            // right arrow or 'd' - rotate right
            this.playerIsMoving = true;

            this.player.rotation.z -= this.turnSpeed;

        }
        if ( this.keyState[81] ) {

            // 'q' - strafe left
            this.playerIsMoving = true;

            this.player.position.x -= this.moveSpeed * Math.cos( this.player.rotation.y );
            this.player.position.z += this.moveSpeed * Math.sin( this.player.rotation.y );

            this.camera.position.x -= this.moveSpeed * Math.cos( this.player.rotation.y );
            this.camera.position.z += this.moveSpeed * Math.sin( this.player.rotation.y );

        }

        if ( this.keyState[69] ) {

            // 'e' - strage right
            this.playerIsMoving = true;

            this.player.position.x += this.moveSpeed * Math.cos( this.player.rotation.y );
            this.player.position.z -= this.moveSpeed * Math.sin( this.player.rotation.y );

            this.camera.position.x += this.moveSpeed * Math.cos( this.player.rotation.y );
            this.camera.position.z -= this.moveSpeed * Math.sin( this.player.rotation.y );

        }
    };

    getAutoRotationAngle() { 

        return 2 * Math.PI / 60 / 60 * this.autoRotateSpeed;

    }

    getZoomScale() {

        return Math.pow( 0.95, this.userZoomSpeed );

    }

    /**
     * 
     * @param {*} event
     * @returns 
     */
    onMouseDown( event ) {
        if ( this.enabled === false ) return;
        if ( this.userRotate === false ) return;

        event.preventDefault();

        if ( event.button === 0 ) {

            this.currentState = PlayerControls.STATE.ROTATE;

            this.rotateStart.set( event.clientX, event.clientY );

        } else if ( event.button === 1 ) {

            this.currentState = PlayerControls.STATE.ZOOM;

            this.zoomStart.set( event.clientX, event.clientY );

        }

        document.addEventListener( 'mousemove', this.onMouseMove.bind(this), false );
        document.addEventListener( 'mouseup', this.onMouseUp.bind(this), false );

    }

    /**
     * 
     * @param {MouseEvent} event 
     * @returns 
     */
    onMouseMove( event ) {

        if ( this.enabled === false ) return;

        event.preventDefault();

        if ( this.currentState === PlayerControls.STATE.ROTATE ) {

            this.rotateEnd.set( event.clientX, event.clientY );
            this.rotateDelta.subVectors( this.rotateEnd, this.rotateStart );

            this.rotateLeft( 2 * Math.PI * this.rotateDelta.x / this.PIXELS_PER_ROUND * this.userRotateSpeed );
            this.rotateUp( 2 * Math.PI * this.rotateDelta.y / this.PIXELS_PER_ROUND * this.userRotateSpeed );

            this.rotateStart.copy( this.rotateEnd );

        } else if ( this.currentState === PlayerControls.STATE.ZOOM ) {

            this.zoomEnd.set( event.clientX, event.clientY );
            this.zoomDelta.subVectors( this.zoomEnd, this.zoomStart );

            if ( this.zoomDelta.y > 0 ) {

                this.zoomIn();

            } else {

                this.zoomOut();

            }

            this.zoomStart.copy( this.zoomEnd );
        }

    }

    /**
     * @param {MouseEvent} event
     * @returns
     */
    onMouseUp( event ) {

        if ( this.enabled === false ) return;
        if ( this.userRotate === false ) return;

        document.removeEventListener('mousemove', this.onMouseMove, false );
        document.removeEventListener( 'mouseup', this.onMouseUp, false );

        this.currentState = PlayerControls.STATE.NONE;

    }

    /**
     * @param {*} event
     * @returns
     */
    onMouseWheel( event ) {

        if ( this.enabled === false ) return;
        if ( this.userRotate === false ) return;

        var delta = 0;

        if ( event.wheelDelta ) { //WebKit / Opera / Explorer 9

            delta = event.wheelDelta;

        } else if ( event.detail ) { // Firefox

            delta = - event.detail;

        }

        if ( delta > 0 ) {

            this.zoomOut();

        } else {

            this.zoomIn();

        }

    }

    /**
     * 
     * @param {*} event 
     */
    onKeyDown( event ) {
        event = event || window.event;

        this.keyState[event.keyCode || event.which] = true;

    }

    /**
     * @param {*} event
     * @returns
     */
    onKeyUp( event ) {

        event = event || window.event;

        this.keyState[event.keyCode || event.which] = false;

    }

    update() {
        this.checkKeyStates();

        this.center = this.player.position;

        var position = this.camera.position;
        var offset = position.clone().sub( this.center );

        // angle from z-axis around y-axis

        var theta = Math.atan2( offset.x, offset.z );

        // angle from y-axis

        var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );

        theta += this.thetaDelta;
        phi += this.phiDelta;

        // restrict phi to be between desired limits
        phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, phi ) );

        // restrict phi to be between EPS and PI-EPS
        phi = Math.max( this.EPS, Math.min( Math.PI - this.EPS, phi ) );

        var radius = offset.length() * this.scale;

        radius = Math.max( this.minDistance, Math.min( this.maxDistance, radius ) );

        offset.x = radius * Math.sin( phi ) * Math.sin( theta );
        offset.y = radius * Math.cos( phi );
        offset.z = radius * Math.sin( phi ) * Math.cos( theta );

        if ( this.autoRotate ) {

            this.camera.position.x += this.autoRotateSpeed * ( ( this.player.position.x + 8 * Math.sin( this.player.rotation.y ) ) - this.camera.position.x );
            this.camera.position.y += this.autoRotateSpeed * ( ( this.player.position.y + 8 * Math.cos( this.player.rotation.z ) ) - this.camera.position.y );

        } else {

            position.copy( this.center ).add( offset );

        }

        this.camera.lookAt( this.center );

        this.thetaDelta = 0;
        this.phiDelta = 0;
        this.scale = 1;



        if ( this.currentState === PlayerControls.STATE.NONE && this.playerIsMoving ) {

            this.autoRotate = true;

        } else {

            this.autoRotate = false;

        }

        if ( this.lastPosition.distanceTo( this.player.position) > 0 ) {


            this.lastPosition.copy( this.player.position );

        } else if ( this.lastPosition.distanceTo( this.player.position) == 0 ) {

            this.playerIsMoving = false;

        }

    };
};

// THREE.PlayerControls.prototype = Object.create( THREE.EventDispatcher.prototype );

export { PlayerControls };