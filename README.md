# Rekha-interiors-01

Website for **Rekha Interiors & Developers** — an interior design and execution studio in Pune.

A static site: no build step, no dependencies, no framework. Open `index.html`, or serve the repo
root from any static host (GitHub Pages, Netlify, Vercel, cPanel).

## Pages

Each page is its own HTML file with its own title, description and URL — the site no longer routes
four pages out of one document on the URL hash.

| File | Page |
| --- | --- |
| `index.html` | Home |
| `about.html` | The studio — history, how we work, recognition, team |
| `services.html` | Six services in depth, the four-stage process, FAQ |
| `projects.html` | Project index, filterable by residential / commercial |
| `projects/*.html` | Six project case studies, one file each |
| `gallery.html` | Photographs, filterable by room, with a lightbox |
| `contact.html` | Enquiry form, studio details, FAQ |
| `styleguide.html` | The living design system — colour, type, components, motion |
| `404.html` | Not found |

`sitemap.xml` and `robots.txt` are generated alongside them.

## Assets

| Path | What it is |
| --- | --- |
| `assets/css/tokens.css` | Design tokens — colour, type, spacing, radius, elevation, motion |
| `assets/css/site.css` | Site styles, including the scroll-animation layer |
| `assets/js/data.js` | Project and gallery data shared between pages |
| `assets/js/app.js` | Navigation, scroll engine, reveals, counters, filters, lightbox, form |
| `assets/img/` | Logo and the studio's 2025 award photographs |
| `DESIGN.md` | How the design system works and why it is built this way |
| `DESIGN-apple.md` | The original design specification the system was derived from |

## Motion

Scroll animations run in both directions: an element that leaves the viewport re-arms and replays
its entrance from whichever edge it left by, so scrolling back up animates rather than snapping.

The layer covers scroll reveals (rise, left, right, scale, blur, photograph wipe), staggered grids,
per-word headline reveals, a hero parallax, a scroll-progress bar, a header that retracts on the way
down and returns on the way up, and stat counters. Only `transform`, `opacity`, `clip-path` and
`filter` are animated, driven by one `requestAnimationFrame` loop and one `IntersectionObserver`.

All of it is disabled under `prefers-reduced-motion: reduce`, and none of it is required to read the
site — with JavaScript blocked every page renders complete and static.

## Responsive

Fluid grids and `clamp()` type throughout. Below 860px the desktop nav is replaced by a floating
glass header with a drop-down menu, and every grid collapses to one column. Verified at 390, 768 and
1440px on all fourteen pages: no horizontal overflow, no clipped text, tap targets at least 44px.

## Accessibility

Every foreground/background pair in `tokens.css` is annotated with its measured contrast ratio, and
all of them clear WCAG AA — 4.5:1 for text, 3:1 for interface elements. Text is never set directly
on a photograph; images that carry a headline or a chip get a gradient scrim between the two, so the
ratio holds no matter which photograph is swapped in.

Also: a skip link, visible focus rings (re-coloured on dark bands), a focus-trapped lightbox,
labelled form fields with inline errors on blur, `aria-current` on the active nav item, and
sequential heading levels.

## Before going live

- **Contact details.** `contact.html` shows `+91 XXXXX XXXXX` and `hello@yourdomain.in` as
  placeholders. Replace both — they are marked with an HTML comment in the file.
- **The enquiry form does not send anything yet.** Submitting it validates the fields and shows the
  confirmation panel, but no back end is wired up. Point it at a form service (Formspree, Netlify
  Forms, Basin) or your own endpoint before launch.
- **Photography.** Every interior shot is an Unsplash placeholder. The image ids live in
  `assets/js/data.js` for the grids and gallery, and inline in each page for the fixed images. The
  award photographs in `assets/img/` are the studio's own.
- **Project facts.** Areas, years and durations in the case studies are illustrative. Replace them
  with the real figures — card-level facts in `assets/js/data.js`, the write-ups in `projects/*.html`.
- **Domain.** Add `<link rel="canonical">` and `og:url` to each page, and replace `example.com` in
  `sitemap.xml` and `robots.txt`.
- **Consider adding testimonials.** Deliberately left out rather than filled with invented quotes —
  the layout has room for them once real ones exist.

## Fonts

Newsreader (display) and Manrope (text), loaded from Google Fonts in `assets/css/tokens.css`.
