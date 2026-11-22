import { describe, expect, it } from 'vitest';
import { codeAvailabilityBadgeClass, codeAvailabilityLabel } from '@/lib/projects';

describe('projects helpers', () => {
  it('maps code availability labels per locale', () => {
    expect(codeAvailabilityLabel('en', 'Public')).toBe('Public');
    expect(codeAvailabilityLabel('es', 'On request')).toBe('Bajo solicitud');
  });

  it('builds stable badge class names', () => {
    expect(codeAvailabilityBadgeClass('On request')).toBe('badge-on-request');
    expect(codeAvailabilityBadgeClass('Private')).toBe('badge-private');
  });
});