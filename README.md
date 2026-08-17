# Tayyaba Patel — Developer Portfolio

A single-page personal portfolio website built with vanilla HTML, CSS, and JavaScript. No frameworks or external JS libraries required.

## Features

- **Responsive design** — works on mobile, tablet, and desktop
- **Dark theme** with purple/blue gradient accents and glassmorphism cards
- **Sticky navbar** with scroll-triggered background and active link highlighting
- **Animated hero section** with floating background shapes and mouse-parallax
- **Scroll-reveal animations** using the Intersection Observer API
- **Animated skill bars** that fill when scrolled into view
- **3D card tilt effect** on project and skill cards (desktop pointer devices)
- **Mobile hamburger menu** with keyboard (Escape) and outside-click dismissal
- **Contact form** with inline validation and simulated async submission
- **Accessible** — semantic HTML5, ARIA labels, focus-visible outlines, reduced-motion support

## Sections

1. **Hero** — name, tagline, CTA buttons, and social links
2. **About** — bio, statistics, and avatar frame
3. **Skills** — HTML5, CSS3, JavaScript, React, Node.js, TypeScript
4. **Projects** — DevTrack, ShopSphere, PulseBoard
5. **Contact** — info panel and validated contact form

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Markup     | HTML5 (semantic, accessible)        |
| Styles     | CSS3 (custom properties, grid, flex)|
| Scripts    | Vanilla JavaScript (ES2020+)        |
| Font       | Google Fonts — Poppins              |

## Getting Started

No build step needed. Open `index.html` directly in any modern browser, or serve with any static file server:

```bash
# Python
python3 -m http.server 8000

# Node.js (npx)
npx serve .
```

Then visit `http://localhost:8000`.

## Customisation

- **Personal details** — update name, email, location, and bio in `index.html`
- **Projects** — edit the three `<article class="project-card">` blocks
- **Colours** — adjust CSS custom properties at the top of `style.css`
- **Form submission** — replace `simulateFormSubmit()` in `script.js` with a real `fetch()` call to your backend or a service like Formspree/EmailJS
