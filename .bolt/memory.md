# Project memory

## Product intent & audience

- **ReguLens** — a compliance clause checker for regulatory professionals and legal/compliance teams.
- Users paste a policy clause, select a framework (SEC Item 404 or GDPR Article 5), and receive a compliance score, gap explanation, cited evidence, and an auto-rewritten clause.
- B2B SaaS positioning; purpose-built for regulatory text analysis.

## Brand personality & voice

- Professional, authoritative, regulatory-focused.
- Plain-language explanations alongside precise regulatory citations.
- Trustworthy and precise — no marketing fluff in the UI.

## Visual design & UX direction

- Dark B2B-SaaS aesthetic carried over from original Streamlit design.
- Key UI components: compliance score ring (percentage + status: Compliant / Partial / Non-compliant), gap-explanation panel, evidence panel with regulatory clause text, recommended-revision panel with copy-to-clipboard.
- Framework selector + text input as the primary interaction entry point.
- React + Vite stack; single-page app layout.

## Decisions, constraints & rationale

- Original project was Streamlit/Python — cannot run in this environment (requires Vite-based web app with `package.json`).
- Rebuilt as React + Vite app preserving the same compliance logic and dark UI.
- `frontend-fallback` folder was empty; no prior `package.json` existed — full rebuild required.
- Compliance scoring: binding language ("shall", "must") scores higher; permissive language ("may", "can") lowers score.
- Evidence panel reuses real SEC and GDPR clause text from existing project data files.
- Build verified to compile cleanly; dev server auto-runs in environment.

## Open questions & assumptions

- Assumed existing data files contained authoritative SEC/GDPR clause text — worth verifying against source regulations.
- Scoring logic is heuristic (binding vs permissive keywords); deeper semantic compliance checks not yet implemented.
- Whether additional frameworks beyond SEC Item 404 and GDPR Article 5 are planned.
- Whether clause revision rewriting should use more sophisticated NLP rather than simple keyword replacement.
- No backend persistence — all analysis is client-side; unclear if history or saving results is needed.