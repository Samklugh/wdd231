# Editorial homepage redesign

The redesign follows the attached brief: an archival performance cover, Cormorant Garamond and DM Sans typography, warm paper and charcoal with brass accents, an asymmetric artist feature, an instrument index, a dark jazz-style index and a listening-planner invitation.

## Scope

- Rebuilt `index.html` and added scoped `styles/home.css` and locally hosted fonts.
- Preserved `styles/jazz.css`, the full 85-musician catalogue, musician IDs and storage keys, directory markup and planner markup.
- Kept the existing featured-artist renderer, adding a larger Ella Fitzgerald image for its homepage use.
- Added validated instrument/style URL parameters to initialise the existing catalogue filters. This makes the new homepage links functional without replacing the filtering logic.
- Added responsive, credited William P. Gottlieb performance photographs and a JPEG social preview. Font licences are included under `fonts/`.

## Checks performed

- W3C Nu HTML checker: no homepage errors. Saved response: `home-html-validation.json`.
- Homepage CSS and font declarations parsed without errors using tinycss2.
- JavaScript syntax check passed.
- All local HTML references and IDs checked; every instrument/style link matches existing catalogue data.
- Image intrinsic dimensions checked against their files. The cover and new Ella Fitzgerald portrait were visually inspected as image assets.
- Desktop homepage assets, all featured photos, all three fonts and fetched JSON total approximately 390 kB from local file sizes, below 500 kB. Mobile uses the smaller cover image. This is not a Lighthouse transfer measurement.
- Solid-colour body/label combinations meet at least 4.5:1 contrast. See `home-contrast-checks.json`. Text over photography uses a shade layer; its rendered contrast needs browser review.
- Twelve local HTTP requests for the pages, styles, images and fonts returned 200.
- Executed the actual ES module with mocked DOM controls and storage. Checks passed for the three featured artists, larger image, menu toggle, instrument/style query parameters, ignored invalid parameters, filter reset, saved favourites after reload, profile opening/closing and restored focus, 85 planner choices, required selection, saved/restored plans and confirmation values.

## Verification limits

The in-app browser could not connect because its execution tool returned `sandbox-state-meta: missing field sandboxPolicy`. Rendered desktop/mobile layouts, keyboard interactions in a real browser and Lighthouse scores have not been verified. Responsive rules were reviewed for 320px, mobile, tablet, laptop and large desktop layouts; mocked DOM checks are not a substitute for browser testing.

The reference website's available content was reviewed at `https://jazzdiscoveryseries.org/`. Its live visual layout could not be inspected through the unavailable browser. This implementation uses its own composition, typography, copy and credited project photography.
