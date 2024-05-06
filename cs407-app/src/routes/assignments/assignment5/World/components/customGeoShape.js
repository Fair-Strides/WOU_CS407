import { Mesh, MeshPhongMaterial, BufferGeometry, BufferAttribute} from 'three';

const vertices = new Float32Array([
//X, Y, Z
  0, -2, 0,    // 0 - Top
  2, 0, 0,     // 1
  -2, 0, 0,    // 2
  0, 0, 2,     // 3
  0, 0, -2,    // 4 - Middle of the top
  4, 0, 4,     // 5
  4, 0, -4,    // 6
  -4, 0, 4,    // 7
  -4, 0, -4,   // 8
  4, -4, 4,    // 9
  4, -4, -4,   // 10
  -4, -4, 4,   // 11
  -4, -4, -4,  // 12
  0, -2, 0,    // 13 - Bottom
  2, -4, 0,    // 14
  -2, -4, 0,   // 15
  0, -4, 2,    // 16
  0, -4, -2,   // 17 - Middle of the bottom
  -4, -4, -4,  // 18
  4, -4, -4,   // 19
  -4, -4, 4,   // 20
  4, -4, 4,    // 21
]);


const indices = [
  4, 0, 1,
  1, 0, 3,
  3, 0, 2,
  2, 0, 4,
  7, 2, 8,
  4, 8, 2,
  8, 4, 6,
  6, 4, 1,
  6, 1, 5,
  1, 3, 5,
  5, 3, 7,
  7, 3, 2,
  9, 10, 6,
  6, 5, 9,
  9, 5, 11,
  11, 5, 7,
  11, 7, 12,
  12, 7, 8,
  12, 8, 10,
  10, 8, 6,
  14, 13, 17,
  16, 13, 14,
  15, 13, 16,
  17, 13, 15,

  20, 16, 21,
  21, 16, 14,
  19, 17, 18,
  18, 17, 15,
  21, 14, 19,
  19, 14, 17,
  18, 15, 20,
  20, 15, 16,
];

const verticeColors = new Float32Array([
  0.0, 0.0, 0.0, // 0
  1.0, 1.0, 1.0, // 1
  1.0, 1.0, 1.0, // 2
  1.0, 1.0, 1.0, // 3
  1.0, 1.0, 1.0, // 4
  1.0, 1.0, 0.0, // 5
  0.0, 1.0, 1.0, // 6
  0.5, 0.5, 0.5, // 7
  0.5, 0.5, 1.0, // 8
  0.5, 1.0, 0.5, // 9
  1.0, 0.5, 0.5, // 10
  1.0, 0.5, 1.0, // 11
  1.0, 1.0, 0.5, // 12
  0.5, 1.0, 1.0, // 13
  0.0, 0.0, 0.5, // 14
  0.0, 0.5, 0.0, // 15
  0.0, 0.5, 1.0, // 16
  0.5, 0.0, 0.0, // 17
  0.5, 0.0, 1.0, // 18
  0.5, 0.5, 0.0, // 19
  0.5, 1.0, 0.0, // 20
  1.0, 0.0, 0.5, // 21
  1.0, 0.5, 0.0, // 22
  1.0, 0.0, 0.0, // 23
  1.0, 1.0, 1.0, // 24
]);

function createCustomGeometry() {
  let customGeo = new BufferGeometry();
  customGeo.setIndex(indices);
  customGeo.setAttribute('position', new BufferAttribute(vertices, 3));
  customGeo.setAttribute('color', new BufferAttribute(verticeColors,3));
  let customMesh = new Mesh(customGeo, new MeshPhongMaterial({ vertexColors: true }));
  customMesh.name = "Custom";

  return customMesh;
}

export { createCustomGeometry };