import { Color, DoubleSide, Group, Mesh, MeshBasicMaterial, PlaneGeometry, MeshStandardMaterial} from 'three';

function createRooms() {
  const groupOfRooms = new Group();
  const groupRoom1 = new Group();
  const groupRoom2 = new Group();

  groupRoom1.name = 'room1';
  groupRoom2.name = 'room2';

  const room1_1_geo = new PlaneGeometry(10, 10);
  const room1_2_geo = new PlaneGeometry(4.8, 10);
  const room1_3_geo = new PlaneGeometry(4.8, 10);
  const room1_4_geo = new PlaneGeometry(10, 10);
  const room1_5_geo = new PlaneGeometry(10, 10);
  const room1_6_geo = new PlaneGeometry(10, 10);

  const room1_1 = new Mesh(room1_1_geo, new MeshStandardMaterial({ color: 0x008000, side: DoubleSide}));
  const room1_2 = new Mesh(room1_2_geo, new MeshStandardMaterial({ color: 0x008000, side: DoubleSide}));
  const room1_3 = new Mesh(room1_3_geo, new MeshStandardMaterial({ color: 0x008000, side: DoubleSide}));
  const room1_4 = new Mesh(room1_4_geo, new MeshStandardMaterial({ color: 0x008000, side: DoubleSide}));
  const room1_5 = new Mesh(room1_5_geo, new MeshStandardMaterial({ color: 0x008000, side: DoubleSide}));
  const room1_6 = new Mesh(room1_6_geo, new MeshStandardMaterial({ color: 0x008000, side: DoubleSide}));

  // Assuming the y-axis is up and the z-axis is forward
  room1_1.position.set(0, 0, -5); // Back wall
  room1_2.position.set(-5, 0, -3.2); // Left wall, part 1
  room1_3.position.set(-5, 0, 3.2); // Left wall, part 2
  room1_4.position.set(0, 0, 5); // Front wall
  room1_5.position.set(5, 0, 0); // Right wall
  room1_6.position.set(0, 5, 0); // Ceiling

  // Rotate the walls to face inward
  room1_1.rotation.y = Math.PI; // 180 degrees
  room1_2.rotation.y = -Math.PI / 2; // -90 degrees
  room1_3.rotation.y = Math.PI / 2; // 90 degrees
  room1_4.rotation.y = 0; // 0 degrees
  room1_5.rotation.y = -Math.PI / 2; // 90 degrees
  room1_6.rotation.x = Math.PI / 2; // 90 degrees

  groupRoom1.add(room1_1);
  groupRoom1.add(room1_2);
  groupRoom1.add(room1_3);
  groupRoom1.add(room1_4);
  groupRoom1.add(room1_5);
  groupRoom1.add(room1_6);

  const room2_1 = new Mesh(room1_1_geo, new MeshStandardMaterial({ color: 0x000080, side: DoubleSide}));
  const room2_2 = new Mesh(room1_2_geo, new MeshStandardMaterial({ color: 0x000080, side: DoubleSide}));
  const room2_3 = new Mesh(room1_3_geo, new MeshStandardMaterial({ color: 0x000080, side: DoubleSide}));
  const room2_4 = new Mesh(room1_4_geo, new MeshStandardMaterial({ color: 0x000080, side: DoubleSide}));
  const room2_5 = new Mesh(room1_5_geo, new MeshStandardMaterial({ color: 0x000080, side: DoubleSide}));
  const room2_6 = new Mesh(room1_6_geo, new MeshStandardMaterial({ color: 0x000080, side: DoubleSide}));

  // Assuming the y-axis is up and the z-axis is forward
  room2_1.position.set(0, 0, -5); // Back wall
  room2_2.position.set(5, 0, -3.2); // Right wall, part 1
  room2_3.position.set(5, 0, 3.2); // Right wall, part 2
  room2_4.position.set(0, 0, 5); // Front wall
  room2_5.position.set(-5, 0, 0); // Left wall
  room2_6.position.set(0, 5, 0); // Ceiling

  // Rotate the walls to face inward
  room2_1.rotation.y = Math.PI; // 180 degrees
  room2_2.rotation.y = -Math.PI / 2; // -90 degrees
  room2_3.rotation.y = Math.PI / 2; // 90 degrees
  room2_4.rotation.y = 0; // 0 degrees
  room2_5.rotation.y = -Math.PI / 2; // 90 degrees
  room2_6.rotation.x = Math.PI / 2; // 90 degrees

  groupRoom2.add(room2_1);
  groupRoom2.add(room2_2);
  groupRoom2.add(room2_3);
  groupRoom2.add(room2_4);
  groupRoom2.add(room2_5);
  groupRoom2.add(room2_6);  

  groupRoom1.position.set(0, 0, 0);
  groupRoom2.position.set(-10.01, 0, 0);

  groupOfRooms.add(groupRoom1);
  groupOfRooms.add(groupRoom2);

  return groupOfRooms;
}

export { createRooms };
