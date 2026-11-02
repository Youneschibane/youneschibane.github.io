# Younes Chibane — Portfolio

Static portfolio built with HTML5, CSS3 and vanilla JavaScript (no framework, no build step).
Hosted on GitHub Pages: https://youneschibane.github.io/

## Structure
- `index.html` — all content and sections
- `style.css` — design tokens, layout, components, motion, responsive rules
- `script.js` — theme, navigation, reveal effects, hero canvas; contact settings in the `CONFIG` block
- `assets/logos/` — technology logos (SVG, optimized). Most come from the open-source Devicon set; Render and JWT come from Simple Icons. Logos are trademarks of their respective owners.
- `favicon.svg`, `og-image.png`, `robots.txt`, `sitemap.xml`

## Update contact details
Edit the `CONFIG` block at the top of `script.js` (email, LinkedIn). Empty values stay hidden.
Never put passwords, tokens or API keys in this repository.

## Add a project or screenshots
Copy a `<article class="project">` block in `index.html`. For app screenshots, add optimized
images (WebP/PNG) to `assets/screens/` and use the commented `<figure class="shots">` slot in the Tutex card.

## Add a technology
Add the SVG to `assets/logos/` and copy an existing `<li class="logo">…</li>` item into the right group.

## Local preview
Open `index.html` in a browser, or run `python -m http.server` in this folder.
