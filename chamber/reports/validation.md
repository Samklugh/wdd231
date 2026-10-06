# Chamber site validation

Completed 6 October 2026 against the local site in headless Chrome using an HTTP server. Mobile and desktop Lighthouse audits cover all five chamber pages. These are local results; repeat the audits on the published GitHub Pages URLs after deployment.

## Lighthouse

All ten reports scored **100 Accessibility, 100 Best Practices and 100 SEO**, with no failing binary/numeric checks in these categories. The initial Home and Directory label-content-name mismatch was corrected; the saved reports reflect the final rechecks.

| Page | Mobile report | Desktop report |
| --- | --- | --- |
| index.html | [Mobile](index-mobile.html) | [Desktop](index-desktop.html) |
| directory.html | [Mobile](directory-mobile.html) | [Desktop](directory-desktop.html) |
| join.html | [Mobile](join-mobile.html) | [Desktop](join-desktop.html) |
| thankyou.html | [Mobile](thankyou-mobile.html) | [Desktop](thankyou-desktop.html) |
| discover.html | [Mobile](discover-mobile.html) | [Desktop](discover-desktop.html) |

Machine-readable results: [Lighthouse summary](lighthouse-summary.json). Full Lighthouse JSON reports accompany each HTML report.

## Uncached transfer sizes

Browser cache was cleared and caching disabled for each load. All local images, including lazy images below the fold, were forced to load. Totals include transferred resources and HTTP overhead. The home page also loaded real weather responses and member data. Sizes can vary slightly with weather data and fonts.

| Page | 320px | 768px | 1440px |
| --- | ---: | ---: | ---: |
| index.html | 209.1 kB | 288.1 kB | 288.1 kB |
| directory.html | 149.5 kB | 149.5 kB | 149.5 kB |
| join.html | 104.9 kB | 95.8 kB | 75.2 kB |
| thankyou.html | 88.3 kB | 88.4 kB | 67.8 kB |
| discover.html | 213.5 kB | 213.5 kB | 192.9 kB |

**All loads are below 500 kB.** No JavaScript runtime errors, failing page/resource HTTP responses or broken loaded images were observed. [Raw browser results](browser-checks.json).

## Responsive layout and behaviour

- Discover tested at 320, 375, 640, 641, 768, 1024, 1025 and 1440px. Eight cards appear at every width, with no horizontal overflow. Computed named grid areas were checked at the exact breakpoint boundaries.
- All five pages tested at 320, 768 and 1440px, with one h1 per page and no horizontal overflow.
- Visit messages checked for first visit, under one day, exactly one day, multiple whole days, invalid saved data and blocked localStorage.
- Learn more opens the correct place dialog. Escape closes it and restores focus to the initiating button. Mobile menu opening, Escape closing and focus behaviour passed.
- Image files independently verified as WebP at exactly 300 ? 200px. The eight images total 109,206 bytes.
- Image hover styling is restricted to min-width 641px plus hover-capable fine pointers, with reduced-motion handling.
- All chamber JavaScript modules passed syntax checks. Git whitespace checks passed.

## Contrast

Lighthouse reported no colour contrast failures on any page. Foreground/background palette checks:

| Foreground | Background | Contrast ratio |
| --- | --- | ---: |
| #292b2c | #f6f5f2 | 13.05:1 |
| #626260 | #f6f5f2 | 5.61:1 |
| #626260 | #ffffff | 6.11:1 |
| #743c46 | #ffffff | 8.48:1 |
| #ffffff | #743c46 | 8.48:1 |
| #ffffff | #292b2c | 14.23:1 |

Contrast was assessed through Lighthouse and palette calculations; a manual DevTools CSS Overview session was not used. Automated scores do not replace manual usability review.

## Links

All 78 static local navigation, resource, form-action and fragment references resolve. Dynamic place images and imported modules also loaded successfully. External link responses are recorded in [link-checks.json](link-checks.json).

Most public external links returned HTTP 200. The British Museum, Kew, Visit London and Wikimedia Commons file pages restricted automated HTTP requests with 403 responses; this is recorded as a verification limit. Commons metadata independently confirmed that all eight photo source pages exist and supplied their licence data. Existing fictional member links still go to example.com, and existing social links go to platform home pages.

## Screenshots

[Mobile, 375px](discover-375.png) ? [Medium, 768px](discover-768.png) ? [Desktop, 1440px](discover-1440.png)

## Repeat locally

Open the chamber pages with VS Code Live Server, or run `python -m http.server 8000` from the repository root. Use Chrome DevTools Lighthouse to run Accessibility, Best Practices and SEO in mobile and desktop modes. Clear the network cache and scroll through each page when checking transferred size. Test returning-visitor messages by editing the `london-discover-last-visit` timestamp under DevTools Application ? Local Storage.
