import * as THREE from "three";

export function createDoor(scene) {
  const canvas = document.createElement("canvas");
  canvas.width = 256; canvas.height = 96;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#1a7a2e";
  ctx.fillRect(0, 0, 256, 96);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, 248, 88);
  ctx.font = "bold 52px sans-serif";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("EXIT", 128, 48);

  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.0, 0.75),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) })
  );
  // Top corner of left wall — x=-19.7, high up, pushed toward the back corner (z=17)
  sign.position.set(-19.7, 7.5, 17);
  sign.rotation.y = Math.PI / 2;
  sign.userData.isDoor = true;
  scene.add(sign);

  return sign;
}
