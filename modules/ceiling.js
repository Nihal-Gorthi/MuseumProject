import * as THREE from "three";

export const createCeiling = (scene) => {
  const textureLoader = new THREE.TextureLoader();
  const ceilTex = textureLoader.load("/img/ceilingtexture.png");
  ceilTex.wrapS = THREE.RepeatWrapping;
  ceilTex.wrapT = THREE.RepeatWrapping;
  ceilTex.repeat.set(4, 4);

  const ceilMat = new THREE.MeshStandardMaterial({ map: ceilTex, roughness: 0.85, metalness: 0.0 });

  // Four textured ceiling planes for the perimeter sections, facing downward (y=10)
  const sections = [
    { geo: new THREE.PlaneGeometry(10, 40), pos: [-15, 10, 0] },
    { geo: new THREE.PlaneGeometry(10, 40), pos: [15,  10, 0] },
    { geo: new THREE.PlaneGeometry(20, 10), pos: [0, 10, -15] },
    { geo: new THREE.PlaneGeometry(20, 10), pos: [0, 10,  15] },
  ];

  sections.forEach(({ geo, pos }) => {
    const mesh = new THREE.Mesh(geo, ceilMat);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(...pos);
    scene.add(mesh);
  });

  // Fill the vertical gap (y=10 to y=10.4) around the skylight opening edge
  // so the sky-blue background doesn't show through
  const GAP = 0.42;
  const gapMat = new THREE.MeshStandardMaterial({ color: 0xf0eeea, roughness: 0.85 });
  [
    { size: [20, GAP, 0.1], pos: [0,  10 + GAP / 2, -10] },  // front edge
    { size: [20, GAP, 0.1], pos: [0,  10 + GAP / 2,  10] },  // back edge
    { size: [0.1, GAP, 20], pos: [-10, 10 + GAP / 2, 0] },   // left edge
    { size: [0.1, GAP, 20], pos: [ 10, 10 + GAP / 2, 0] },   // right edge
  ].forEach(({ size, pos }) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(...size), gapMat);
    m.position.set(...pos);
    scene.add(m);
  });

  // Set sky as scene background (shows through skylight opening)
  const skyTex = textureLoader.load("/img/sky.png");
  scene.background = skyTex;

  // Sky texture plane behind the skylight opening (closer view)
  const skyPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshBasicMaterial({ map: skyTex })
  );
  skyPlane.rotation.x = Math.PI / 2;
  skyPlane.position.set(0, 10.5, 0);
  scene.add(skyPlane);

  // Individual glass panes between grid bars (grid spacing = 4 units, bars at -8,-4,0,4,8)
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xc8e8f5,
    transparent: true,
    opacity: 0.25,
    roughness: 0.0,
    metalness: 0.1,
    envMapIntensity: 1.0,
    side: THREE.DoubleSide,
  });
  const paneSize = 3.76; // 4 units minus bar thickness (0.12) with small gap
  const centers = [-6, -2, 2, 6]; // centers of each cell between bars
  for (const cx of centers) {
    for (const cz of centers) {
      const pane = new THREE.Mesh(new THREE.PlaneGeometry(paneSize, paneSize), glassMat);
      pane.rotation.x = Math.PI / 2;
      pane.position.set(cx, 10.38, cz); // just below bar level
      scene.add(pane);
    }
  }

  // 3. Steel framing and grid (centered at y=10.4)
  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x1f1f1f, // industrial charcoal steel
    roughness: 0.5,
    metalness: 0.8,
  });

  const skylightGroup = new THREE.Group();

  const frameThickness = 0.25;
  const frameHeight = 0.4;

  // Left frame bar
  const frameL = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, frameHeight, 20), steelMat);
  frameL.position.set(-10, 10.4, 0);
  skylightGroup.add(frameL);

  // Right frame bar
  const frameR = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, frameHeight, 20), steelMat);
  frameR.position.set(10, 10.4, 0);
  skylightGroup.add(frameR);

  // Front frame bar
  const frameF = new THREE.Mesh(new THREE.BoxGeometry(20, frameHeight, frameThickness), steelMat);
  frameF.position.set(0, 10.4, -10);
  skylightGroup.add(frameF);

  // Back frame bar
  const frameB = new THREE.Mesh(new THREE.BoxGeometry(20, frameHeight, frameThickness), steelMat);
  frameB.position.set(0, 10.4, 10);
  skylightGroup.add(frameB);

  // Interior grid crossbars
  const gridThickness = 0.12;
  const gridHeight = 0.25;

  for (let pos = -8; pos <= 8; pos += 4) {
    // Longitudinal bars along Z
    const barZ = new THREE.Mesh(new THREE.BoxGeometry(gridThickness, gridHeight, 20), steelMat);
    barZ.position.set(pos, 10.4, 0);
    barZ.castShadow = true;
    skylightGroup.add(barZ);

    // Latitudinal bars along X
    const barX = new THREE.Mesh(new THREE.BoxGeometry(20, gridHeight, gridThickness), steelMat);
    barX.position.set(0, 10.4, pos);
    barX.castShadow = true;
    skylightGroup.add(barX);
  }

  scene.add(skylightGroup);
};
