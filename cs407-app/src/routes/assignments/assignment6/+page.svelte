<script>
	/** @type {import('./$types').PageData} */
	export let data;

    import ColorPicker from 'svelte-awesome-color-picker';
	import { onMount } from 'svelte';
    import { World } from './World/world.js';

    /** @type {HTMLCanvasElement} */
    let canvas;
    let hex = "#FFFFFF";
    let hex2 = "#FF0000";
    let hex3 = "#0000FF";
    let hex4 = "#00FF00";
    let hex5 = "#fff200";
    /** @type {World|null} */
    let world = null;
    /** @type {number} */
    let ambientIntensity = 10;
    /** @type {number}*/
    let directionalIntensity1 = 100;
    /** @type {number}*/
    let directionalIntensity2 = 100;

    onMount(async () => {

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
                position: [0, 50, 0],
                view: [0, 0, 0],
                reference: null
            },
            {
                type: "DirectionalLight",
                color: hex2,
                intensity: directionalIntensity1,
                position: [-10, 5, 10],
                view: [0, 5, 0],
                reference: null
            },
            {
                type: "PointLight",
                color: hex2,
                intensity: directionalIntensity1,
                position: [-5, 1, 5],
                view: [0, 5, 0],
                reference: null
            },
            {
                type: "DirectionalLight",
                color: hex3,
                intensity: directionalIntensity2,
                position: [5, 5, -10],
                view: [0, 5, 0],
                reference: null
            },            
            {
                type: "PointLight",
                color: hex3,
                intensity: directionalIntensity2,
                position: [5, 1, -5],
                view: [0, 0, 0],
                reference: null
            },
            {
                type: "DirectionalLight",
                color: hex4,
                intensity: directionalIntensity2,
                position: [5, 5, 10],
                view: [0, 5, 0],
                reference: null
            },            
            {
                type: "PointLight",
                color: hex4,
                intensity: directionalIntensity2,
                position: [5, 1, 5],
                view: [0, 0, 0],
                reference: null
            },
            {
                type: "DirectionalLight",
                color: hex5,
                intensity: directionalIntensity2,
                position: [-5, 5, -10],
                view: [0, 5, 0],
                reference: null
            },            
            {
                type: "PointLight",
                color: hex5,
                intensity: directionalIntensity2,
                position: [-5, 1, -5],
                view: [0, 0, 0],
                reference: null
            }],
            cameraPosition: [-10, 5, 10],
            cameraView: [0, 0, 0]
        };

        // 1. Create an instance of the World app
        world = new World(worldOptions);
        await world.init();

        // 2. Render the scene
        world.start();
    });

    /**
     * Adjusts the color of the light
     * @param {number} index
     * @param {CustomEvent} event
     */
     function colorChanged(index, event) {
        world?.changeLightColor(index, event.detail.hex);
    }

    /**
     * Adjusts the intensity of the light
     * @param {number} index
     * @param {number} intensity
     */
     function intensityChanged(index, intensity) {
        world?.changeLightIntensity(index, intensity);
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

            world?.start();
		} else {
			animationState = 'Start';
			animationButton.classList.remove('btn-danger');
			animationButton.classList.add('btn-success');

            world?.stop();
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

		world?.renderMode(wireframeState);
	}

    function toggleGrid() {
        world?.renderGrid(gridState);
        
		if (gridState === 'Show') {
			gridState = 'Hide';
			gridButton.classList.remove('btn-success');
			gridButton.classList.add('btn-danger');
		} else {
			gridState = 'Show';
			gridButton.classList.remove('btn-danger');
			gridButton.classList.add('btn-success');
		}
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
            <label for="DirectionalLightPicker1">Directional Light #1</label>
            <ColorPicker bind:hex={hex2} on:input={(event) => colorChanged(1, event)} />
            <label for="directionalIntensity1" class="control-label">Light Intensity</label>
            <input type="range" min="0" max="400" bind:value={directionalIntensity1} class="slider" id="directionalIntensity1" on:input={(event) => intensityChanged(1, +event.currentTarget.value)}>
        </div>
        <div class="form-group control-section">
            <label for="DirectionalLightPicker2">Directional Light #2</label>
            <ColorPicker bind:hex={hex3} on:input={(event) => colorChanged(2, event)} />
            <label for="directionalIntensity2" class="control-label">Light Intensity</label>
            <input type="range" min="0" max="400" bind:value={directionalIntensity2} class="slider" id="directionalIntensity2" on:input={(event) => intensityChanged(2, +event.currentTarget.value)}>
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
		<p><strong>Assignment 6</strong></p>
        <p>This assignment was an exercise in using complext models, starting with importing them and following through with binding to the built-in animations on the models.</p>
        <br />
        <p>The requirements were:</p>
        <ul>
            <li>Find a GLTF model/object online</li>
            <li>Import it into your world</li>
            <li>Make use of at least one of the animations in the GLTF model/object using bindings or inputs</li>
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