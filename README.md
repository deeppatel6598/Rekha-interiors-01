# Rekha-interiors-01

Website for **Rekha Interiors & Developers** — an interior design and execution studio in Pune.

A static site: no build step, no dependencies. Open `index.html`, or serve the repo root from any
static host (GitHub Pages, Netlify, cPanel).

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | All four pages — Home, Gallery, Projects, Contact |
| `assets/css/tokens.css` | Design-system tokens (colour, type, spacing, radius, elevation, motion) |
| `assets/css/site.css` | Site styles |
| `assets/js/app.js` | Routing, gallery filters, lightbox, form, scroll reveal |
| `assets/img/` | Logo and the studio's 2025 award photographs |
| `DESIGN-apple.md` | The original design specification the system was derived from |

Pages are routed client-side on the URL hash: `#home`, `#gallery`, `#projects`, `#contact`.

## Responsive

Fluid grids and `clamp()` type throughout. Below 860px the desktop nav is replaced by a floating
glass header with a drop-down menu, and every grid collapses to one column. Verified at 390, 900
and 1440px on all four pages: no horizontal overflow, no clipped text, tap targets at least 44px.

## Before going live

- **Contact details.** The Contact page reads "Add your number here" and "Add your email here" —
  replace both in `index.html`.
- **Photography.** Interior shots are Unsplash placeholders, defined as the `SHOTS` and `PROJECTS`
  arrays at the top of `assets/js/app.js`. Swap each entry's Unsplash id for a real image path when
  the studio's photos are ready. The award photographs in `assets/img/` are the studio's own.

## Fonts

Newsreader (display) and Manrope (text) load from Google Fonts via `assets/css/tokens.css`.
