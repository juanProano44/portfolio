# Launch Checklist

## Pre-launch

- [ ] Domain registered and DNS configured
- [ ] `terraform apply` successful — S3, CloudFront, ACM, OIDC all provisioned
- [ ] ACM certificate validated and active
- [ ] Deploy workflow runs successfully on merge to main
- [ ] `www.jupdev44.dev` redirects to `jupdev44.dev`
- [ ] All content reviewed by Juan in both EN and ES
- [ ] No confidential information (employer name, phone, references) on the site
- [ ] Case studies verified — no NDA violations

## Accessibility

- [ ] axe-core automated audit: 0 violations
- [ ] Keyboard-only navigation pass: all frames reachable
- [ ] Screen reader pass (VoiceOver + NVDA)
- [ ] Focus visible on all interactive elements in both themes
- [ ] `prefers-reduced-motion` honored — no animations
- [ ] Contrast ratios verified on all token pairs (AA minimum)

## Performance

- [ ] Lighthouse mobile: 95+ in all categories
- [ ] LCP ≤ 2.0s
- [ ] CLS ≤ 0.05
- [ ] INP ≤ 200ms
- [ ] TBT ≤ 150ms
- [ ] Critical path ≤ 100KB gzip
- [ ] Three.js chunk ≤ 180KB gzip
- [ ] Fonts ≤ 60KB total
- [ ] 60fps on mid-range phone (intro and dot field)

## Cross-browser

- [ ] Chrome (last 2 versions)
- [ ] Safari (last 2 versions)
- [ ] Firefox (last 2 versions)
- [ ] Edge (last 2 versions)
- [ ] iOS Safari (real device)
- [ ] Android Chrome (real device)

## Content & SEO

- [ ] `sitemap.xml` valid
- [ ] `robots.txt` correct
- [ ] JSON-LD Person markup valid
- [ ] Open Graph previews correct (test with Facebook debugger)
- [ ] Twitter card previews correct
- [ ] `hreflang` alternates correct
- [ ] Canonical URLs correct

## Post-launch

- [ ] Social previews verified
- [ ] LinkedIn profile updated with URL
- [ ] GitHub profile updated with URL
- [ ] CV updated with portfolio URL
- [ ] Visual regression baselines saved
