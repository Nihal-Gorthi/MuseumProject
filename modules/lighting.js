import * as THREE from "three";

export const setupLighting = (scene) => {
  // Soft ambient fill light
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));

  // Warm overhead sunlight pouring through the skylight
  const sunlight = new THREE.DirectionalLight(0xfff3e0, 1.2); // warm golden sun
  sunlight.position.set(0, 18, 0);
  sunlight.target.position.set(0, 0, 0);
  sunlight.castShadow = true;

  // Configure high-resolution orthographic shadow mapping for crisp steel shadows
  sunlight.shadow.mapSize.width = 2048;
  sunlight.shadow.mapSize.height = 2048;
  sunlight.shadow.camera.near = 0.5;
  sunlight.shadow.camera.far = 25;

  const d = 15; // shadow camera bounds
  sunlight.shadow.camera.left = -d;
  sunlight.shadow.camera.right = d;
  sunlight.shadow.camera.top = d;
  sunlight.shadow.camera.bottom = -d;
  sunlight.shadow.bias = -0.0005;

  scene.add(sunlight);
  scene.add(sunlight.target);

  function addSpot(x, y, z, tx, ty, tz) {
    const light = new THREE.SpotLight(0xffffff, 1.0);
    light.position.set(x, y, z);
    light.target.position.set(tx, ty, tz);
    light.castShadow = true;
    light.angle = 1.2;
    light.penumbra = 0.3;
    light.distance = 50;
    scene.add(light);
    scene.add(light.target);
  }

  addSpot(0,  6.7, -13, 0, 0, -20);
  addSpot(0,  6.7,  13, 0, 0,  20);
  addSpot(-13, 6.7, 0, -20, 0, 0);
  addSpot(13,  6.7, 0,  20, 0, 0);
};

