const NOTES = {
  welcome: `<p>This museum exhibit captures the extent of human sacrifice to achieve honor and dignity in a world where people increasingly feel left behind. While the artworks differ vastly in geographic and temporal scope, they all share the common message of displaying the various (often drastic) actions that people take in order to have their place and be recognized in the world.</p>

<p>In our exhibit, we focus both on how this sacrifice might look like at an individual level as well as at a much larger scale. For instance, in The Dead Toreador and Versatile Queen, we will explore how individuals choose to express themselves, even if it comes with the risk of losing one's identity or even death. Conversely, in Palace of the Parthian Kings and Emblem of Authority, we explore this issue on a much larger scale, such as when governments wage deadly conflicts in an attempt to gain prestige. Finally, our own image, The Burden of Achievement reflects the connection of our theme to the modern world. While many images reflect what happened many years ago, this work highlights how people today still sacrifice a lot in exchange for achievement.</p>

<p>What we want the viewers to think about:</p>
<ul>
<li>How does the artwork displayed demonstrate how human sacrifice is often a means of feeling significant in an indifferent society?</li>
<li>How do the exhibits connect to literature like Antigone and Metamorphosis? What is similar and what is different, and how might these connections influence us today?</li>
<li>What sacrifices are people willing to make to have their place in the world? What drives people to make these sacrifices?</li>
</ul>`,
  museum: `<ul><li><kbd>W A S D</kbd> — Move</li><li><kbd>Mouse</kbd> — Look</li><li><kbd>Click</kbd> — Inspect</li></ul>`,
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
  textEl().innerHTML = customText ?? NOTES[state] ?? "";
}
