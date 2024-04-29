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
            if(event.key === "ArrowUp" ||
                event.key === "ArrowDown" ||
                event.key === "ArrowLeft" ||
                event.key === "ArrowRight" ||
                event.key === "w" ||
                event.key === "s" ||
                event.key === "a" ||
                event.key === "d" ||
                event.key === "space" ||
                (event.key === "w" && event.altKey) ||
                (event.key === "s" && event.altKey)
            )   {
                    event.preventDefault();
                }
            
            console.log(event.key, event.altKey);
            switch (event.key) {
                case "ArrowUp":
                    world.rotateCamera('up');
                    break;
                case "ArrowDown":
                    world.rotateCamera('down');
                    break;
                case "ArrowLeft":
                    world.rotateCamera('left');
                    break;
                case "ArrowRight":
                    world.rotateCamera('right');
                    break;
                case "w":
                    if(event.altKey) world.moveCamera('forward');
                    else world.rotateSun('up');
                    break;
                case "s":
                    if(event.altKey) world.moveCamera('backward');
                    else world.rotateSun('down');
                    break;
                case "a":
                    world.rotateSun('left');
                    break;
                case "d":
                    world.rotateSun('right');
                    break;
                case " ":
                    toggleAnimation();
                    break;
            }
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
	</div>
	<div id="canvas-row" class="col-7">
		<div id="scene-container">
			<!-- Our <canvas> will be inserted here -->
			<canvas bind:this={canvas} id="scene-canvas"></canvas>
		</div>
	</div>
	<div id="assignment-info" class="col-2">
		<p><strong>Assignment 4</strong></p>
        <p>This assignment was a first with Vector Math, manual rotations, and moving objects around. The goal was to create a scene with a hiearchical structure of objects.</p>
        <br />
        <p>The requirements were:</p>
        <ul>
            <li>Create a compound model witha  primary object and several child objects</li>
            <li>Place the child objects relative to the primary object using vector and matrix math</li>
            <li>Have interactivity that moves the model, and also the child objects.</li>
        </ul>
        <hr />
        <p><strong>Controls</strong></p>
        <p>WASD will rotate the Sun (the primary object) if the Canvas has focus; click on it if you don't see any change in activity. Arrow Keys allow you to look around with the camera, as well as move it forward and backward with Alt+W and Alt+S, respectively. Lastly, the spacebar will toggle the animation state of the model.</p>
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