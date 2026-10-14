# Shared editorial styling

Extended the homepage identity to Musicians, Listening Planner, Confirmation, Attributions and Project Demonstration.

- Shared locally hosted Cormorant Garamond and DM Sans fonts, wordmark, navigation, footer, ivory/charcoal palette and brass accents.
- Added `styles/pages.css` for photographic catalogue entries, quieter filters and buttons, a reading-panel profile dialog, notebook-like form layout, printable confirmation and readable source credits.
- The homepage's existing styling now uses the shared `editorial-site` class. Its composition is preserved.
- The site-plan document remains a separate planning artifact.

## Verification

- All six visitor-facing pages passed W3C Nu validation with zero errors. Responses are saved in `interior-html-validation.json`.
- Shared and interior styles parsed without CSS syntax errors.
- Local link targets, unique IDs and one main heading per page checked.
- Required directory/dialog controls and planner fields, GET method and confirmation action were preserved.
- SHA-256 checks confirm that all JavaScript modules, the full musician data and the site-plan document were unchanged. Baselines are saved in `restyle-preserved-files.json`.
- The same previously checked AA colour pairs are used throughout.

Browser visual testing remains unavailable: the browser execution tool returns `sandbox-state-meta: missing field sandboxPolicy`. Rendered layout, scrolling of the recording choices, modal appearance and print layout have not been verified in a browser.
