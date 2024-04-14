import { BoxGeometry, ConeGeometry, RingGeometry, TubeGeometry, EdgesGeometry, LatheGeometry, PlaneGeometry,
  ShapeGeometry, TorusGeometry, CircleGeometry, SphereGeometry, CapsuleGeometry, ExtrudeGeometry, CylinderGeometry,
  TorusKnotGeometry, WireframeGeometry, OctahedronGeometry, PolyhedronGeometry, IcosahedronGeometry, TetrahedronGeometry,
  DodecahedronGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial, MeshDepthMaterial, MeshDistanceMaterial, MeshLambertMaterial,
  MeshMatcapMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshToonMaterial } from 'three';

function createGeometry(geoData) {
  // Create a geometry
  // Then add a material to apply to it
  const geometryInstance = new geoData.type(...geoData.dimensions);
  const material = new geoData.material.type({
    color: geoData.material.color,
    wireframe: geoData.wireframe,
    flatShading: geoData.material.flatShading
  });

  // And now put the pieces together
  geoData.reference = new Mesh(geometryInstance, material);
  return geoData.reference;
}

export { createGeometry };
