import { CylinderGeometry, ShaderMaterial, Mesh, Vector3, Scene } from 'three';

/**
 * 
 * @param {number} radius
 * @param {number} height
 * @param {number} segments
 * @param {[number, number, number]} position
 * @returns  Mesh
 */
function createCylinder(radius, height, segments, position) {
    const cylinderGeo = new CylinderGeometry(
        radius,
        radius,
        height,
        segments
    );

    const cylinderMaterial = new ShaderMaterial({
        uniforms: {
            uvColor: { value: new Vector3(0.0, 1.0, 0.031) },
            xValue: { value: 0.0 },
            yValue: { value: 0.0 },
            zValue: { value: 0.0 },
            time: { value: 0.0 },
            transparent: { value: 1 }
        }
    });

    const cylinder = new Mesh(cylinderGeo, cylinderMaterial);

    cylinder.position.set(...position);

    /**
     * @param {number} delta 
     */
    cylinder.tick = function (delta)
    {
        // Send time to shader in a uniform
        this.material.uniforms.time.value += delta;
        this.material.uniformsNeedUpdate = true;
    }

    return cylinder;
}

/**
 * @param {Mesh} mesh
 * @param {string} vertexShader
 */
function setVertexShader(mesh, vertexShader) {
    /** @type {ShaderMaterial} mat */
    const mat = mesh.material;

    mat.vertexShader = vertexShader;
    mat.needsUpdate = true;
}

/**
 * @param {Mesh} mesh
 * @param {string} fragmentShader
 */
function setFragmentShader(mesh, fragmentShader) { 
    /** @type {ShaderMaterial} mat */
    const mat = mesh.material;

    mat.fragmentShader = fragmentShader;
    mat.needsUpdate = true;
}

/**
 * @param {Mesh} mesh
 * @param {string} name
 * @param {*} value
 */
function updateUniform(mesh, name, value) {
    /** @type {ShaderMaterial} mat */
    const mat = mesh.material;

    mat.uniforms[name].value = value;
}

/**
 * @param {Scene} scene
 * @param {Mesh} object
 */
function toggleInScene(scene, object) {
    if (scene.children.includes(object)) {
        scene.remove(object);
    } else {
        scene.add(object);
    }
}

export { createCylinder, setVertexShader, setFragmentShader, updateUniform, toggleInScene };
