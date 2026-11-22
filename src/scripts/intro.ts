/**
 * Signature intro animation:
 * 1. Dots form "JP" from the display typeface
 * 2. Dots rearrange to outline frame positions
 * 3. Builder cursors "place" frames
 * 4. Content fades in, overlay removed
 *
 * Total duration: ~4s max
 * Respects: prefers-reduced-motion, Save-Data, once-per-session, low-power
 */

interface Dot {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

interface BuilderCursor {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  label: string;
  opacity: number;
}

type Phase = 'gather' | 'arrange' | 'build' | 'done';

const PHASE_DURATIONS = {
  gather: 1200,
  arrange: 1300,
  build: 1200,
};

const DOT_COUNT_DESKTOP = 1500;
const DOT_COUNT_MOBILE = 700;
const FPS_THRESHOLD = 45;
const FPS_CHECK_INTERVAL = 500;

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let dots: Dot[] = [];
let cursors: BuilderCursor[] = [];
let phase: Phase = 'gather';
let phaseStart = 0;
let animationId = 0;
let isRunning = false;
let fpsFrames = 0;
let fpsLastCheck = 0;
let dotCountReduced = false;

function shouldSkipIntro(): boolean {
  if (typeof window === 'undefined') return true;

  // Reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;

  // Save-Data header (via navigator)
  if ('connection' in navigator) {
    const conn = navigator.connection as { saveData?: boolean };
    if (conn.saveData) return true;
  }

  // Already seen this session
  if (sessionStorage.getItem('intro-seen') === '1') return true;

  return false;
}

function sampleTextToDots(
  text: string,
  font: string,
  canvasWidth: number,
  canvasHeight: number,
  count: number,
): Array<{ x: number; y: number }> {
  const offscreen = document.createElement('canvas');
  const fontSize = Math.min(canvasWidth * 0.4, canvasHeight * 0.6);
  offscreen.width = canvasWidth;
  offscreen.height = canvasHeight;
  const offCtx = offscreen.getContext('2d');
  if (!offCtx) return [];

  offCtx.fillStyle = '#000';
  offCtx.font = `700 ${fontSize}px ${font}`;
  offCtx.textAlign = 'center';
  offCtx.textBaseline = 'middle';
  offCtx.fillText(text, canvasWidth / 2, canvasHeight / 2);

  const imageData = offCtx.getImageData(0, 0, canvasWidth, canvasHeight);
  const pixels = imageData.data;
  const filledPositions: Array<{ x: number; y: number }> = [];

  const step = Math.max(2, Math.floor(Math.sqrt((canvasWidth * canvasHeight) / (count * 4))));

  for (let y = 0; y < canvasHeight; y += step) {
    for (let x = 0; x < canvasWidth; x += step) {
      const idx = (y * canvasWidth + x) * 4;
      if (pixels[idx + 3] > 128) {
        filledPositions.push({ x, y });
      }
    }
  }

  // If we have more positions than needed, pick randomly
  const result: Array<{ x: number; y: number }> = [];
  const shuffled = filledPositions.sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    result.push(shuffled[i]);
  }

  return result;
}

function getFrameRects(): Array<{ x: number; y: number; w: number; h: number; id: string }> {
  const frames = document.querySelectorAll<HTMLElement>('.frame');
  const rects: Array<{ x: number; y: number; w: number; h: number; id: string }> = [];

  frames.forEach((frame) => {
    const rect = frame.getBoundingClientRect();
    rects.push({
      x: rect.left,
      y: rect.top,
      w: rect.width,
      h: rect.height,
      id: frame.id,
    });
  });

  return rects;
}

function generateFrameOutlineDots(
  rects: Array<{ x: number; y: number; w: number; h: number }>,
  count: number,
): Array<{ x: number; y: number }> {
  const positions: Array<{ x: number; y: number }> = [];
  const totalPerimeter = rects.reduce((sum, r) => sum + 2 * (r.w + r.h), 0);

  rects.forEach((rect) => {
    const perimeter = 2 * (rect.w + rect.h);
    const dotsForRect = Math.floor((perimeter / totalPerimeter) * count);
    const step = perimeter / dotsForRect;

    for (let d = 0; d < perimeter; d += step) {
      let x: number, y: number;
      if (d < rect.w) {
        x = rect.x + d;
        y = rect.y;
      } else if (d < rect.w + rect.h) {
        x = rect.x + rect.w;
        y = rect.y + (d - rect.w);
      } else if (d < 2 * rect.w + rect.h) {
        x = rect.x + rect.w - (d - rect.w - rect.h);
        y = rect.y + rect.h;
      } else {
        x = rect.x;
        y = rect.y + rect.h - (d - 2 * rect.w - rect.h);
      }
      positions.push({ x, y });
    }
  });

  return positions;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function createDots(w: number, h: number): void {
  const isMobile = w < 768;
  const count = isMobile ? DOT_COUNT_MOBILE : DOT_COUNT_DESKTOP;

  const jpPositions = sampleTextToDots(
    'JP',
    "'Space Grotesk', system-ui, sans-serif",
    w,
    h,
    count,
  );

  dots = jpPositions.map((pos) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    targetX: pos.x,
    targetY: pos.y,
    originX: Math.random() * w,
    originY: Math.random() * h,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    size: 1.5 + Math.random() * 1.5,
    opacity: 0,
  }));
}

function createCursors(rects: Array<{ x: number; y: number; w: number; h: number }>): void {
  const labels = ['Design', 'Frontend', 'Cloud', 'QA'];
  const startPositions = [
    { x: -50, y: -50 },
    { x: canvas!.width + 50, y: -50 },
    { x: -50, y: canvas!.height + 50 },
    { x: canvas!.width + 50, y: canvas!.height + 50 },
  ];

  cursors = labels.map((label, i) => {
    const rect = rects[i % rects.length];
    return {
      x: startPositions[i].x,
      y: startPositions[i].y,
      targetX: rect.x + rect.w / 2,
      targetY: rect.y + rect.h / 2,
      label,
      opacity: 0,
    };
  });
}

function update(timestamp: number): void {
  if (!ctx || !canvas || !isRunning) return;

  const elapsed = timestamp - phaseStart;

  // FPS monitoring
  fpsFrames++;
  if (timestamp - fpsLastCheck > FPS_CHECK_INTERVAL) {
    const fps = (fpsFrames * 1000) / (timestamp - fpsLastCheck);
    fpsFrames = 0;
    fpsLastCheck = timestamp;

    if (fps < FPS_THRESHOLD && !dotCountReduced) {
      dots = dots.slice(0, Math.floor(dots.length * 0.6));
      dotCountReduced = true;
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const dotColor = isDark ? '240, 240, 240' : '17, 17, 17';

  if (phase === 'gather') {
    const progress = easeOutCubic(Math.min(elapsed / PHASE_DURATIONS.gather, 1));

    dots.forEach((dot) => {
      dot.x = lerp(dot.originX, dot.targetX, progress);
      dot.y = lerp(dot.originY, dot.targetY, progress);
      dot.opacity = Math.min(progress * 2, 1);

      ctx!.beginPath();
      ctx!.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(${dotColor}, ${dot.opacity * 0.8})`;
      ctx!.fill();
    });

    if (elapsed >= PHASE_DURATIONS.gather) {
      phase = 'arrange';
      phaseStart = timestamp;

      const frameRects = getFrameRects();
      const outlinePositions = generateFrameOutlineDots(frameRects, dots.length);

      dots.forEach((dot, i) => {
        const target = outlinePositions[i % outlinePositions.length];
        dot.originX = dot.x;
        dot.originY = dot.y;
        dot.targetX = target.x;
        dot.targetY = target.y;
      });

      createCursors(frameRects);
    }
  } else if (phase === 'arrange') {
    const progress = easeOutCubic(Math.min(elapsed / PHASE_DURATIONS.arrange, 1));

    dots.forEach((dot) => {
      dot.x = lerp(dot.originX, dot.targetX, progress);
      dot.y = lerp(dot.originY, dot.targetY, progress);

      ctx!.beginPath();
      ctx!.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(${dotColor}, ${0.6 + progress * 0.2})`;
      ctx!.fill();
    });

    if (elapsed >= PHASE_DURATIONS.arrange) {
      phase = 'build';
      phaseStart = timestamp;
    }
  } else if (phase === 'build') {
    const progress = easeOutCubic(Math.min(elapsed / PHASE_DURATIONS.build, 1));

    // Fade out dots
    dots.forEach((dot) => {
      ctx!.beginPath();
      ctx!.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(${dotColor}, ${0.8 * (1 - progress)})`;
      ctx!.fill();
    });

    // Animate cursors
    cursors.forEach((cursor) => {
      cursor.x = lerp(cursor.x, cursor.targetX, progress * 0.1 + 0.02);
      cursor.y = lerp(cursor.y, cursor.targetY, progress * 0.1 + 0.02);
      cursor.opacity = Math.min(progress * 3, 1) * (1 - Math.max(0, (progress - 0.7) / 0.3));

      if (cursor.opacity > 0.05) {
        // Cursor arrow
        ctx!.save();
        ctx!.translate(cursor.x, cursor.y);
        ctx!.beginPath();
        ctx!.moveTo(0, 0);
        ctx!.lineTo(0, 16);
        ctx!.lineTo(4, 12);
        ctx!.lineTo(10, 12);
        ctx!.closePath();
        ctx!.fillStyle = `rgba(${dotColor}, ${cursor.opacity})`;
        ctx!.fill();

        // Label
        ctx!.font = `500 11px 'Space Grotesk', system-ui`;
        ctx!.fillStyle = `rgba(${dotColor}, ${cursor.opacity * 0.8})`;
        ctx!.fillText(cursor.label, 14, 14);
        ctx!.restore();
      }
    });

    if (elapsed >= PHASE_DURATIONS.build) {
      finish();
      return;
    }
  }

  animationId = requestAnimationFrame(update);
}

function finish(): void {
  isRunning = false;
  cancelAnimationFrame(animationId);

  // Fade out overlay
  const overlay = document.querySelector<HTMLElement>('[data-intro-overlay]');
  if (overlay) {
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 300);
  }

  sessionStorage.setItem('intro-seen', '1');
  phase = 'done';

  // Dispatch event for other scripts (e.g., dot field)
  window.dispatchEvent(new CustomEvent('intro-complete'));
}

function skip(): void {
  finish();
}

function resize(): void {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function replay(): void {
  sessionStorage.removeItem('intro-seen');
  start();
}

function start(): void {
  const overlay = document.querySelector<HTMLElement>('[data-intro-overlay]');
  canvas = document.querySelector<HTMLCanvasElement>('[data-intro-canvas]');
  if (!canvas || !overlay) return;

  ctx = canvas.getContext('2d');
  if (!ctx) return;

  resize();
  overlay.style.display = 'block';
  overlay.style.opacity = '1';

  createDots(canvas.width, canvas.height);

  phase = 'gather';
  phaseStart = performance.now();
  fpsFrames = 0;
  fpsLastCheck = performance.now();
  dotCountReduced = false;
  isRunning = true;

  animationId = requestAnimationFrame(update);
}

function init(): void {
  // Skip button
  const skipBtn = document.querySelector('[data-skip-intro]');
  if (skipBtn) {
    skipBtn.addEventListener('click', skip);
  }

  // Replay button
  const replayBtn = document.querySelector('[data-replay-intro]');
  if (replayBtn) {
    replayBtn.addEventListener('click', replay);
  }

  if (shouldSkipIntro()) {
    const overlay = document.querySelector<HTMLElement>('[data-intro-overlay]');
    if (overlay) overlay.style.display = 'none';
    return;
  }

  // Start after first paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      start();
    });
  });
}

window.addEventListener('resize', resize);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

document.addEventListener('astro:after-swap', init);

export { sampleTextToDots, skip, replay };
