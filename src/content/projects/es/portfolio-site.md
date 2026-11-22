---
title: 'Portafolio de Desarrollo'
summary: 'Este sitio — aplicación Astro estática con i18n, navegación por secciones, animación de intro y controles de calidad en CI.'
stack: ['Astro', 'TypeScript', 'Canvas 2D', 'Three.js', 'Terraform', 'GitHub Actions']
role: 'Diseñador y Desarrollador'
problem: 'Mostrar trabajo fintech y freelance privado con evidencia de calidad de ingeniería — presupuestos de rendimiento, accesibilidad y contenido mantenible — sin exponer código confidencial.'
decisions:
  - title: 'Content collections con Zod'
    description: 'Todo el copy y los KPIs viven en frontmatter markdown tipado, validado en build para evitar divergencias entre inglés y español.'
  - title: 'Experimentos con carga diferida'
    description: 'Three.js y scripts pesados cargan solo cuando el frame Lab entra al viewport, manteniendo el critical path pequeño.'
  - title: 'Controles de calidad automatizados'
    description: 'CI ejecuta typecheck, lint, tests unitarios, presupuestos Lighthouse y flujos Playwright en cada cambio.'
outcome: 'Un portafolio bilingüe que demuestra pensamiento de producto y disciplina de ingeniería, con código fuente público.'
kpis:
  - label: Lighthouse (móvil)
    value: 95+ en todas las categorías
  - label: Ruta crítica
    value: ~25 KB gzip
  - label: Idiomas
    value: Inglés + español
  - label: Código
    value: Público en GitHub
codeAvailability: 'Public'
featured: false
order: 5
lang: 'es'
---

## Contexto

Construido como la cara pública del trabajo de Juan José Proaño: casos de estudio para repos privados, métricas donde los NDA lo permiten, y este repositorio como implementación de referencia.

## Destacados de ingeniería

- Astro 7 output estático, TypeScript estricto, ESLint + Prettier
- `withBase()` para GitHub Pages bajo `/portfolio`
- Vitest para utilidades i18n; Playwright para navegación y smoke tests de a11y
- Infraestructura en Terraform (S3, CloudFront, ACM, OIDC) con workflow opcional de deploy en AWS