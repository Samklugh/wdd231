# Jazz Discoveries project checks

Implemented the three pages specified by `myproject.html`: Home, Musicians and Listening Planner, plus form confirmation, attributions and a video recording guide. The course home's Final link now points to this project.

The catalogue fetches 85 entries from JSON, including 10 additional musicians for each of the seven instrument categories. Features include instrument/style/favourites filters, native modal profiles, local favourites, locally saved listening drafts, form validation and safe rendering of submitted form data. The site uses original HTML, CSS and ES modules, system fonts and lightweight SVG illustrations.

## Verification

- All three JavaScript modules passed syntax checks.
- Module checks passed for storage round trips, malformed stored JSON, blocked storage, successful Fetch, HTTP errors, incomplete catalogues and JSON parsing failures.
- Local link targets exist and HTML IDs are unique.
- All 85 musician IDs are unique and required properties are populated.
- Main pages returned HTTP 200 from a local server.
- Added 85 real musician photographs from Wikimedia Commons, with source, photographer and licence credits. All local WebP dimensions were checked and a contact sheet was visually inspected.
- The catalogue plus every photo totals approximately 473 kB, below the 500 kB limit. These are local file totals, not Lighthouse transfer measurements.
- Browser checks were blocked by an environment error: `sandbox-state-meta: missing field sandboxPolicy`. Interactions and mobile layout have not been verified in a browser.
- W3C and Lighthouse audits of the finished project have not been run. Existing reports cover the earlier site plan only.

## Catalogue expansion verification

- Exactly 70 new profiles: Bass, Drums and Guitar now have 11 musicians each; Piano has 14; Saxophone has 12; Trumpet and Voice have 13 each.
- Existing musician IDs were preserved so saved favourites remain valid.
- The actual catalogue filtering function passed checks for every instrument and style, existing and newly added favourites, combined filters and empty results, using mocked DOM controls. This does not replace browser interaction testing.
- All 85 photo files, intrinsic dimensions and source credits were checked. The 70 new portraits were visually inspected in two contact sheets.

## Remaining student deliverables

1. Supply your own mobile and desktop wireframe sketches in the site plan, which explicitly requires student sketches and disallows AI-generated HTML wireframes.
2. Record the required public 3–5 minute video with your face and screen visible. Follow `project-video.html`, then replace the Project video footer links with your public recording URL.
3. Commit and push to GitHub Pages and run the course audits against the published project.

## Preview

Run `python -m http.server 8085` from the repository root and open `http://localhost:8085/myproject/`. Fetch and ES modules require HTTP rather than opening a local file directly.
