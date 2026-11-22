export type Lang = 'en' | 'es';

export const defaultLang: Lang = 'en';

export const ui = {
  en: {
    'nav.identity': 'Identity',
    'nav.work': 'Work',
    'nav.stack': 'Stack',
    'nav.experience': 'Experience',
    'nav.lab': 'Lab',
    'nav.contact': 'Contact',
    'hero.role': 'Full Stack Developer · AWS · Cloud Deployment',
    'hero.location': 'Quito, Ecuador',
    'hero.cta.contact': 'Get in touch',
    'hero.cta.work': 'View my work',
    'work.title': 'Work',
    'work.codeAvailability.Public': 'Public',
    'work.codeAvailability.Private': 'Private',
    'work.codeAvailability.On request': 'On request',
    'work.caseStudy.toggle': 'View case study',
    'work.caseStudy.role': 'Role',
    'work.caseStudy.problem': 'Problem',
    'work.caseStudy.decisions': 'Key decisions',
    'work.caseStudy.outcome': 'Outcome',
    'work.kpis.title': 'Impact metrics',
    'stack.title': 'Stack',
    'experience.title': 'Experience',
    'experience.education': 'Education',
    'experience.leadership': 'Leadership',
    'lab.title': 'Lab',
    'lab.description': 'Interactive experiments and explorations.',
    'contact.title': 'Contact',
    'contact.email.copy': 'Copy email',
    'contact.email.copied': 'Copied!',
    'contact.cta': "Let's work together",
    'footer.replay': 'Replay intro',
    'footer.source': 'View source',
    'intro.skip': 'Skip intro',
    'theme.toggle': 'Toggle theme',
    'lang.switch': 'Español',
    'lang.switchTo': 'es',
    'opensource.title': 'Open Source',
  },
  es: {
    'nav.identity': 'Identidad',
    'nav.work': 'Trabajo',
    'nav.stack': 'Stack',
    'nav.experience': 'Experiencia',
    'nav.lab': 'Lab',
    'nav.contact': 'Contacto',
    'hero.role': 'Desarrollador Full Stack · AWS · Despliegue en la Nube',
    'hero.location': 'Quito, Ecuador',
    'hero.cta.contact': 'Contáctame',
    'hero.cta.work': 'Ver mi trabajo',
    'work.title': 'Trabajo',
    'work.codeAvailability.Public': 'Público',
    'work.codeAvailability.Private': 'Privado',
    'work.codeAvailability.On request': 'Bajo solicitud',
    'work.caseStudy.toggle': 'Ver caso de estudio',
    'work.caseStudy.role': 'Rol',
    'work.caseStudy.problem': 'Problema',
    'work.caseStudy.decisions': 'Decisiones clave',
    'work.caseStudy.outcome': 'Resultado',
    'work.kpis.title': 'Métricas de impacto',
    'stack.title': 'Stack',
    'experience.title': 'Experiencia',
    'experience.education': 'Educación',
    'experience.leadership': 'Liderazgo',
    'lab.title': 'Lab',
    'lab.description': 'Experimentos interactivos y exploraciones.',
    'contact.title': 'Contacto',
    'contact.email.copy': 'Copiar email',
    'contact.email.copied': '¡Copiado!',
    'contact.cta': 'Trabajemos juntos',
    'footer.replay': 'Repetir intro',
    'footer.source': 'Ver código fuente',
    'intro.skip': 'Saltar intro',
    'theme.toggle': 'Cambiar tema',
    'lang.switch': 'English',
    'lang.switchTo': 'en',
    'opensource.title': 'Código Abierto',
  },
} as const;

export type UiKey = keyof (typeof ui)['en'];

export function t(lang: Lang, key: UiKey): string {
  return ui[lang][key] ?? ui[defaultLang][key] ?? key;
}

export function getLangFromUrl(url: URL): Lang {
  const parts = url.pathname.split('/').filter(Boolean);
  const lang = parts.find((p) => p === 'en' || p === 'es');
  if (lang === 'en' || lang === 'es') return lang;
  return defaultLang;
}
