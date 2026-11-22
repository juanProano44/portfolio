---
title: 'Developer Portfolio'
summary: 'This site — static Astro app with i18n, board navigation, intro animation, and quality gates in CI.'
stack: ['Astro', 'TypeScript', 'Canvas 2D', 'Three.js', 'Terraform', 'GitHub Actions']
role: 'Designer & Developer'
problem: 'Present private fintech and freelance work with proof of engineering quality — performance budgets, accessibility, and maintainable content — without exposing confidential code.'
decisions:
  - title: 'Content collections with Zod'
    description: 'All copy and KPIs live in typed markdown frontmatter, validated at build time to prevent drift between English and Spanish.'
  - title: 'Lazy-loaded experiments'
    description: 'Three.js and heavy scripts load only when the Lab frame enters the viewport, keeping the critical path small.'
  - title: 'Automated quality gates'
    description: 'CI runs typecheck, lint, unit tests, Lighthouse budgets, and Playwright flows on every change.'
outcome: 'A bilingual portfolio that demonstrates product thinking and engineering discipline, with public source code.'
kpis:
  - label: Lighthouse (mobile)
    value: 95+ all categories
  - label: Critical path
    value: ~25 KB gzip
  - label: Locales
    value: English + Spanish
  - label: Source
    value: Public on GitHub
codeAvailability: 'Public'
featured: false
order: 5
lang: 'en'
---

## Context

Built as the public face of Juan José Proaño's work: case studies for private repos, metrics where NDAs allow, and this repository as a reference implementation.

## Engineering highlights

- Astro 7 static output, strict TypeScript, ESLint + Prettier
- `withBase()` for GitHub Pages under `/portfolio`
- Vitest for i18n utilities; Playwright for navigation and a11y smoke tests
- Infrastructure defined in Terraform (S3, CloudFront, ACM, OIDC) with optional AWS deploy workflow