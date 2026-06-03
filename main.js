import * as THREE from "three";
import { scene, setupScene } from "./modules/scene.js";
import { createPaintings } from "./modules/paintings.js";
import { createWalls } from "./modules/walls.js";
import { setupLighting } from "./modules/lighting.js";
import { setupFloor } from "./modules/floor.js";
import { createCeiling } from "./modules/ceiling.js";
import { setupRendering } from "./modules/rendering.js";
import { setupEventListeners } from "./modules/eventListeners.js";
import { clickHandling } from "./modules/clickHandling.js";
import { createBenches } from "./modules/bench.js";
import { createDoor } from "./modules/door.js";
import { initSpeakerNotes, setSpeakerState } from "./modules/speakerNotes.js";

const { camera, controls, renderer } = setupScene();
const textureLoader = new THREE.TextureLoader();

camera.position.set(0, -1.3, 12);

const collisionWalls = createWalls(scene);
setupFloor(scene);
createCeiling(scene);
setupLighting(scene);
createBenches(scene);

const door = createDoor(scene);
const { paintings, paintingGroups } = await createPaintings(scene, textureLoader);
paintingGroups.forEach(group => scene.add(group));

initSpeakerNotes();
setupEventListeners(controls);
clickHandling(renderer, camera, paintings, door, controls, setSpeakerState);
setupRendering(scene, camera, renderer, controls, collisionWalls);

const welcomeModal = document.getElementById("welcome-modal");
const welcomeBtn = document.getElementById("welcome-btn");
let welcomeOpen = true;

function showWelcome() {
  welcomeOpen = true;
  welcomeModal.style.display = "flex";
  setSpeakerState("welcome");
}

welcomeBtn.addEventListener("click", () => {
  welcomeOpen = false;
  welcomeModal.style.display = "none";
  controls.lock();
  setSpeakerState("museum");
});

controls.addEventListener("lock", () => {
  document.getElementById("crosshair").style.display = "block";
  document.getElementById("resume-hint").style.display = "none";
});

controls.addEventListener("unlock", () => {
  document.getElementById("crosshair").style.display = "none";
  const modal = document.getElementById("exhibit-modal");
  if (!modal.classList.contains("show")) {
    document.getElementById("resume-hint").style.display = "block";
  }
});

renderer.domElement.addEventListener("click", () => {
  if (welcomeOpen) return;
  const isModalOpen = document.getElementById("exhibit-modal").classList.contains("show");
  if (!isModalOpen) controls.lock();
});

window.__showWelcome = showWelcome;

document.getElementById('letter-continue').addEventListener('click', () => {
  document.getElementById('letter-modal').classList.remove('show');
  showWelcome();
});

document.getElementById('letter-close').addEventListener('click', () => {
  document.getElementById('letter-modal').classList.remove('show');
});
