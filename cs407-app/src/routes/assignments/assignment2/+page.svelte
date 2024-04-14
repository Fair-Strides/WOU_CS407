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
	let animationButton;
	let wireframeButton;

	function toggleAnimation() {
		if (animationState === 'Start') {
			animationState = 'Stop';
			animationButton.classList.remove('btn-success');
			animationButton.classList.add('btn-danger');
		} else {
			animationState = 'Start';
			animationButton.classList.remove('btn-danger');
			animationButton.classList.add('btn-success');
		}

		animate(animationState !== 'Start');
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

		renderMode(wireframeState !== 'Show');
	}
</script>

<h1>{data.sections[data.currentPage].title}</h1>
<hr class="space-below" />

<div class="assignmentContent row">
	<div id="buttonSection" class="col-2 mx-2">
		<button id="animationButton" class="btn btn-success" bind:this={animationButton} on:click={toggleAnimation}>
			{animationState} Animation
		</button>
		<br />
		<button id="renderingButton" class="btn btn-success" bind:this={wireframeButton} on:click={toggleWireframe}>
			{wireframeState} Wireframe
		</button>
	</div>
	<div id="canvas-row" class="col-8">
		<div id="scene-container">
			<!-- Our <canvas> will be inserted here -->
			<canvas bind:this={canvas} id="scene-canvas"></canvas>
		</div>
	</div>
	<div id="assignment-info" class="col-2">
		<p>
			<strong>Assignment 2</strong>
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
