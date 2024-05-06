import { BoxGeometry, ConeGeometry, RingGeometry, TubeGeometry, EdgesGeometry, LatheGeometry, PlaneGeometry,
  ShapeGeometry, TorusGeometry, CircleGeometry, SphereGeometry, CapsuleGeometry, ExtrudeGeometry, CylinderGeometry,
  TorusKnotGeometry, WireframeGeometry, OctahedronGeometry, PolyhedronGeometry, IcosahedronGeometry, TetrahedronGeometry,
  DodecahedronGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial, MeshDepthMaterial, MeshDistanceMaterial, MeshLambertMaterial,
  MeshMatcapMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshToonMaterial} from 'three';


// /**
//  * @typedef {MeshBasicMaterial|MeshStandardMaterial|MeshDepthMaterial|MeshDistanceMaterial|MeshLambertMaterial|MeshMatcapMaterial|MeshNormalMaterial|MeshPhongMaterial|MeshPhysicalMaterial|MeshToonMaterial} MaterialType
//  */

/**
 * @typedef {Object} MaterialInfo
 * @property {string} type
 * @property {string} color
 * @property {boolean} wireframe
 * @property {boolean} flatShading
 */

// /**
//  * @typedef {BoxGeometry|ConeGeometry|RingGeometry|TubeGeometry|EdgesGeometry|LatheGeometry|PlaneGeometry|ShapeGeometry|TorusGeometry|CircleGeometry|SphereGeometry|CapsuleGeometry|ExtrudeGeometry|CylinderGeometry|TorusKnotGeometry|WireframeGeometry|OctahedronGeometry|PolyhedronGeometry|IcosahedronGeometry|TetrahedronGeometry|DodecahedronGeometry} GeometryType
//  */

/**
 * @typedef {Object} GeometryInfo
 * @property {[number,number, number]} position
 * @property {string} type
 * @property {number[]} dimensions
 * @property {MaterialInfo} material
 * @property {Mesh|null} reference
 */

/**
 * 
 * @param {GeometryInfo} geoData 
 * @returns {Mesh}
 */
function createGeometry(geoData) {
  // Create a geometry
  // Then add a material to apply to it
  
  let geometryType = getGeometryType(geoData.type);
  const geometryInstance = new geometryType(...geoData.dimensions);

  const materialInfo = {
    color: geoData.material.color,
    wireframe: geoData.material.wireframe,
    flatShading: geoData.material.flatShading
  };

  let materialType = getMaterialType(geoData.material.type);
  const material = new materialType(materialInfo);

  // And now put the pieces together
  geoData.reference = new Mesh(geometryInstance, material);
  return geoData.reference;
}

/**
 * 
 * @param {string} type 
 * @returns 
 */
function getGeometryType(type) {
  switch (type) {
    case 'BoxGeometry':
      return BoxGeometry;
    case 'ConeGeometry':
      return ConeGeometry;
    case 'RingGeometry':
      return RingGeometry;
    case 'TubeGeometry':
      return TubeGeometry;
    case 'EdgesGeometry':
      return EdgesGeometry;
    case 'LatheGeometry':
      return LatheGeometry;
    case 'PlaneGeometry':
      return PlaneGeometry;
    case 'ShapeGeometry':
      return ShapeGeometry;
    case 'TorusGeometry':
      return TorusGeometry;
    case 'CircleGeometry':
      return CircleGeometry;
    case 'SphereGeometry':
      return SphereGeometry;
    case 'CapsuleGeometry':
      return CapsuleGeometry;
    case 'ExtrudeGeometry':
      return ExtrudeGeometry;
    case 'CylinderGeometry':
      return CylinderGeometry;
    case 'TorusKnotGeometry':
      return TorusKnotGeometry;
    case 'WireframeGeometry':
      return WireframeGeometry;
    case 'OctahedronGeometry':
      return OctahedronGeometry;
    case 'PolyhedronGeometry':
      return PolyhedronGeometry;
    case 'IcosahedronGeometry':
      return IcosahedronGeometry;
    case 'TetrahedronGeometry':
      return TetrahedronGeometry;
    case 'DodecahedronGeometry':
      return DodecahedronGeometry;
    default:
      throw new Error('Unknown geometry type: ' + type);
  }
}

/**
 * @param {string} type 
 * @returns 
 */
function getMaterialType(type) {
  switch (type) {
    case 'MeshBasicMaterial':
      return MeshBasicMaterial;
    case 'MeshStandardMaterial':
      return MeshStandardMaterial;
    case 'MeshDepthMaterial':
      return MeshDepthMaterial;
    case 'MeshDistanceMaterial':
      return MeshDistanceMaterial;
    case 'MeshLambertMaterial':
      return MeshLambertMaterial;
    case 'MeshMatcapMaterial':
      return MeshMatcapMaterial;
    case 'MeshNormalMaterial':
      return MeshNormalMaterial;
    case 'MeshPhongMaterial':
      return MeshPhongMaterial;
    case 'MeshPhysicalMaterial':
      return MeshPhysicalMaterial;
    case 'MeshToonMaterial':
      return MeshToonMaterial;
    default:
      throw new Error('Unknown material type: ' + type);
  }
}

export { createGeometry };
