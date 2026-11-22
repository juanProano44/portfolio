/**
 * Path helpers for Astro `base` (e.g. /portfolio/).
 */

/** Path with Astro base prefix: `/portfolio/en/` */
export function withBase(path: string): string {
  const baseRaw = import.meta.env.BASE_URL;
  const base = baseRaw.endsWith('/') ? baseRaw : `${baseRaw}/`;
  const segment = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${segment}`;
}

/** Absolute URL for SEO (origin + base + path). */
export function absoluteUrl(path: string, origin: string): string {
  const relative = withBase(path);
  return new URL(relative, origin).href;
}