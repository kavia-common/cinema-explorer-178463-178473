# KAVIA Plan - Movie Frontend (Royal Purple Theme)

- K (Knowns)
  - Existing CRA React app present.
  - Goal: Minimal homepage with Header/Footer, "Welcome to MovieAI", Featured + Trending placeholders.
  - TailwindCSS required with Royal Purple palette: primary #8B5CF6, secondary #6B7280, background #F3E8FF, text #374151.

- A (Assumptions)
  - CRA will be used (no Vite migration).
  - Public index.html exists in CRA template (not modified here).
  - No data fetching or APIs added in this step.

- V (Variables / Risks)
  - Test failures if default CRA tests look for "learn react" (mitigated by updating tests).
  - Missing `logo.svg` import in prior App could break build (mitigated by removing).
  - Tailwind versions must match PostCSS 8 (picked compatible versions).

- I (Implementation)
  - Add Tailwind: devDependencies, `postcss.config.js`, `tailwind.config.js`.
  - Use Royal Purple theme via Tailwind `theme.extend.colors`.
  - Replace CSS with Tailwind directives in `src/index.css`.
  - Implement Header, Footer, SectionCard components.
  - Replace App with Welcome hero, Featured + Trending cards, and Trending placeholder grid.
  - Update tests to assert "Welcome to MovieAI".

- A (Actions Taken)
  - Edited package.json devDependencies.
  - Added Tailwind and PostCSS configs.
  - Styled Homepage using Tailwind utilities and elegant gradient.
  - Created docs/KAVIA.md documenting this plan.
