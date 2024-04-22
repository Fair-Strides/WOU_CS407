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
    /** @type {World|null} */
    let world = null;
    /** @type {number} */
    let ambientIntensity = 10;
    /** @type {number}*/
    let directionalIntensity1 = 100;
    /** @type {number}*/
    let directionalIntensity2 = 100;

    onMount(() => {

        // 0. Define our options
        /**
         * @type {import('./World/world').WorldOptions}
         */
        const worldOptions = {
            container: canvas,
            startingGeometry: [{
                type: "TorusGeometry",
                dimensions: [3, 1],
                material: {
                    type: "MeshStandardMaterial",
                    color: 'green',
                    flatShading: true,
                    wireframe: false
                },
                position: [2.5, 5, 1],
                reference: null
            },
            {
                type: "SphereGeometry",
                dimensions: [3, 10],
                material: {
                    type: "MeshStandardMaterial",
                    color: 'red',
                    flatShading: true,
                    wireframe: false
                },
                position: [-2.5, 5, 1],
                reference: null
            }],
            startingLights: [{
                type: "AmbientLight",
                color: hex,
                intensity: ambientIntensity,
                position: [10, 5, 10],
                view: [0, 5, 0],
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
                type: "DirectionalLight",
                color: hex3,
                intensity: directionalIntensity2,
                position: [5, 5, -10],
                view: [0, 5, 0],
                reference: null
            }],
            cameraPosition: [10, 10, 20],
            cameraView: [0, 5, 0]
        };

        // 1. Create an instance of the World app
        world = new World(worldOptions);

        // 2. Render the scene
        world.render();
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
	</div>
	<div id="canvas-row" class="col-7">
		<div id="scene-container">
			<!-- Our <canvas> will be inserted here -->
			<canvas bind:this={canvas} id="scene-canvas"></canvas>
		</div>
	</div>
	<div id="assignment-info" class="col-2">
		<p><strong>Assignment 3</strong></p>
        <p>This assignment was all about experimenting with simple lighting. To showcase this, we needed to add at least two different kinds of lights, and some geometry with different materials to reflect the lights on to showcase them.</p>
        <p>In addition, this makes use of a standardized structure using the World App structure.</p>
        <hr />
        <p>You can adjust the scene by changing the color and intensity of each of the three lights.</p>
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