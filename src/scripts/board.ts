/**
 * Frame navigation without scroll hijacking (SDD 3.3).
 * Sections stay in normal document flow so tall frames (Work, Experience) scroll fully.
 * Nav / keyboard: smooth scroll to frame + hash + focus.
 */

interface FrameInfo {
  id: string;
  el: HTMLElement;
  index: number;
}

const TRANSITION_DURATION = 500;
const HEADER_OFFSET_VAR = '--header-height';

let frames: FrameInfo[] = [];
let currentIndex = 0;
let scrollRaf = 0;

function getHeaderOffset(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(HEADER_OFFSET_VAR).trim();
  const parsed = parseFloat(raw);
  if (Number.isFinite(parsed)) {
    return parsed * (raw.endsWith('rem') ? 16 : 1);
  }
  return 56;
}

function getFrameElements(): FrameInfo[] {
  const board = document.querySelector<HTMLElement>('[data-board]');
  if (!board) return [];

  const sections = board.querySelectorAll<HTMLElement>('.frame');
  return Array.from(sections).map((el, index) => ({
    id: el.id,
    el,
    index,
  }));
}

function scrollToFrame(index: number, behavior: ScrollBehavior = 'smooth'): void {
  if (index < 0 || index >= frames.length) return;

  currentIndex = index;
  const target = frames[index];
  const top = target.el.getBoundingClientRect().top + window.scrollY - getHeaderOffset() - 8;

  window.scrollTo({ top, behavior });

  const newHash = `#${target.id}`;
  if (window.location.hash !== newHash) {
    history.replaceState(null, '', newHash);
  }

  updateActiveStates(target.id);

  if (behavior === 'auto') return;

  window.setTimeout(() => {
    const heading = target.el.querySelector('h1, h2');
    if (heading instanceof HTMLElement) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }, TRANSITION_DURATION);
}

function updateActiveStates(activeId: string): void {
  frames.forEach((f) => {
    f.el.classList.toggle('frame-active', f.id === activeId);
  });

  document.querySelectorAll('[data-frame]').forEach((link) => {
    if (link instanceof HTMLElement) {
      link.classList.toggle('is-active', link.dataset.frame === activeId);
    }
  });
}

function getFrameIndexFromHash(): number {
  const hash = window.location.hash.slice(1);
  const idx = frames.findIndex((f) => f.id === hash);
  return idx >= 0 ? idx : 0;
}

function syncCurrentFromScroll(): void {
  if (frames.length === 0) return;

  const offset = getHeaderOffset() + 48;
  let best = 0;
  let bestDist = Infinity;

  frames.forEach((f, i) => {
    const rect = f.el.getBoundingClientRect();
    const dist = Math.abs(rect.top - offset);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  });

  if (best !== currentIndex) {
    currentIndex = best;
    updateActiveStates(frames[best].id);
  }
}

function onScroll(): void {
  cancelAnimationFrame(scrollRaf);
  scrollRaf = requestAnimationFrame(syncCurrentFromScroll);
}

function handleKeyboard(e: KeyboardEvent): void {
  const tag = (e.target as HTMLElement).tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

  // Only when focus is on body or within the board (avoid hijacking unrelated shortcuts)
  const active = document.activeElement;
  const inBoard =
    active === document.body ||
    active === document.documentElement ||
    (active instanceof HTMLElement && active.closest('[data-board]'));

  if (!inBoard && active instanceof HTMLElement && !active.closest('.frame-nav')) return;

  switch (e.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      if (!e.altKey) return;
      e.preventDefault();
      scrollToFrame(Math.min(currentIndex + 1, frames.length - 1));
      break;
    case 'ArrowUp':
    case 'ArrowLeft':
      if (!e.altKey) return;
      e.preventDefault();
      scrollToFrame(Math.max(currentIndex - 1, 0));
      break;
    case 'Home':
      if (!e.ctrlKey) return;
      e.preventDefault();
      scrollToFrame(0);
      break;
    case 'End':
      if (!e.ctrlKey) return;
      e.preventDefault();
      scrollToFrame(frames.length - 1);
      break;
  }
}

function handleNavClicks(): void {
  document.querySelectorAll<HTMLAnchorElement>('[data-frame]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const frameId = link.dataset.frame;
      const idx = frames.findIndex((f) => f.id === frameId);
      if (idx >= 0) {
        e.preventDefault();
        scrollToFrame(idx);
      }
    });
  });

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href')?.slice(1);
      if (!targetId) return;
      const idx = frames.findIndex((f) => f.id === targetId);
      if (idx >= 0) {
        e.preventDefault();
        scrollToFrame(idx);
      }
    });
  });
}

function init(): void {
  frames = getFrameElements();
  if (frames.length === 0) return;

  currentIndex = getFrameIndexFromHash();
  updateActiveStates(frames[currentIndex].id);
  handleNavClicks();

  if (window.location.hash) {
    requestAnimationFrame(() => {
      scrollToFrame(currentIndex, 'auto');
    });
  }

  window.addEventListener('keydown', handleKeyboard);
  window.addEventListener('hashchange', () => {
    const idx = getFrameIndexFromHash();
    if (idx !== currentIndex) scrollToFrame(idx);
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  syncCurrentFromScroll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

document.addEventListener('astro:after-swap', init);

export { scrollToFrame as navigateToFrame, frames, currentIndex };