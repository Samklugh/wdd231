W01 Learning Activity: CSS Normalization
Overview
Every browser and other user agents (such as bots or other programs) have default CSS properties for HTML elements. The goal with a normalize or reset CSS reference is to reduce browser inconsistencies in the default styling.

"Normalize.css makes browsers render all elements more consistently and in line with modern standards. It precisely targets only the styles that need normalizing." – Nicolas Gallagher, creator of Normalize.css
Prepare
Historically
CSS resets have been around for a long time. The first reset CSS file was created by Eric Meyer in 2007. It was a simple file that removed all default browser styling. Since then, many developers have created their own variations of reset CSS files. The most popular of these is normalize.css, created by Nicolas Gallagher in 2011. Normalize.css is a modern alternative to CSS resets that preserves useful default styles rather than just removing them.

Current State
Browsers have come a long way in adhering to web standards. Default styles are more consistent across modern browsers.

Normalize.css is still relevant as it doesn't completely wipe out default styles, but rather normalizes them across browsers, preserving useful defaults.

Many CSS frameworks like Bootstrap and Tailwind CSS use some form of normalize or reset styles.

Summary
The use of CSS normalization and reset is opinionated. This means its benefits and shortcomings can be debated among professionals. Depending upon the application, some level of using normalization or reset may be beneficial. You may need to support legacy browsers or you may have highly customized designs that need pixel-perfect control and cross-browser consistency.

Watch CSS Normalization and Reset
How does newsroom.churchofjesuschrist.org use CSS normalization/reset.

Activity Instructions
In this activity, you will create your own normalize CSS file and include it on your site.

Create a normalize.css file located in your wdd231 root styles folder.
Use the following code reference and copy the CSS into your file. Nicolas Gallagher's – normalize.css
Apply the CSS by including the link in the head of a page. For example, this line of code would be included before any other CSS link reference.
<link rel="stylesheet" href="styles/normalize.css">
IMPORTANT CONCEPT: Why should this CSS reference precede all the other CSS references?
If you have more than one rule, all of which have exactly the same weight, then the one that comes last in the CSS will win (cascade).

An alternative to hosting your own normalize or reset CSS file is to use a content delivery network (CDN) reference.
This particular reference has minimized the "normalize.css" file as indicated by the .min in the file name.
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">
Take a look at the file and see how difficult it is to read for humans but completely usable by the browser.
What does minimizing mean when it comes to web file optimization?
All unnecessary syntax in the CSS is removed from the file including spaces, comments, line returns. More sophisticated minification would optimize the CSS and extract redundancy.

Optional Resources
CSS Cascade and Inheritance – MDN
https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance


What is a CDN (Content Delivery Network)? - AWS
https://aws.amazon.com/what-is/cdn/
