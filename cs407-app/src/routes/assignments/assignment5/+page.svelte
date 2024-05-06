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
            cameraPosition: [0, 30, 0],
            cameraView: [0, 0, 0]
        };

        // 1. Create an instance of the World app
        world = new World(worldOptions);

        // 2. Render the scene
        world.start();
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
	let wireframeState = 'Show';
	let gridState = 'Hide';
	/** @type {HTMLButtonElement} */
	let animationButton;
	/** @type {HTMLButtonElement} */
	let wireframeButton;
    /** @type {HTMLButtonElement} */
	let gridButton;

	function toggleAnimation() {
        if(!animationButton) {
            console.log("Nope.");
            return;
        }

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

    function toggleWireframe() {
		if (wireframeState === 'Show') {
			wireframeState = 'Hide';
			wireframeButton.classList.remove('btn-success');
			wireframeButton.classList.add('btn-danger');
		} else {
			wireframeState = 'Show';
			wireframeButton.classList.remove('btn-danger');
			wireframeButton.classList.add('btn-success');
		}

		world.renderMode(wireframeState);
	}

    function toggleGrid() {
		if (gridState === 'Show') {
			gridState = 'Hide';
			gridButton.classList.remove('btn-success');
			gridButton.classList.add('btn-danger');
		} else {
			gridState = 'Show';
			gridButton.classList.remove('btn-danger');
			gridButton.classList.add('btn-success');
		}

		world.renderGrid(gridState);
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
            <button id="animationButton" class="btn btn-danger" bind:this={animationButton} on:click={toggleAnimation}>
                {animationState} Animation
            </button>
        </div>
        <div class="form-group control-section">
            <label for="renderingButton" class="control-label">Wireframe</label>
            <button id="renderingButton" class="btn btn-success" bind:this={wireframeButton} on:click={toggleWireframe}>
                {wireframeState} Wireframe
            </button>
        </div>
        <div class="form-group control-section">
            <label for="gridButton" class="control-label">Grid</label>
            <button id="gridButton" class="btn btn-danger" bind:this={gridButton} on:click={toggleGrid}>
                {gridState} Grid
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
		<p><strong>Assignment 5</strong></p>
        <p>This assignment was an exercise with raw vertex positioning and composition. We had to manually construct an object of our own design and build the faces. As an added step, we also used per-vertex coloring.</p>
        <br />
        <p>The requirements were:</p>
        <ul>
            <li>Create an object using a BufferGeometry to hold the vertices and faces</li>
            <li>Define a color for each vertex</li>
            <li>Include some form of camera controls, such as OrbitControls</li>
        </ul>
        <hr />
        <p>For the axes: X (red), Y (green) and Z (blue)</p>
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