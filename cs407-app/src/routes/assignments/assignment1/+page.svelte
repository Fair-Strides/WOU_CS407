<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import { onMount } from 'svelte';
	import { createScene } from '$lib/scene';
	import { BoxGeometry, MeshBasicMaterial } from 'three';
	let canvas;

	onMount(() => {
		console.log('Creating scene');
		createScene(canvas, {
			startingGeometry: [
				{
					type: BoxGeometry,
					dimensions: [2, 2, 2],
					material: {
						type: MeshBasicMaterial,
						color: 'green',
						flatShading: false
					},
					rotate: true,
					reference: null
				}
			]
		});
	});
</script>

<h1>{data.sections[data.currentPage].title}</h1>

<h1>Hello World <span style="text-decoration: line-through;">Cube</span></h1>

<hr class="space-below" />

<div id="canvas-row">
	<div id="scene-container">
		<!-- Our <canvas> will be inserted here -->
		<canvas bind:this={canvas} id="scene-canvas"></canvas>
	</div>
</div>

<hr class="space-above" />
<p>
	This was the first assignment in the course of progressively improving skills with JavaScript and
	Modelling in the browser.
</p>

<style>
	#scene-canvas {
		/* tell our scene container to take up the full page */
		width: 75%;
		height: 75%;
		margin-left: 12.5%;
		min-height: 500px;

		/*
			Set the container's background color to the same as the scene's
			background to prevent flashing on load
		*/
		background-color: skyblue;
	}
</style>
