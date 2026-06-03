import * as THREE from 'three';
import { paintingData } from './paintingData.js';

function loadImageSize(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve({ w: 1, h: 1 });
    img.src = src;
  });
}

// Creates a small wall-mounted lamp fixture above a painting and a spotlight aimed at it
function addPaintingLamp(scene, paintingPos, rotationY) {
  const lampGroup = new THREE.Group();

  // Lamp arm (thin cylinder sticking out from wall)
  const armGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8);
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });
  const arm = new THREE.Mesh(armGeo, metalMat);
  arm.rotation.z = Math.PI / 2; // horizontal
  arm.position.set(0, 0, 0.25); // stick out from wall
  lampGroup.add(arm);

  // Lamp shade (cone pointing down)
  const shadeGeo = new THREE.ConeGeometry(0.18, 0.3, 12, 1, true);
  const shadeMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.3, side: THREE.DoubleSide });
  const shade = new THREE.Mesh(shadeGeo, shadeMat);
  shade.position.set(0, -0.15, 0.5); // hang at end of arm
  lampGroup.add(shade);

  // Bulb glow (small emissive sphere)
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffffcc, emissiveIntensity: 2 })
  );
  bulb.position.set(0, -0.05, 0.5);
  lampGroup.add(bulb);

  // Position the lamp group on the wall above the painting
  // Paintings are at y=0.5, lamp goes at y=4 (about 3.5 units above painting center)
  const wallOffset = 0.3; // distance from wall surface
  lampGroup.rotation.y = rotationY;

  // Compute world position: start from painting x/z, push slightly away from wall
  const dir = new THREE.Vector3(Math.sin(rotationY), 0, Math.cos(rotationY));
  lampGroup.position.set(
    paintingPos.x + dir.x * wallOffset,
    4,
    paintingPos.z + dir.z * wallOffset
  );

  scene.add(lampGroup);

  // SpotLight aimed at the painting
  const spot = new THREE.SpotLight(0xfff5e0, 2.5);
  spot.position.set(
    paintingPos.x + dir.x * wallOffset,
    4,
    paintingPos.z + dir.z * wallOffset
  );
  spot.target.position.set(paintingPos.x, paintingPos.y, paintingPos.z);
  spot.angle = 0.45;
  spot.penumbra = 0.4;
  spot.distance = 12;
  spot.castShadow = false; // keep perf reasonable
  scene.add(spot);
  scene.add(spot.target);
}

// Toreador=1 going around the room
const EXHIBIT_NUMBERS = { Toreador: 1, Palace: 2, Queen: 3, Sword: 4, Mask: 5 };

function createNumberLabel(num) {
  const canvas = document.createElement("canvas");
  canvas.width = 128; canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 128, 128);
  ctx.font = "bold italic 80px 'Cinzel','Old English Text MT',Georgia,serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0,0,0,0.7)";
  ctx.shadowBlur = 8;
  const grad = ctx.createLinearGradient(0, 0, 128, 0);
  grad.addColorStop(0,   "#f9e19d");
  grad.addColorStop(0.3, "#ca9e2b");
  grad.addColorStop(0.5, "#936c12");
  grad.addColorStop(0.7, "#ca9e2b");
  grad.addColorStop(1,   "#f9e19d");
  ctx.fillStyle = grad;
  ctx.fillText(String(num), 64, 64);
  return new THREE.CanvasTexture(canvas);
}

export async function createPaintings(scene, textureLoader) {
  const paintings = [];
  const paintingGroups = [];

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37, // premium warm gold
    metalness: 0.9,
    roughness: 0.25,
  });

  const matBoardMat = new THREE.MeshStandardMaterial({
    color: 0xf5f3ea, // soft elegant cream mat board
    roughness: 0.95,
    metalness: 0.02,
  });

  for (const data of paintingData) {
    const { w, h } = await loadImageSize(data.imgSrc);
    const aspect = w / h;
    const paintingHeight = 3;
    const paintingWidth = paintingHeight * aspect;

    const group = new THREE.Group();
    group.position.set(data.position.x, data.position.y, data.position.z);
    group.rotation.y = data.rotationY;

    // 1. The Painting Canvas
    const painting = new THREE.Mesh(
      new THREE.PlaneGeometry(paintingWidth, paintingHeight),
      new THREE.MeshLambertMaterial({ map: textureLoader.load(data.imgSrc) })
    );
    painting.position.set(0, 0, 0.01); // slightly forward from the mat board
    painting.castShadow = true;
    painting.userData = { info: data.info, imgSrc: data.imgSrc };
    group.add(painting);
    paintings.push(painting);

    // 2. The Mat Board backing
    const matW = paintingWidth + 0.15;
    const matH = paintingHeight + 0.15;
    const matBoard = new THREE.Mesh(
      new THREE.PlaneGeometry(matW, matH),
      matBoardMat
    );
    matBoard.position.set(0, 0, 0);
    matBoard.receiveShadow = true;
    group.add(matBoard);

    // 3. The 3D Beveled Gold Frame (4 separate Box bars)
    const fThick = 0.05;
    const fDepth = 0.06;

    const frameT = new THREE.Mesh(new THREE.BoxGeometry(matW + 2 * fThick, fThick, fDepth), goldMat);
    frameT.position.set(0, matH / 2 + fThick / 2, -fDepth / 2 + 0.005);
    frameT.castShadow = true; frameT.receiveShadow = true;
    group.add(frameT);

    const frameB = new THREE.Mesh(new THREE.BoxGeometry(matW + 2 * fThick, fThick, fDepth), goldMat);
    frameB.position.set(0, -matH / 2 - fThick / 2, -fDepth / 2 + 0.005);
    frameB.castShadow = true; frameB.receiveShadow = true;
    group.add(frameB);

    const frameL = new THREE.Mesh(new THREE.BoxGeometry(fThick, matH, fDepth), goldMat);
    frameL.position.set(-matW / 2 - fThick / 2, 0, -fDepth / 2 + 0.005);
    frameL.castShadow = true; frameL.receiveShadow = true;
    group.add(frameL);

    const frameR = new THREE.Mesh(new THREE.BoxGeometry(fThick, matH, fDepth), goldMat);
    frameR.position.set(matW / 2 + fThick / 2, 0, -fDepth / 2 + 0.005);
    frameR.castShadow = true; frameR.receiveShadow = true;
    group.add(frameR);

    paintingGroups.push(group);

    // Gold exhibit number — large, to the left of the frame
    const num = EXHIBIT_NUMBERS[data.info.title];
    if (num !== undefined) {
      const numMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.6, 1.6),
        new THREE.MeshBasicMaterial({ map: createNumberLabel(num), transparent: true })
      );
      // Positioned to the left of the frame, vertically centered
      numMesh.position.set(-matW / 2 - fThick - 1.0, 0, 0.01);
      group.add(numMesh);
    }

    // Add spotlight lamp above this painting
    addPaintingLamp(scene, data.position, data.rotationY);
  }

  return { paintings, paintingGroups };
}
