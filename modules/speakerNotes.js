const NOTES = {
  welcome: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. This is the welcome state speaker note — introduce the exhibition, the theme, and invite the visitor to step inside. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.`,
  museum: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. The visitor is now wandering the gallery. Use this space for ambient curatorial commentary — observations about the room, the light, or the collection as a whole. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.`,
};

const bar = () => document.getElementById("speaker-bar");
const textEl = () => document.getElementById("speaker-text");

export function initSpeakerNotes() {
  document.getElementById("speaker-tab").addEventListener("click", () => {
    bar().classList.toggle("open");
  });
  setSpeakerState("welcome");
}

export function setSpeakerState(state, customText) {
  textEl().textContent = customText ?? NOTES[state] ?? "";
}
