<script>
	/** @type {import('./$types').PageData} */
	export let data;

    import ColorPicker from 'svelte-awesome-color-picker';
	import { onMount } from 'svelte';
    import { World } from './World/world.js';

    /** @type {HTMLCanvasElement} */
    let canvas;
    let hex = "#FF8C8C";
    /** @type {World} */
    let world;
    /** @type {number} */
    let ambientIntensity = 2;

    onMount(() => {

        // 0. Define our options
        /**
         * @type {import('./World/world').WorldOptions}
         */
        const worldOptions = {
            container: canvas,
            startingGeometry: [],
            startingLights: [{
                type: "AmbientLight",
                color: hex,
                intensity: ambientIntensity,
                position: [0, 100, 0],
                view: [0, 0, 0],
                reference: null
            }],
            cameraPosition: [0, 65.2, 86.69],
            cameraView: [0, 0, 0]
        };

        // 1. Create an instance of the World app
        world = new World(worldOptions);

        // 2. Render the scene
        world.start();
    
        // 3. Add event listeners
        window.addEventListener('keydown', (event) => {
            if(event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "w" || event.key === "s" || event.key === "a" || event.key === "d" || event.key === "space" || (event.key === "w" && event.altKey) || (event.key === "s" && event.altKey)) event.preventDefault();
            if(event.key === "ArrowUp") rotateCamera('up');
            if(event.key === "ArrowDown") rotateCamera('down');
            if(event.key === "ArrowLeft") rotateCamera('left');
            if(event.key === "ArrowRight") rotateCamera('right');
            if(event.key === "w") moveCamera('up');
            if(event.key === "s") moveCamera('down');
            if(event.key === "a") moveCamera('left');
            if(event.key === "d") moveCamera('right');
            if(event.key === " ") toggleAnimation();

            if(event.key === "w" && event.altKey) moveCamera('forward');
            if(event.key === "s" && event.altKey) moveCamera('backward');
        });
    });

    /**
     * Adjusts the color of the light
     * @param {number} index
     * @param {CustomEvent} event
     */
     function colorChanged(index, event) {
        world.changeLightColor(index, event.detail.hex);
    }

    /**
     * Adjusts the intensity of the light
     * @param {number} index
     * @param {number} intensity
     */
     function intensityChanged(index, intensity) {
        world.changeLightIntensity(index, intensity);
    }

    let animationState = 'Stop';
	/** @type {HTMLButtonElement} */
	let animationButton;

	function toggleAnimation() {
		if (animationState === 'Start') {
			animationState = 'Stop';
			animationButton.classList.remove('btn-success');
			animationButton.classList.add('btn-danger');

            world.start();
		} else {
			animationState = 'Start';
			animationButton.classList.remove('btn-danger');
			animationButton.classList.add('btn-success');

            world.stop();
		}
	}

    /**
     * Rotates the camera
     * @param {string} direction
     */
    function rotateCamera(direction) {
        world.rotateCamera(direction);
    }

    /**
     * Moves the camera
     * @param {string} direction
     */
    function moveCamera(direction) {
        world.moveCamera(direction);
    }

</script>

<h1>{data.sections[data.currentPage].title}</h1>
<hr class="space-below" />

<div class="assignmentContent row">
	<div id="buttonSection" class="col-2 mx-2">
        <h2><strong>Controls</strong></h2>
        <div class="form-group control-section">
            <label for="AmbientLightPicker">Ambient Light</label>
            <ColorPicker bind:hex={hex} on:input={(event) => colorChanged(0, event)} />
            <label for="ambientIntensity" class="control-label">Light Intensity</label>
            <input type="range" min="0" max="25" bind:value={ambientIntensity} class="slider" id="ambientIntensity" on:input={(event) => intensityChanged(0, +event.currentTarget.value)}>
        </div>
        <div class="form-group control-section">
            <button id="animationButton" class="btn btn-success" bind:this={animationButton} on:click={toggleAnimation}>
                {animationState} Animation
            </button>
        </div>
	</div>
	<div id="canvas-row" class="col-7">
		<div id="scene-container">
			<!-- Our <canvas> will be inserted here -->
			<canvas bind:this={canvas} id="scene-canvas"></canvas>
		</div>
	</div>
	<div id="assignment-info" class="col-2">
		<p><strong>Assignment 4</strong></p>
        
	</div>
</div>
<hr class="space-above" />

<style>
	#scene-canvas {
		/* tell our scene container to take up the full page */
		min-height: 500px;
        width: 100%;

        /* width: 66.66666667%; */

		/*
			Set the container's background color to the same as the scene's
			background to prevent flashing on load
		*/
		background-color: skyblue;
	}

    .control-label {
        display: flex;
        justify-content: center;
    }

    #assignment-info {
        font-size:smaller;
    }

    .control-section {
        border-color: black;
    }

    .control-section label:nth-of-type(1)
    {
        font-weight: bold;
    }
</style>