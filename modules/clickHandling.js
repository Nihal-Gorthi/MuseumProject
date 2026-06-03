import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);

let currentParagraphs = [];
let currentPageIndex = 0;
let _setSpeakerState;

function renderModalPage(index) {
  if (!currentParagraphs.length) return;

  const prevBtn = document.getElementById('modal-prev-btn');
  const nextBtn = document.getElementById('modal-next-btn');
  const dotsContainer = document.getElementById('modal-dots-container');
  const descEl = document.getElementById('modal-desc');

  // If multiple bullets, show all as a list (no pagination needed)
  if (currentParagraphs.length > 1) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    dotsContainer.innerHTML = '';
    const ul = document.createElement('ul');
    ul.className = 'modal-bullets';
    currentParagraphs.forEach(item => {
      if (Array.isArray(item)) {
        // Sub-bullet: nest under the previous <li>
        const lastLi = ul.lastElementChild;
        const subUl = document.createElement('ul');
        item.forEach(subText => {
          const subLi = document.createElement('li');
          subLi.innerHTML = subText;
          subUl.appendChild(subLi);
        });
        if (lastLi) lastLi.appendChild(subUl);
        else ul.appendChild(subUl);
      } else {
        const li = document.createElement('li');
        li.innerHTML = item;
        ul.appendChild(li);
      }
    });
    descEl.innerHTML = '';
    descEl.appendChild(ul);
    return;
  }

  // Single paragraph — show as plain text
  prevBtn.style.display = '';
  nextBtn.style.display = '';
  currentPageIndex = (index + currentParagraphs.length) % currentParagraphs.length;
  descEl.style.opacity = '0';
  setTimeout(() => {
    descEl.textContent = currentParagraphs[currentPageIndex];
    descEl.style.opacity = '1';
  }, 120);

  dotsContainer.innerHTML = '';
  currentParagraphs.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = 'modal-dot' + (idx === currentPageIndex ? ' active' : '');
    dot.addEventListener('click', () => renderModalPage(idx));
    dotsContainer.appendChild(dot);
  });
}

export function clickHandling(renderer, camera, paintings, door, controls, setSpeakerState) {
  _setSpeakerState = setSpeakerState;

  document.addEventListener('click', () => {
    if (!controls.isLocked) return;

    raycaster.setFromCamera(center, camera);

    // Check door first
    const doorHit = raycaster.intersectObject(door);
    if (doorHit.length > 0) {
      controls.unlock();
      const exitModal = document.getElementById('exit-modal');
      exitModal.classList.add('show');
      document.getElementById('exit-cancel').onclick = () => {
        exitModal.classList.remove('show');
        controls.lock();
      };
      document.getElementById('exit-confirm').onclick = () => {
        exitModal.classList.remove('show');
        document.getElementById('letter-modal').classList.add('show');
      };
      return;
    }

    // Check paintings
    const hits = raycaster.intersectObjects(paintings);
    if (hits.length === 0) return;

    const painting = hits[0].object;
    const { title, origin, museum, paragraphs, disclaimer } = painting.userData.info;
    controls.unlock();

    document.getElementById('modal-img').src = painting.userData.imgSrc;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-origin').textContent = origin ?? '';
    document.getElementById('modal-museum').textContent = museum ?? '';

    // Show/hide disclaimer
    let disclaimerEl = document.getElementById('modal-disclaimer');
    if (!disclaimerEl) {
      disclaimerEl = document.createElement('p');
      disclaimerEl.id = 'modal-disclaimer';
      disclaimerEl.style.cssText = 'color:#888;font-style:italic;font-size:0.85em;margin:4px 0 0;';
      document.getElementById('modal-title').after(disclaimerEl);
    }
    disclaimerEl.textContent = disclaimer ?? '';
    disclaimerEl.style.display = disclaimer ? '' : 'none';

    currentParagraphs = paragraphs || [];
    currentPageIndex = 0;
    renderModalPage(0);
    document.getElementById('exhibit-modal').classList.add('show');

    // Use painting-specific speaker note if available, else first paragraph
    const note = painting.userData.info.speakerNote ?? paragraphs?.[0] ?? '';
    _setSpeakerState('modal', note);
  });

  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('exhibit-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  document.getElementById('modal-prev-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    renderModalPage(currentPageIndex - 1);
    _setSpeakerState('modal', currentParagraphs[currentPageIndex] ?? '');
  });

  document.getElementById('modal-next-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    renderModalPage(currentPageIndex + 1);
    _setSpeakerState('modal', currentParagraphs[currentPageIndex] ?? '');
  });

  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('exhibit-modal');
    if (!modal.classList.contains('show')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); renderModalPage(currentPageIndex + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); renderModalPage(currentPageIndex - 1); }
    else if (e.key === 'Escape') closeModal();
  });

  function closeModal() {
    document.getElementById('exhibit-modal').classList.remove('show');
    currentParagraphs = [];
    _setSpeakerState('museum');
    setTimeout(() => controls.lock(), 150);
  }
}
