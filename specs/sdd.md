# Portfolio SDD: Juan Proaño

Spec-driven development pack for Juan José Proaño's developer portfolio. Version 0.1, built from the CV and the answers in chat. Items marked **\[CONFIRM\]** are assumptions that need a yes or a change before the plan is frozen.

How to use this: read top to bottom, answer the open questions in section 6, and then the tasks in section 5 become the build order. Each part has to be approved before the next one is treated as final: Constitution → Spec → Plan → Tasks → Implementation.

## 1. Constitution

These rules win over any later feature idea. If a feature breaks one, the feature changes, not the rule.

1. **Content first.** Everything a recruiter or client needs (who you are, what you build, how to contact you) exists as real HTML that works with no JavaScript and no animation. The visual experience is an enhancement layered on top.
2. **Performance is a feature.** The budgets in section 2.4 are release gates. A pretty effect that breaks a budget is cut or lazy-loaded.
3. **Accessible by default.** WCAG 2.2 AA in both themes, full keyboard use, and a calm path for anyone who sets reduced motion.
4. **Never block the visitor.** No intro or animation may delay reading or clicking. Every animated moment is skippable and runs at most once per session.
5. **Honest content.** No invented metrics, no claims about private work that can't be backed up. If a result isn't verified, it isn't published.
6. **Respect confidentiality.** The employer appears only as "a fintech company". No client names, internal screenshots, private code, references or phone numbers on the public site.
7. **Simple stack, strong engineering.** Few dependencies, strict TypeScript, automated checks on every change. The repository itself is part of the portfolio.
8. **Black and white with intent.** A monochrome system, light and dark, where contrast, type and motion carry the personality instead of color.

## 2. Specification (the what and why)

### 2.1 Purpose and audience

**Purpose:** show who Juan is, what he can build end to end, and make it easy to start a conversation.

**Primary audiences**

- **Recruiters and hiring managers.** They spend under a minute. They want role, stack, proof of experience and a way to contact you, fast.
- **Freelance clients.** They want to know whether you can solve their problem, how you work, and how to reach you.

**Positioning:** full stack developer with strong cloud and deployment experience (AWS, Terraform, CI/CD), who communicates well and understands what people need. The architecture and project-management direction shows through how case studies explain decisions.

### 2.2 User stories and acceptance criteria

**US-01: Recruiter understands me in 10 seconds.**

- Given a visitor lands on the page, when it first renders, then name, role line, location and two actions (contact, view work) are visible without scrolling or interacting.
- The role line mentions full stack, AWS and cloud deployment.

**US-02: Visitor explores my work.**

- Given the work section, then each project has a card with title, one-line summary, stack and a code-availability label (Public, Private, On request).
- Opening a project shows a case study with: context, my role, problem, key decisions, architecture diagram, outcome (verified only), and stack.

**US-03: Visitor can contact me in one step.**

- Email and links (GitHub, LinkedIn) are reachable from every view, with a visible call to action.
- The email is a plain `mailto:` link. There is no form.
- Copying the address is one click, with a visible confirmation.

**US-04: Visitor chooses a theme.**

- Default follows the system setting. A toggle switches light and dark, and the choice persists.
- No flash of the wrong theme on load.

**US-05: Visitor reads in their language.**

- English and Spanish versions with a language switch, correct `hreflang` and the choice remembered **\[CONFIRM: EN default, ES secondary\]**.

**US-06: Visitor experiences the signature intro.**

- Given a first visit on a capable device, then dots form "JP", rearrange into the portfolio layout, and simulated cursors "assemble" the page, in at most 4 seconds.
- A Skip control is the first focusable element and works at any moment.
- The intro does not run on return visits in the same session, with reduced motion, with data-saver on, or on low-power devices. In those cases the page appears directly.

**US-07: Visitor finds a living, interactive element.**

- The page has at least one persistent interactive piece after the intro (cursor-reactive dots and a Three.js piece, see 2.3) that responds to pointer and touch and is skippable by keyboard.

**US-08: Visitor on a phone has a first-class experience.**

- Layout is fully usable at 360 px wide. The intro is simplified on mobile.

**US-09: Search and sharing.**

- Link previews show a proper image, title and description. Search engines get structured data about me.

### 2.3 Functional requirements

**Structure and navigation**

- **FR-01** The site is one bounded "canvas" (a board of named frames), not an endless scroll and not scroll-driven storytelling. Suggested frames: Identity, Work, Stack, Experience, Lab, Contact.
- **FR-02** Moving between frames is by click, keyboard (arrow keys, Tab, shortcut hints) and touch, using a short focus transition. Each frame has its own URL hash (`#work`).
- **FR-03** On narrow screens or with no JS, the same content appears as a normal vertical page in the same order.
- **FR-04** A persistent minimal header holds the name mark, frame navigation, language switch, theme toggle and the contact call to action.

**Content**

- **FR-05** Content lives in typed data files (frontmatter or JSON, validated), one set per language. No copy is hard-coded in components.
- **FR-06** Experience, skills and education come from the CV, with the fintech named only as "a fintech company".
- **FR-07** Each case study is a content entry that follows the template in US-02.
- **FR-08** An "Open source" strip lists public GitHub repositories chosen by me, with a short description each. Pinned manually, not auto-fetched, to avoid runtime API calls.

**Signature experience**

- **FR-09** Intro: a canvas samples the shape of "JP" from the display typeface into dots. Dots then move to positions that outline the frames of the board, and the real DOM content fades in beneath them.
- **FR-10** "Builders": 3 to 4 simulated cursors with small role labels (Design, Frontend, Cloud, QA) place and "drag" frames into position during the last second of the intro. It is a visual metaphor only and does not use a real MCP.
- **FR-11** After the intro, a low-cost dot field in the background reacts to the pointer. It pauses when the tab is hidden or the user has reduced motion on.
- **FR-12** Three.js appears in the **Lab** frame only: one interactive 3D piece, loaded lazily when the frame is near view or on a click. **Default concept \[CONFIRM\]:** a monochrome wireframe model of a cloud architecture (VPC, compute, storage, DNS, events) that you can orbit and click to read short notes on each part. It has a static image fallback.
- **FR-13** A "replay intro" control exists in the footer for people who want to see it again.

**Contact and sharing**

- **FR-14** Contact frame: email, GitHub and LinkedIn only. No budget, rates or personal phone number.
- **FR-15** Generated Open Graph image per language, `sitemap.xml`, `robots.txt`, canonical URLs, and JSON-LD `Person` markup.

### 2.4 Non-functional requirements (release gates)

| Area | Requirement |
| --- | --- |
| Lighthouse (mobile, throttled) | 95+ in Performance, Accessibility, Best Practices, SEO |
| Core Web Vitals | LCP ≤ 2.0 s, CLS ≤ 0.05, INP ≤ 200 ms, TBT ≤ 150 ms |
| Critical path | HTML + CSS + JS ≤ 100 KB gzip before the intro starts |
| Fonts | Max 2 families, WOFF2 subsets, ≤ 60 KB total, `font-display: swap` with metric-matched fallback |
| Lazy chunks | Three.js chunk ≤ 180 KB gzip, loaded only for the Lab frame |
| Images | AVIF/WebP with dimensions set, no layout shift |
| Frame rate | Intro and dot field hold 60 fps on a mid-range phone, with automatic quality step-down below 45 fps |
| Accessibility | WCAG 2.2 AA in both themes, visible focus, contrast checked on every token pair, `prefers-reduced-motion` honored, canvas is decorative (`aria-hidden`) |
| Privacy | No cookies and no third-party trackers. Optional cookie-less analytics under 3 KB |
| Security | HTTPS only, HSTS, strict CSP, no inline scripts except a nonce/hash-approved theme snippet |
| Browsers | Last 2 versions of Chrome, Safari, Firefox, Edge. iOS Safari and Android Chrome are tested on real devices |

### 2.5 Content inventory (source: CV)

- **Identity:** Juan José Proaño, Quito, Ecuador. Full stack developer, AWS and cloud deployment.
- **Experience:** Developer at a fintech company (2025–2026 **\[CONFIRM exact dates\]**); freelance developer (e-learning platform frontend with React, Meta API integration with a CRM using sockets); intern building the EPN incubator website with WordPress.
- **Leadership:** IEEE EPN Computer Science Chapter (Webmaster / Event Manager, 2024–2025); Imagen Sistemas group leader (2022–2025, 15+ students).
- **Education:** B.S. Software Engineering, Escuela Politécnica Nacional, 2021–2026.
- **Skills:** React, TypeScript, Expo, Three.js; NestJS, Node.js; PostgreSQL, SQL Server; AWS (EC2, S3, Route 53, EventBridge, IAM, VPC), Terraform, Docker, GitHub Actions; Jest, Postman, Figma, Jira, Dify, SonarQube; Agile, microservices, KISS; Spanish native, English B2.
- **Left out on purpose:** references, phone number, employer name.

### 2.6 Handling private work

Because most of the work is in private repositories, the portfolio proves skill through explanation instead of code:

1. **Case studies** with sanitized architecture diagrams you redraw yourself (no internal names or screenshots), the decisions you made and why, and verified outcomes.
2. A **code-availability label** on each project so private work looks intentional, not hidden.
3. **The site itself as a case study**: public repository, Terraform, CI pipeline and performance reports linked from the Lab or Work frame.
4. **Frag Agency** (the TIC component library and demo site) as the public-leaning example, if your team agrees to link it.
5. Backlog, not v1: one or two small public repos that show quality (for example a tested NestJS starter or a Terraform module for a static site on CloudFront).

Before publishing any case study, confirm you are allowed to describe the work under your contract or NDA.

### 2.7 Out of scope for v1

Blog, CMS, contact form, comments, auto-fetched GitHub data, a real MCP integration, and public pricing.

### 2.8 Concept assessment (honest notes)

The idea (dots form JP, rearrange into the layout, cursors build the site) is distinctive and fits the "living" goal. Three conditions keep it from hurting you:

- **No fake loading.** A loader that delays content on purpose makes recruiters leave. The intro is a capped 4 s overlay, content is already in the HTML and the user can skip it. It starts as soon as the first paint happens.
- **Run once, then get out of the way.** The call to action has to be visible by the time the intro ends. A great animation with no clear next step wastes the attention it earned.
- **Metaphor, not gimmick.** The "builders" cursors work because they match your story (full stack: design, frontend, cloud, QA). Keep the labels and the timing tight.

## 3. Plan (the how)

### 3.1 Stack decisions

| ID | Decision | Reason |
| --- | --- | --- |
| D-01 | **Astro** (static output) + **TypeScript strict** | Ships HTML first, near-zero JS by default, content collections give typed content |
| D-02 | Interactivity in small **vanilla TS modules** (no UI framework in the critical path) | Keeps the 100 KB budget. React is allowed later for isolated islands if needed |
| D-03 | **CSS custom properties** for design tokens, plain modern CSS (container queries, `:has`, `color-scheme`, View Transitions API) | No runtime cost, theming is simple |
| D-04 | Intro and dot field on **Canvas 2D** with a tiny custom particle system and `OffscreenCanvas` + worker where supported | Lighter than loading WebGL for 1–3k dots |
| D-05 | **Three.js** only in the Lab frame, dynamic `import()`, tree-shaken | Meets the lazy-chunk budget and the "somewhere" requirement |
| D-06 | Motion: CSS, Web Animations API and View Transitions. No GSAP unless the timeline work proves too complex | Fewer dependencies |
| D-07 | i18n through Astro routing: `/en/` and `/es/`, shared typed content schema | Good SEO, no client-side language logic |
| D-08 | Fonts: one display face and one text/mono face, self-hosted, subset **\[CONFIRM faces after design pass\]** | Identity without weight |
| D-09 | Tests: Vitest (unit), Playwright (flows), axe-core (a11y), Lighthouse CI (budgets), visual snapshots in light and dark | Quality gates are automated |
| D-10 | **Hosting and domain \[CONFIRM\]:** domain registered at Cloudflare Registrar (at cost, DNS, free email routing for an address on your own domain); site hosted on **AWS S3 + CloudFront** with ACM certificate, defined in **Terraform**, deployed by GitHub Actions through OIDC | Doubles as proof of your AWS, Terraform and CI/CD skills. Fallback: Cloudflare Pages if you want zero infrastructure |
| D-11 | Domain candidates: `jupdev44.dev` first, with 2 alternatives chosen if it's taken **\[CONFIRM\]**. `.dev` is HTTPS-only (HSTS preloaded), so the certificate must be live before launch | Prices change, so check at purchase |

### 3.2 Architecture

```
/src
  /content      typed content per language (experience, skills, case studies)
  /layouts      base layout, theme script, SEO head
  /components   static Astro components (frames, cards, nav)
  /scripts      board.ts (navigation), intro.ts, dots.ts, lab.ts (lazy)
  /styles       tokens.css, base.css, themes.css
/infra          Terraform (S3, CloudFront, ACM, OIDC role)
/tests          unit, e2e, a11y, visual
/.github        workflows (ci, lighthouse, deploy)
/specs          this SDD (constitution, spec, plan, tasks)
```

### 3.3 Key technical designs

**Board and navigation.** Each frame is a `<section>` in the DOM in reading order. With JS and a wide viewport, CSS places them on a bounded board and `board.ts` moves a camera transform between frames, updates the hash, and moves focus to the frame heading. Without JS or on small screens, the sections stack normally. No scroll hijacking.

**Theme.** A tiny inline snippet (hash-approved in the CSP) sets `data-theme` before first paint from storage or system preference. Tokens are defined once for light and dark with checked contrast ratios. Use soft off-black and off-white values and a few grays so the monochrome look stays readable.

**Intro pipeline.**

1. Static HTML paints (name, role, calls to action). The overlay canvas starts after first paint.
2. Render "JP" to an offscreen canvas in the display font, sample pixels into N dots (about 1,500 desktop, 700 mobile).
3. Phase A (about 1.2 s): dots drift in and settle into "JP".
4. Phase B (about 1.3 s): dots move to target positions along the frame outlines, read from the real layout rectangles so it always matches the page.
5. Phase C (about 1.2 s): builder cursors move to frame corners and "place" them while real content fades in.
6. Overlay is removed and the interaction layer starts. A frame-time monitor lowers dot count if fps drops.

**Lab (Three.js).** Dynamic import behind an `IntersectionObserver` or a click on the poster image. Fixed pixel ratio cap of 2, shared renderer disposed on leave, no postprocessing. Static fallback image for WebGL failure or reduced motion.

**Contact.** `mailto:` link plus copy-to-clipboard button. The address is built at runtime from parts to cut scraping, with a no-JS fallback that shows the address as text.

### 3.4 Delivery pipeline

- **On every pull request:** type check, lint, unit tests, build, Playwright and axe, Lighthouse CI against budgets, visual snapshot diff, link check.
- **On merge to main:** build, Terraform plan check, `aws s3 sync` with long-cache for hashed assets and short-cache HTML, CloudFront invalidation, post-deploy smoke test.
- **Security:** GitHub OIDC role scoped to the one bucket and distribution, no long-lived keys.

## 4. Quality plan

- **Budgets as code:** Lighthouse CI assertions and a bundle-size check fail the build when section 2.4 is broken.
- **Manual checks before launch:** real iPhone and Android phone, a low-end device, keyboard-only pass, screen reader pass (VoiceOver and NVDA), reduced-motion pass, light/dark pass, slow 4G pass.
- **Definition of done for any task:** acceptance criteria met, tests added, budgets green, no new a11y violations, content reviewed in both languages.

## 5. Tasks (build order)

Each task is small enough to finish in one sitting and ends with something testable.

**Phase 0: Foundations**

- T-001 Create the repo (public), Astro + strict TypeScript, ESLint, Prettier, editorconfig. *Done when:* `build` and `lint` pass locally.
- T-002 Add GitHub Actions CI (type check, lint, build). *Done when:* a pull request shows green checks.
- T-003 Add Lighthouse CI with the section 2.4 budgets and a bundle-size check. *Done when:* a deliberate oversize import fails the pipeline.
- T-004 Store this SDD in `/specs` and keep it updated as decisions change.

**Phase 1: Content and design**

- T-010 Define content schema and write EN content from the CV (experience, education, skills, leadership). *Done when:* schema validation passes at build.
- T-011 Write the three to four case studies using the template in US-02, with only verified outcomes and no confidential details. *Done when:* each is reviewed against the confidentiality rule.
- T-012 Translate to ES. Copy follows the voice of your LinkedIn About and gets an editing pass to remove generic AI-sounding phrasing. *Done when:* both languages are reviewed by you.
- T-013 Design tokens and layout in Figma: type scale, grays, spacing, frame board, light and dark, mobile. *Done when:* contrast table passes AA for every token pair.
- T-014 Choose the typefaces and subset them. *Done when:* the font budget is met.

**Phase 2: Static site (works with no JS)**

- T-020 Base layout, theme script, tokens, theme toggle. *Done when:* no flash of wrong theme in a test.
- T-021 Build all frames as semantic static sections in both languages. *Done when:* the page is fully readable with JS disabled.
- T-022 SEO: meta, Open Graph image generation, sitemap, robots, canonical, hreflang, JSON-LD. *Done when:* a validator shows no errors.
- T-023 Contact frame with `mailto:` and copy button. *Done when:* an e2e test copies the address and shows confirmation.
- T-024 Responsive pass at 360, 768, 1280, 1920 px. *Done when:* no horizontal scroll and no layout shift.

**Phase 3: Board navigation**

- T-030 Frame-to-frame camera transition with hash routing, keyboard controls and focus management. *Done when:* the board works by keyboard only and back/forward buttons behave.
- T-031 Fallback to stacked layout for no-JS and narrow screens. *Done when:* tests pass in both modes.

**Phase 4: Signature intro**

- T-040 Text-to-dots sampler for "JP" with unit tests. *Done when:* dot count and bounds are deterministic.
- T-041 Phases A and B with the layout-driven targets. *Done when:* the end positions match the real frame rectangles.
- T-042 Builder cursors (Phase C) and the content reveal. *Done when:* the whole intro takes 4 s or less.
- T-043 Skip control, once-per-session logic, reduced-motion, data-saver and low-power fallbacks, fps step-down. *Done when:* each fallback has an e2e test.
- T-044 Pointer-reactive dot field and the replay-intro control. *Done when:* idle CPU use is near zero and it pauses on a hidden tab.

**Phase 5: Lab (Three.js)**

- T-050 Prototype the 3D piece (default: wireframe cloud architecture) in an isolated page. *Done when:* it runs at 60 fps on a mid-range phone.
- T-051 Lazy-load into the Lab frame with a poster and a WebGL-fail fallback. *Done when:* the Three.js chunk loads only after the trigger and stays within budget.

**Phase 6: Infrastructure and launch**

- T-060 Buy the domain, set DNS. *Done when:* the domain resolves to a placeholder.
- T-061 Terraform: S3 (private), CloudFront with OAC, ACM certificate, security headers policy (HSTS, CSP), OIDC deploy role. *Done when:* `terraform apply` creates a working HTTPS site.
- T-062 Deploy workflow and smoke test. *Done when:* a merge to main updates the live site and invalidates the cache.
- T-063 Email address on your own domain with forwarding **\[CONFIRM\]** and cookie-less analytics **\[CONFIRM\]**.

**Phase 7: Hardening and release**

- T-070 Full a11y audit (axe plus manual screen reader and keyboard).
- T-071 Performance audit on real devices, and fixes until every gate in 2.4 is green.
- T-072 Visual regression baselines in light and dark.
- T-073 Launch checklist: redirects (`www`), 404 page, social previews, share on LinkedIn and GitHub profile, add the URL to the CV.

## 6. Open questions and assumptions

**Need your answer**

1. **Fintech dates.** The CV says 2025–2026. For the portfolio, which start and end month should appear?
2. **Languages.** Confirm English default plus Spanish. Should the site start in English even for Spanish browsers?
3. **Hosting.** Is the AWS + Terraform route (D-10) fine, or do you prefer the zero-infrastructure Cloudflare Pages route?
4. **Domain.** Which two alternatives if `jupdev44.dev` is taken?
5. **Case studies.** Which three or four will you feature, and are you allowed to describe them under your contract?
6. **Frag Agency.** Is the repo public, and may it be linked as a project?
7. **Email.** Use your Hotmail address or a new one on your own domain?
8. **Lab piece.** Is the cloud-architecture 3D model the right Three.js idea, or do you prefer something else (for example, the JP dots as a 3D particle form)?
9. **Timeline.** Any target launch date? The task list has no dates yet.

**Assumptions I made** (change any of them)

- No blog in v1, no contact form, no budget shown.
- The repository is public.
- Analytics, if any, is cookie-less and optional.
- The intro is a visual metaphor only.
- Phone number and references are not published.
