import * as THREE from "three";

export const setupFloor = (scene) => {
  const textureLoader = new THREE.TextureLoader();
  const floorTex = textureLoader.load("/3D-art-gallery/img/usefloor.png");
  floorTex.wrapS = THREE.RepeatWrapping;
  floorTex.wrapT = THREE.RepeatWrapping;
  // Aspect-correct repeat: texture is 886×608 (~3:2), floor is 40×40 units
  // 5 tiles across, scaled vertically to match texture aspect ratio
  floorTex.repeat.set(5, 5 * (608 / 886));

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.75, metalness: 0.0 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -3;
  floor.receiveShadow = true;
  scene.add(floor);
};
