> Design update: the site plan has been simplified since the Lighthouse reports below were generated. Those scores describe the earlier design. The screenshots reflect the current design. The simplified page was checked at 375px and 1440px with no horizontal overflow; section links and local resources also passed.

# Jazz Discoveries site plan validation

Tested locally on 6 October 2026. Open `myproject/siteplan.html` with VS Code Live Server, or run `python -m http.server 8000` from the repository root and visit `http://localhost:8000/myproject/siteplan.html`.

## Completed checks

- W3C Nu HTML validator: no errors or warnings. [Validator response](html-validation.json).
- Browser layout: tested at 320, 375, 640, 768, 960 and 1440px. No horizontal overflow, broken section links or JavaScript runtime errors. All six required sections and one h1 are present. [Browser checks](browser-checks.json).
- Static local links and assets resolve, including the stylesheet, favicon and course-home link.
- Text contrast: midnight ink on warm paper is 12.90:1; copper on warm paper is 5.89:1. Both pass WCAG AA for normal text. [Contrast calculations](contrast-checks.json).
- The page uses only the three declared colours and the Georgia/serif and Arial/sans-serif font stacks. No third-party fonts, frameworks or scripts are loaded.

## Lighthouse results

| View | Performance | Accessibility | Best Practices | SEO | Transferred size |
| --- | ---: | ---: | ---: | ---: | ---: |
| Mobile | 99 | 100 | 100 | 100 | 16.27 kB |
| Desktop | 93 | 100 | 100 | 100 | 16.25 kB |

[Mobile Lighthouse report](siteplan-mobile.html) · [Desktop Lighthouse report](siteplan-desktop.html) · [Machine-readable summary](lighthouse-summary.json)

Reports were generated in headless Chrome against the local HTTP server. Performance scores can vary between runs. No failing accessibility, Best Practices or SEO checks were reported. The performance reports contain timing and network dependency observations; the page transfer is well below the project's 500 kB limit.

## Preview

[Mobile screenshot](siteplan-375.png) · [Desktop screenshot](siteplan-1440.png)

## Remaining assignment work

**The two student-created Home page wireframe sketches are still required.** The site plan includes drawing notes and clearly identifies this incomplete section. No AI-generated HTML wireframes or substitute diagram images have been made. Once the student supplies the sketches, they can be embedded as two figures with descriptive alternative text and captions.

WAVE was not run: its public website checker needs a reachable published URL. Run a WAVE review on the published site plan or use the WAVE browser extension locally. WebAIM's online contrast checker was not used; contrast was independently calculated with the WCAG relative-luminance formula and also assessed by Lighthouse. Google PageSpeed Insights was not run; the requested Lighthouse alternative was used.

This deliverable is the planning document, not the finished three-page website. The page purpose and planned functionality are based on the student's Jazz Discoveries proposal and the course requirements in [project.txt](../project.txt).
