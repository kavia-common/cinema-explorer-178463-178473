# Design Plan - Elegant Royal Purple Theme

## Palette
- Primary: #8B5CF6 (Royal Purple)
- Secondary: #6B7280 (Slate gray)
- Background: #F3E8FF (Lavender)
- Surface: #FFFFFF
- Text: #374151 (Gray 700)
- Success: #10B981
- Error: #EF4444
- Gradient: from-purple-100 to-purple-300 (royal-start -> royal-end)

## Typography
- System UI sans-serif stack for performance and readability.
- Headings: bold weights, generous spacing.
- Body: comfortable line height, subdued secondary text for descriptions.

## Components
- Buttons: `.btn-primary` with rounded corners (`rounded-lgx`), soft shadow (`shadow-soft`), hover opacity.
- Cards: `.card-surface` with white background, subtle border, soft shadow, rounded corners.
- Inputs: Rounded with focus ring in primary color, accessible contrast.

## Layout
- Responsive container widths: max-w-6xl with padding for readability.
- Sections: vertical rhythm via padding y-10/12 depending on section importance.
- Grid: 1–4 columns responsive, gutters with `gap-4` or `gap-6`.

## Responsiveness
- Mobile-first, scale up via `sm:` / `md:` breakpoints.
- Images set to cover container while preserving aspect ratio.

## Accessibility
- Sufficient color contrast for text and critical UI (buttons, errors).
- Focus states with clear primary-colored rings.
- Buttons use semantic `<button>` and have descriptive labels.
- Error messages in `text-error`, success in `text-success`.

## Supabase UI
- My Movies section follows card-based layout for clarity.
- Form grouped with labels for inputs and visible validation.
- Empty state messaging prompts user to add first movie.

## Consistency
- All new components use Tailwind utilities consistent with theme.
- Shared classes (`btn-primary`, `card-surface`) ensure a cohesive look and faster iteration.
