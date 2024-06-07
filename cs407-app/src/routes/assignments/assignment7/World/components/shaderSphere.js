import { SphereGeometry, ShaderMaterial, Mesh, Vector3 } from 'three';

/**
 * 
 * @param {number} radius
 * @param {number} widthSegments
 * @param {number} heightSegments
 * @param {[number, number, number]} position
 * @returns  Mesh
 */
function createSphere(radius, widthSegments, heightSegments, position) {
    const sphereGeo = new SphereGeometry(
        radius,
        widthSegments,
        heightSegments
    );

    const sphereMaterial = new ShaderMaterial({
        uniforms: {
            uvColor1: { value: new Vector3(1.0, 0.0, 0.0) },
            uvColor2: { value: new Vector3(1.0, 0.0, 0.0) },
            xValue: { value: 0.0 },
            yValue: { value: 0.0 },
            zValue: { value: 0.0 },
            time: { value: 0.0 }
        }
    });

    const sphere = new Mesh(sphereGeo, sphereMaterial);

    sphere.position.set(...position);

    /**
     * @param {number} delta 
     */
    sphere.tick = function (delta)
    {
        // Send time to shader in a uniform
        this.material.uniforms.time.value += delta;
        this.material.uniformsNeedUpdate = true;
    }

    return sphere;
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

export { createSphere, setVertexShader, setFragmentShader, updateUniform };
