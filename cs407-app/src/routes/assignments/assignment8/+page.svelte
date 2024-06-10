<script>
    import { cpp } from '@codemirror/lang-cpp';
    import { oneDark } from '@codemirror/theme-one-dark';
    import CodeMirror from 'svelte-codemirror-editor';
    import ColorPicker from 'svelte-awesome-color-picker';
	import { onMount } from 'svelte';
    import { World } from './World/world.js';

    /** @type {import('./$types').PageData} */
	export let data;

    /** @type {HTMLCanvasElement} */
    let canvas;
    let hex = "#FFFFFF";
    let hex2 = "#FF0000";

    /** @type {number} */
    let fps = 0;

    /** @type {World|null} */
    let world = null;
    /** @type {number} */
    let ambientIntensity = 10;
    /** @type {number}*/
    let directionalIntensity = 100;

    let animationState = 'Stop';
	let wireframeState = 'Show';
	let gridState = 'Hide';
	/** @type {HTMLButtonElement} */
	let animationButton;
	/** @type {HTMLButtonElement} */
	let wireframeButton;
    /** @type {HTMLButtonElement} */
	let gridButton;

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
                intensity: directionalIntensity,
                position: [0, -5, 0],
                view: [0, 5, 0],
                reference: null
            }],
            cameraPosition: [0, 2, -0.5],
            cameraView: [0, 1.8, 0]
        };

        // 1. Create an instance of the World app
        world = new World(worldOptions);
        await world.init();

        // 2. Render the scene
        world.start();

        setInterval(() => {
            fps = world?.getFrameRate() || 0;
        }, 2000);

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
    <div id="canvas-row" class="col-12">
        <code>{Math.round(fps)} FPS</code>
		<div id="scene-container">
			<!-- Our <canvas> will be inserted here -->
			<canvas bind:this={canvas} id="scene-canvas" tabindex="0"></canvas>
		</div>
	</div>
	<div id="buttonSection" class="col-3 mx-2">
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
            <input type="range" min="0" max="400" bind:value={directionalIntensity} class="slider" id="directionalIntensity1" on:input={(event) => intensityChanged(1, +event.currentTarget.value)}>
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
	<div id="assignment-info" class="col-5 offset-2">
		<p><strong>Final Project</strong></p>
        <p>This assignment was an exercise in synthesizing what we've learned into one last project.</p>
        <br />
        <p>Controls:</p>
        <ul>
            <li>Click into the canvas to begin using it. Moving the mouse will make the camera look around.</li>
            <li>Escape will exit the canvas focus, allowing you to interact with the rest of the page.</li>
            <li>WASD will move the character.</li>
            <li>Spacebar will make the character jump.</li>
            <li>K will make the character kick. This can interact with objects in the scene.</li>
            <li>F will make the drone in Room 2 fire.</li>
            <li>X will make the character attack, and the drone dodge randomly.</li>
            <li>C will toggle the character crouching.</li>
            <li>B will make the character block.</li>
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
		/* background-color: skyblue; */
        background-color:transparent;
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