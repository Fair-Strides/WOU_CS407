<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import { onMount } from 'svelte';
	import { createScene, animate, renderMode } from '$lib/scene';
	import { DodecahedronGeometry, MeshBasicMaterial } from 'three';
	let canvas;

	onMount(() => {
		console.log('Creating scene');
		createScene(canvas, {
			startingGeometry: [
				{
					type: DodecahedronGeometry,
					dimensions: [3, 10],
					material: {
						type: MeshBasicMaterial,
						color: 'green',
						flatShading: true
					},
					rotate: true,
					reference: null
				}
			],
			cameraPosition: [0, 0, 30]
		});
	});

	let animationState = 'Start';
	let wireframeState = 'Show';

	function toggleAnimation() {
		if (animationState === 'Start') {
			animationState = 'Stop';
		} else {
			animationState = 'Start';
		}

		animate(animationState !== 'Start');
	}

	function toggleWireframe() {
		if (wireframeState === 'Show') {
			wireframeState = 'Hide';
		} else {
			wireframeState = 'Show';
		}

		renderMode(wireframeState !== 'Show');
	}
</script>

<h1>{data.sections[data.currentPage].title}</h1>
<hr class="space-below" />

<div class="assignmentContent">
	<div id="buttonSection">
		<button id="animationButton" class="button" on:click={toggleAnimation}>
			{animationState} Animation
		</button>
		<br />
		<button id="renderingButton" class="button" on:click={toggleWireframe}>
			{wireframeState} Wireframe
		</button>
	</div>
	<div id="canvas-row">
		<div id="scene-container">
			<!-- Our <canvas> will be inserted here -->
			<canvas bind:this={canvas} id="scene-canvas"></canvas>
		</div>
	</div>
	<div id="assignment-info"></div>
</div>
<hr class="space-above" />

<style>
	#buttonSection {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.button {
		margin: 10px;
	}

	#canvas-row {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	#assignment-info {
		display: flex;
		flex-direction: column;
	}

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
