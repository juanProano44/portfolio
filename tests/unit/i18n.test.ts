import { describe, it, expect } from 'vitest';
import { t, getLangFromUrl, defaultLang } from '@/scripts/i18n';

describe('i18n', () => {
  it('returns English translations', () => {
    expect(t('en', 'nav.work')).toBe('Work');
    expect(t('en', 'hero.role')).toContain('Full Stack');
  });

  it('returns Spanish translations', () => {
    expect(t('es', 'nav.work')).toBe('Trabajo');
    expect(t('es', 'hero.role')).toContain('Desarrollador');
  });

  it('defaults to English', () => {
    expect(defaultLang).toBe('en');
  });

  it('extracts language from URL', () => {
    expect(getLangFromUrl(new URL('https://example.com/en/'))).toBe('en');
    expect(getLangFromUrl(new URL('https://example.com/es/'))).toBe('es');
    expect(getLangFromUrl(new URL('https://example.com/fr/'))).toBe('en');
    expect(getLangFromUrl(new URL('https://example.com/'))).toBe('en');
  });
});
