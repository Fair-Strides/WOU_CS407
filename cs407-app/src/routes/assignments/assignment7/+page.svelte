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

    let vertexShaderText = `varying vec2 uvCoords;
uniform float xValue;
uniform float yValue;
uniform float zValue;

void main() {
  uvCoords = uv;
  vec3 newPosition = vec3(xValue, yValue, zValue);
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position + newPosition, 1.0 );
}
`;
    let fragmentShaderText = `precision mediump float;
varying vec2 uvCoords;

uniform vec3 uvColor1;
uniform vec3 uvColor2;

void main() {
  float lineThickness = 0.003;
  float lineFrequency = 20.0;
  
  float remainder1 = mod(uvCoords.x, 1.0 / lineFrequency);
  float remainder2 = mod(uvCoords.y, 1.0 / lineFrequency);

  if(remainder1 < lineThickness || remainder1 > (1.0 / lineFrequency) - lineThickness) {
    gl_FragColor = vec4( uvColor1, 1.0 );
  } else if(remainder2 < lineThickness || remainder2 > (1.0 / lineFrequency) - lineThickness) {
    gl_FragColor = vec4( uvColor2, 1.0 );
  } else {  
    gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
  }
}`;

    let uvColorHex1 = "#FFFFFF";
    let uvColorHex2 = "#FFFFFF";
    let x = 0;
    let y = 0;
    let z = 0;

    onMount(async () => {

        // 0. Define our options
        /**
         * @type {import('./World/world').WorldOptions}
         */
        const worldOptions = {
            container: canvas,
            startingGeometry: [{
                type: "TorusGeometry",
                dimensions: [5, 0.5],
                material: {
                    type: "MeshStandardMaterial",
                    color: 'green',
                    flatShading: true,
                    wireframe: false
                },
                position: [0, 0, 0],
                rotation: [90, 0, 0],
                reference: null,
                name: null
            }],
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
            cameraPosition: [-10, 5, 10],
            cameraView: [0, 0, 0]
        };

        // 1. Create an instance of the World app
        world = new World(worldOptions);
        await world.init();
        world.setColor("uvColor1", uvColorHex1);
        world.setColor("uvColor2", uvColorHex2);

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

    function compileShaders() {
        world?.updateShaders(vertexShaderText, fragmentShaderText);
    }

    function uvColor() {
        world?.setColor("uvColor1", uvColorHex1);
    }

    function uvColor2() {
        world?.setColor("uvColor2", uvColorHex2);
    }

    function updateX() {
        world?.setCoordinate('x', +x);
    }

    function updateY() {
        world?.setCoordinate('y', +y);
    }

    function updateZ() {
        world?.setCoordinate('z', +z);
    }

    // function showShaderPrograms() {
    //     shaderProgramsText = world?.getFullShaderProgramsText();
    // }
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
        <p>Uniforms</p>
        <div class="form-group control-section">
            <label class="control-label">UV Color 1</label>
            <ColorPicker 
                bind:hex={uvColorHex1}
                on:input={uvColor}
                isAlpha={false}
            />
        </div>
        <div class="form-group control-section">
            <label class="control-label">UV Color 2</label>
            <ColorPicker 
                bind:hex={uvColorHex2}
                on:input={uvColor2}
                isAlpha={false}
            />
        </div>
        <div class="form-group control-section">
            <label for="xCoord" class="control-label">X Value:</label>
            <input id="xCoord" type="range" bind:value={x} on:input={updateX} min="-50" max="50" step="0.1" />
        </div>
        <div class="form-group control-section">
            <label for="yCoord" class="control-label">Y Value:</label>
            <input id="yCoord" type="range" bind:value={y} on:input={updateY} min="-50" max="50" step="0.1" />
        </div>
        <div class="form-group control-section">
            <label for="zCoord" class="control-label">Z Value:</label>
            <input id="zCoord" type="range" bind:value={z} on:input={updateZ} min="-50" max="50" step="0.1" />
        </div>
	</div>
	<div id="canvas-row" class="col-7">
        <code>{Math.round(fps)} FPS</code>
		<div id="scene-container">
			<!-- Our <canvas> will be inserted here -->
			<canvas bind:this={canvas} id="scene-canvas"></canvas>
		</div>
        <p>Vertex Shader</p>
        <article id="vertex-code-editor">
            <CodeMirror
                bind:value={vertexShaderText}
                lang={cpp()}
                theme={oneDark}
                styles={{
                "&": {
                    width: "800px",
                    maxWidth: "100%",
                    height: "10rem",
                    textAlign: "left"
                },
            }}></CodeMirror>
        </article>
        <p>Fragment Shader</p>
        <article id="fragment-code-editor">
            <CodeMirror
                bind:value={fragmentShaderText}
                lang={cpp()}
                theme={oneDark}
                styles={{
                "&": {
                    width: "800px",
                    maxWidth: "100%",
                    height: "10rem",
                    textAlign: "left"
                },
            }}></CodeMirror>
        </article>
        <section>
            <article>
                <button type="button" class="btn btn-primary" on:click={compileShaders}>Compile and Use Shaders</button>
                <!-- <button type="button" on:click={showShaderPrograms}>Show Full Shader Programs Text</button> -->
            </article>
        </section>
	</div>
	<div id="assignment-info" class="col-2">
		<p><strong>Assignment 7</strong></p>
        <p>This assignment was an exercise in doing something cool with vertex and fragment shaders</p>
        <br />
        <p>The requirements were:</p>
        <ul>            
            <li>Write your own vertex and fragment shaders to do something interesting. Feel free to find some inspiration online, but you'll need to build it into something you can claim as your own. Remember to attribute where you got the idea or code samples from, if that's what you did.</li>
            <li>Include user interaction of some kind that sends uniforms or attributes to your custom shader.</li>
            <li>Include more than one object in your scene, but only have your shaders applied to one of those objects. This will enable you to see how different "materials" (and thus shaders) are used for different objects. i.e. demonstrate that shaders can be applied per object, where at least one of those objects is rendered with your shaders.</li>
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