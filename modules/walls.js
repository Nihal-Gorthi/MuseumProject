import * as THREE from "three";

export function createWalls(scene) {
  const collisionWalls = new THREE.Group();
  const textureLoader = new THREE.TextureLoader();
  const wallTexture = textureLoader.load("/3D-art-gallery/img/marble.png");
  wallTexture.wrapS = THREE.RepeatWrapping;
  wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(4, 2);

  const wallMat = new THREE.MeshStandardMaterial({
    map: wallTexture,
    roughness: 0.25,
    metalness: 0.1,
  });

  const baseboardMat = new THREE.MeshStandardMaterial({
    color: 0x2c2c2c,
    roughness: 0.4,
  });

  const ROOM = 40;   // room width/depth
  const H = 13;      // wall height
  const Y = H / 2 - 3; // center so floor is at y=-3, ceiling at y=10
  const BB_H = 0.4;  // baseboard height

  const walls = [
    { pos: [0, Y, -ROOM / 2], ry: 0 },
    { pos: [0, Y,  ROOM / 2], ry: Math.PI },
    { pos: [-ROOM / 2, Y, 0], ry:  Math.PI / 2 },
    { pos: [ ROOM / 2, Y, 0], ry: -Math.PI / 2 },
  ];

  walls.forEach(({ pos, ry }) => {
    // Main wall panel
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM, H), wallMat);
    wall.position.set(...pos);
    wall.rotation.y = ry;
    wall.receiveShadow = true;
    scene.add(wall);

    // Baseboard (Volumetric 3D Trim - prevents Z-fighting)
    const bb = new THREE.Mesh(new THREE.BoxGeometry(ROOM, BB_H, 0.05), baseboardMat);
    bb.position.set(pos[0], -3 + BB_H / 2, pos[2]);
    bb.rotation.y = ry;
    bb.translateZ(0.025); // Pop forward to sit flush in front of the wall
    bb.castShadow = true;
    scene.add(bb);

    // Invisible collision box for this wall
    const collider = new THREE.Mesh(
      new THREE.BoxGeometry(ROOM, H, 1),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    collider.position.set(...pos);
    collider.rotation.y = ry;
    collider.BoundingBox = new THREE.Box3().setFromObject(collider);
    collisionWalls.add(collider);
  });

  // 3D Canvas Text utility to render the Gothic Exhibition Title
  function createGothicTextPlane() {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ornate serif font styled as gothic script
    ctx.font = "bold italic 72px 'Cinzel', 'Old English Text MT', 'Georgia', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Ambient contrast shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 4;

    // Golden gradient to match premium frames
    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0, "#f9e19d");
    grad.addColorStop(0.3, "#ca9e2b");
    grad.addColorStop(0.5, "#936c12");
    grad.addColorStop(0.7, "#ca9e2b");
    grad.addColorStop(1, "#f9e19d");
    ctx.fillStyle = grad;

    ctx.fillText("The Cost of Glory Exhibit", canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      roughness: 0.3,
      metalness: 0.8,
    });

    const geo = new THREE.PlaneGeometry(16, 4);
    const mesh = new THREE.Mesh(geo, mat);
    return mesh;
  }

  // Mount Gothic text banner on the empty back wall (z=19.8, facing -z)
  const textPlane = createGothicTextPlane();
  textPlane.position.set(0, 2.0, 19.8);
  textPlane.rotation.y = Math.PI;
  scene.add(textPlane);

  return collisionWalls;
}
