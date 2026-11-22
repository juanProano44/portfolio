/**
 * Pointer-reactive dot field: low-cost background that responds to pointer.
 * Pauses on hidden tab and reduced motion.
 * Near-zero idle CPU when no pointer movement.
 */

interface FieldDot {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
}

const DOT_SPACING = 40;
const INFLUENCE_RADIUS = 120;
const PUSH_STRENGTH = 25;
const RETURN_SPEED = 0.08;

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let fieldDots: FieldDot[] = [];
let pointerX = -1000;
let pointerY = -1000;
let isActive = false;
let animId = 0;
let needsUpdate = false;

function shouldDisable(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function createGrid(w: number, h: number): void {
  fieldDots = [];
  for (let y = DOT_SPACING; y < h; y += DOT_SPACING) {
    for (let x = DOT_SPACING; x < w; x += DOT_SPACING) {
      fieldDots.push({
        x,
        y,
        baseX: x,
        baseY: y,
        size: 1,
      });
    }
  }
}

function draw(): void {
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const dotColor = isDark ? 'rgba(240, 240, 240, 0.08)' : 'rgba(17, 17, 17, 0.06)';

  fieldDots.forEach((dot) => {
    const dx = dot.x - pointerX;
    const dy = dot.y - pointerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < INFLUENCE_RADIUS) {
      const force = (1 - dist / INFLUENCE_RADIUS) * PUSH_STRENGTH;
      const angle = Math.atan2(dy, dx);
      dot.x = dot.baseX + Math.cos(angle) * force;
      dot.y = dot.baseY + Math.sin(angle) * force;
      needsUpdate = true;
    } else {
      dot.x += (dot.baseX - dot.x) * RETURN_SPEED;
      dot.y += (dot.baseY - dot.y) * RETURN_SPEED;

      if (Math.abs(dot.x - dot.baseX) > 0.1 || Math.abs(dot.y - dot.baseY) > 0.1) {
        needsUpdate = true;
      }
    }

    ctx!.beginPath();
    ctx!.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
    ctx!.fillStyle = dotColor;
    ctx!.fill();
  });
}

function loop(): void {
  if (!isActive) return;

  if (needsUpdate) {
    needsUpdate = false;
    draw();
  }

  animId = requestAnimationFrame(loop);
}

function handlePointer(e: PointerEvent | TouchEvent): void {
  const point = 'touches' in e ? e.touches[0] : e;
  if (!point) return;
  pointerX = point.clientX;
  pointerY = point.clientY;
  needsUpdate = true;
}

function handleVisibility(): void {
  if (document.hidden) {
    isActive = false;
    cancelAnimationFrame(animId);
  } else if (canvas) {
    isActive = true;
    loop();
  }
}

function resize(): void {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createGrid(canvas.width, canvas.height);
  needsUpdate = true;
}

function init(): void {
  if (shouldDisable()) return;

  canvas = document.querySelector<HTMLCanvasElement>('[data-dotfield-canvas]');
  if (!canvas) return;

  ctx = canvas.getContext('2d');
  if (!ctx) return;

  resize();

  window.addEventListener('pointermove', handlePointer, { passive: true });
  window.addEventListener('touchmove', handlePointer, { passive: true });
  document.addEventListener('visibilitychange', handleVisibility);
  window.addEventListener('resize', resize);

  // Start after intro or immediately
  const startField = (): void => {
    isActive = true;
    canvas!.style.opacity = '1';
    loop();
  };

  if (sessionStorage.getItem('intro-seen') === '1') {
    startField();
  } else {
    window.addEventListener('intro-complete', startField, { once: true });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

document.addEventListener('astro:after-swap', init);
