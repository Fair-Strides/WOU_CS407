<script>
	/** @type {import('./$types').PageData} */
	export let data;

    import ColorPicker from 'svelte-awesome-color-picker';
	import { onMount } from 'svelte';
    import { World } from '$lib/World/world.js';
	import { MeshStandardMaterial, SphereGeometry, TorusGeometry } from 'three';

    /** @type {HTMLCanvasElement} */
    let canvas;
    let hex = "#FFFFFF"
    /** @type {World|null} */
    let world = null;
    onMount(() => {
        // 1. Create an instance of the World app
        world = new World(canvas, [
        {
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
        }]);

        // 2. Render the scene
        world.render();
    });

    /**
     * Toggles the animation state of the world
     * @param {CustomEvent} event
     */
    function colorChanged(event) {
        world?.changeLightColor(event.detail.hex);
    }

</script>

<h1>{data.sections[data.currentPage].title}</h1>
<hr class="space-below" />

<div class="assignmentContent row">
	<div id="buttonSection" class="col-2 mx-2">
        <ColorPicker bind:hex on:input={colorChanged} />
		<!-- <button id="animationButton" class="btn btn-success" bind:this={animationButton} on:click={toggleAnimation}>
			{animationState} Animation
		</button>
		<br />
		<button id="renderingButton" class="btn btn-success" bind:this={wireframeButton} on:click={toggleWireframe}>
			{wireframeState} Wireframe
		</button> -->
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