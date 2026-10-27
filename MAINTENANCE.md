# Portfolio maintenance

Maintain the existing public GitHub Pages portfolio in `DevilishDagon/portfolio`.

## Editorial requirements

- Use **DevilishDagon** consistently and retain the explicit privacy-alias explanation.
- Review current source, documentation and release evidence before changing a claim. Preserve the difference between implemented code, a prototype, a deployed service and a device-verified result.
- Keep major projects as substantial case studies covering purpose, workflow, implementation choices, current scope and limits. Update the existing collection; do not replace it with an unrelated redesign.
- Keep private application source, secrets, customer/employee information, personal health/finance records, private messages and campaign secrets out of this public repository.
- Include new substantial projects when evidence and public-safe material are available. Do not turn every generated file into a project.

## Images

- Prefer a new capture from the current interface with public example data or an isolated, sanitized fixture. Never connect a screenshot harness to real accounts or production writes.
- Review the pixels before publication. Use original project artwork and firmware renders when appropriate. Do not use generated fake interfaces or fabricated device photographs.
- Every media entry needs `src`, `kind`, `caption` and its real `capturedAt` date. Reusing an older image does not make it newly captured. Keep accurate dates and describe unavailable screenshots honestly.
- Diagrams are labelled diagrams. Documentation previews are not application screenshots. Firmware renders are not device photographs. Preserve manual animation controls.
- Maintain the compatibility `images` list in the same order as `media`.

## Delivery

1. Fetch current `main` and preserve unrelated edits. Inspect repository visibility before selecting public links.
2. Update `projects.json`, reviewed assets and any date shown in the page. Set `reviewedAt` only after substantive source review.
3. Run `node scripts/build-directory.mjs`, `node scripts/check.mjs` and `node --check app.js`.
4. Check the affected desktop/mobile views, case-study open/close, search/filter behavior and image loading. Inspect each new image for private data and accurate labels.
5. Commit and push only the public portfolio changes. If using GitHub Git Data APIs, create a tree based on the current head, create the commit and update `main` without force; use an expected-head lease when available. Never overwrite concurrent changes.
6. Wait for the matching GitHub Pages deployment and verify the changed live content. A push alone is not a deployment.

If there is no substantive change, keep the content and image dates unchanged. A failed source or image capture is not permission to fabricate a replacement. Report a blocker only when it needs attention.
