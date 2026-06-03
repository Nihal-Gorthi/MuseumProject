import * as THREE from "three";
import { updateMovement } from "./movement.js";

export const setupRendering = (scene, camera, renderer, controls, walls) => {
  const clock = new THREE.Clock();

  function render() {
    updateMovement(clock.getDelta(), controls, camera, walls);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();
};
