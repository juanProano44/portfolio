import type { Lang } from '@/scripts/i18n';
import { t, type UiKey } from '@/scripts/i18n';

export type CodeAvailability = 'Public' | 'Private' | 'On request';

const codeAvailabilityKeys: Record<CodeAvailability, UiKey> = {
  Public: 'work.codeAvailability.Public',
  Private: 'work.codeAvailability.Private',
  'On request': 'work.codeAvailability.On request',
};

export function codeAvailabilityLabel(lang: Lang, availability: CodeAvailability): string {
  return t(lang, codeAvailabilityKeys[availability]);
}

export function codeAvailabilityBadgeClass(availability: CodeAvailability): string {
  const slug = availability.toLowerCase().replaceAll(' ', '-');
  return `badge-${slug}`;
}