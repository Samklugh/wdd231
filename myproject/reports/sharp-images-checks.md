# Image quality and HTML validation

Rebuilt all 85 musician photographs from larger credited source photographs. Replaced a number of low-resolution sources and updated their source/photographer/licence credits. Ray Brown is cropped from a higher-resolution CC0 ensemble photograph, with the crop noted in the credits.

- Full-size portraits and smaller responsive versions are served locally as WebP.
- Cards use `srcset` and `sizes`; dialogs use the larger photograph. Removed the old 583px-only homepage override for Ella Fitzgerald.
- Photographs are encoded at quality 74–86 rather than the previous aggressive compression. Source resolution is preserved without artificial enlargement; some historical originals retain natural softness and grain.
- Desktop and mobile hero images were rebuilt. All 177 website image files are below 120,000 bytes. The largest is 116,884 bytes. See `image-size-audit.json`.
- All photo dimensions and responsive file references were checked against their files.
- The homepage now fetches a separate three-artist JSON feed instead of downloading the entire 85-artist catalogue. The directory and planner retain all 85 musicians.
- W3C Nu HTML validation passed with zero errors for all seven HTML pages, including the site-plan document, and for the actual generated catalogue markup. Saved responses: `sharp-images-html-validation.json`.
- Validation caught a skipped heading level in dynamically generated directory entries. Their names now use `h2`, with matching CSS; homepage feature names retain `h3` beneath the section's `h2`.
- JavaScript syntax, responsive card generation, data fetching, HTTP-error handling and changed CSS syntax checks passed. Local references and unique IDs were checked.

The regenerated images were inspected as local assets. Browser visual testing remains unavailable because the browser execution tool returns `sandbox-state-meta: missing field sandboxPolicy`.
