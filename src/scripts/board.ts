/**
 * Board navigation: manages frame-to-frame camera transitions on wide screens.
 * On narrow screens or no-JS, sections stack normally.
 */

interface FrameInfo {
  id: string;
  el: HTMLElement;
  index: number;
}

const BOARD_MIN_WIDTH = 1024;
const TRANSITION_DURATION = 500;

let frames: FrameInfo[] = [];
let currentIndex = 0;
let boardEl: HTMLElement | null = null;
let isBoardMode = false;

function getFrameElements(): FrameInfo[] {
  const board = document.querySelector<HTMLElement>('[data-board]');
  if (!board) return [];
  boardEl = board;

  const sections = board.querySelectorAll<HTMLElement>('.frame');
  return Array.from(sections).map((el, index) => ({
    id: el.id,
    el,
    index,
  }));
}

function enableBoardMode(): void {
  if (!boardEl || isBoardMode) return;
  isBoardMode = true;
  boardEl.classList.add('board-mode');
  navigateToFrame(currentIndex, false);
}

function disableBoardMode(): void {
  if (!boardEl || !isBoardMode) return;
  isBoardMode = false;
  boardEl.classList.remove('board-mode');
  boardEl.style.transform = '';

  frames.forEach((f) => {
    f.el.style.transform = '';
    f.el.style.opacity = '';
  });
}

function navigateToFrame(index: number, animate = true): void {
  if (!isBoardMode || !boardEl) return;
  if (index < 0 || index >= frames.length) return;

  currentIndex = index;
  const target = frames[index];

  frames.forEach((f, i) => {
    if (i === index) {
      f.el.classList.add('frame-active');
      f.el.style.opacity = '1';
    } else {
      f.el.classList.remove('frame-active');
      f.el.style.opacity = '0.3';
    }
  });

  const offsetY = target.el.offsetTop;
  boardEl.style.transition = animate
    ? `transform ${TRANSITION_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`
    : 'none';
  boardEl.style.transform = `translateY(-${offsetY}px)`;

  // Update hash without scrolling
  const newHash = `#${target.id}`;
  if (window.location.hash !== newHash) {
    history.replaceState(null, '', newHash);
  }

  // Focus management
  const heading = target.el.querySelector('h1, h2');
  if (heading instanceof HTMLElement) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }

  // Update nav active state
  document.querySelectorAll('[data-frame]').forEach((link) => {
    if (link instanceof HTMLElement) {
      link.classList.toggle('is-active', link.dataset.frame === target.id);
    }
  });
}

function getFrameIndexFromHash(): number {
  const hash = window.location.hash.slice(1);
  const idx = frames.findIndex((f) => f.id === hash);
  return idx >= 0 ? idx : 0;
}

function handleKeyboard(e: KeyboardEvent): void {
  if (!isBoardMode) return;

  // Ignore if user is in an input
  const tag = (e.target as HTMLElement).tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

  switch (e.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      e.preventDefault();
      navigateToFrame(Math.min(currentIndex + 1, frames.length - 1));
      break;
    case 'ArrowUp':
    case 'ArrowLeft':
      e.preventDefault();
      navigateToFrame(Math.max(currentIndex - 1, 0));
      break;
    case 'Home':
      e.preventDefault();
      navigateToFrame(0);
      break;
    case 'End':
      e.preventDefault();
      navigateToFrame(frames.length - 1);
      break;
  }
}

function handleNavClicks(): void {
  document.querySelectorAll<HTMLAnchorElement>('[data-frame]').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (!isBoardMode) return;
      e.preventDefault();
      const frameId = link.dataset.frame;
      const idx = frames.findIndex((f) => f.id === frameId);
      if (idx >= 0) navigateToFrame(idx);
    });
  });

  // Handle anchor links in content (like #contact, #work)
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (!isBoardMode) return;
      const targetId = link.getAttribute('href')?.slice(1);
      if (!targetId) return;
      const idx = frames.findIndex((f) => f.id === targetId);
      if (idx >= 0) {
        e.preventDefault();
        navigateToFrame(idx);
      }
    });
  });
}

function handleResize(): void {
  const wide = window.innerWidth >= BOARD_MIN_WIDTH;
  if (wide && !isBoardMode) {
    enableBoardMode();
  } else if (!wide && isBoardMode) {
    disableBoardMode();
  }
}

function init(): void {
  frames = getFrameElements();
  if (frames.length === 0) return;

  currentIndex = getFrameIndexFromHash();
  handleResize();
  handleNavClicks();

  window.addEventListener('keydown', handleKeyboard);
  window.addEventListener('hashchange', () => {
    const idx = getFrameIndexFromHash();
    if (idx !== currentIndex) navigateToFrame(idx);
  });
  window.addEventListener('resize', handleResize);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

document.addEventListener('astro:after-swap', init);

export { navigateToFrame, frames, currentIndex };
