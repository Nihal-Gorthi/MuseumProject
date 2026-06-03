import { keysPressed } from "./movement.js";

export const setupEventListeners = (controls) => {
  document.addEventListener("keydown", (e) => {
    const key = e.key;
    if (key === "ArrowUp") keysPressed.ArrowUp = true;
    if (key === "ArrowDown") keysPressed.ArrowDown = true;
    if (key === "ArrowLeft") keysPressed.ArrowLeft = true;
    if (key === "ArrowRight") keysPressed.ArrowRight = true;

    const lower = key.toLowerCase();
    if (lower === "w") keysPressed.w = true;
    if (lower === "a") keysPressed.a = true;
    if (lower === "s") keysPressed.s = true;
    if (lower === "d") keysPressed.d = true;
  });

  document.addEventListener("keyup", (e) => {
    const key = e.key;
    if (key === "ArrowUp") keysPressed.ArrowUp = false;
    if (key === "ArrowDown") keysPressed.ArrowDown = false;
    if (key === "ArrowLeft") keysPressed.ArrowLeft = false;
    if (key === "ArrowRight") keysPressed.ArrowRight = false;

    const lower = key.toLowerCase();
    if (lower === "w") keysPressed.w = false;
    if (lower === "a") keysPressed.a = false;
    if (lower === "s") keysPressed.s = false;
    if (lower === "d") keysPressed.d = false;
  });
};
