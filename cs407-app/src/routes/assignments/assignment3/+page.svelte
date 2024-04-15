<script>
	/** @type {import('./$types').PageData} */
	export let data;

    import ColorPicker from 'svelte-awesome-color-picker';
	import { onMount } from 'svelte';
    import { World } from '$lib/World/world.js';

    /** @type {HTMLCanvasElement} */
    let canvas;
    let hex = "#FFFFFF"
    let hex2 = "#FFFFFF"
    /** @type {World|null} */
    let world = null;
    onMount(() => {

        // 0. Define our options
        /**
         * @type {import('$lib/World/world').WorldOptions}
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
                color: 'white',
                intensity: 10,
                position: [10, 5, 10],
                view: [0, 5, 0],
                reference: null
            },
            {
                type: "DirectionalLight",
                color: 'red',
                intensity: 20,
                position: [10, 5, 10],
                view: [0, 5, 0],
                reference: null
            }],
            cameraPosition: [10, 5, 20],
            cameraView: [0, 5, 0]
        };

        // 1. Create an instance of the World app
        world = new World(worldOptions);

        // 2. Render the scene
        world.render();
    });

    /**
     * Toggles the animation state of the world
     * @param {number} index
     * @param {CustomEvent} event
     */
    function colorChanged(index, event) {
        world?.changeLightColor(index, event.detail.hex);
    }

</script>

<h1>{data.sections[data.currentPage].title}</h1>
<hr class="space-below" />

<div class="assignmentContent row">
	<div id="buttonSection" class="col-2 mx-2">
        <h2>Controls</h2>
        <div class="form-group">
            <label for="AmbientLightPicker">Ambient Light</label>
            <ColorPicker bind:hex={hex} on:input={(event) => colorChanged(0, event)} />
        </div>
        <div class="form-group">
            <label for="DirectionalLightPicker">Directional Light</label>
            <ColorPicker bind:hex={hex2} on:input={(event) => colorChanged(1, event)} />
        </div>
	</div>
	<div id="canvas-row" class="col-8">
		<div id="scene-container">
			<!-- Our <canvas> will be inserted here -->
			<canvas bind:this={canvas} id="scene-canvas"></canvas>
		</div>
	</div>
	<div id="assignment-info" class="col-2">
		<p>
			<strong>Assignment 3</strong>
		</p>
	</div>
</div>
<hr class="space-above" />

<style>
	#scene-canvas {
		/* tell our scene container to take up the full page */
		min-height: 500px;

		/*
			Set the container's background color to the same as the scene's
			background to prevent flashing on load
		*/
		background-color: skyblue;
	}
</style>