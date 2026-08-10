# Samiksha Warde Designs

Website for **Samiksha Warde Designs** — interior design and visual styling across Mumbai and
Thane, with virtual design anywhere. *Chalo, apka ghar sajaye!*

A static site: no build step, no dependencies, no framework. Open `index.html`, or serve the repo
root from any static host (GitHub Pages, Netlify, Vercel, cPanel).

## Pages

Each page is its own HTML file with its own title, description and URL.

| File | Page |
| --- | --- |
| `index.html` | Home |
| `about.html` | The studio — how it works, where it works, the creator side |
| `services.html` | Six services in depth, the four-stage process, FAQ |
| `projects.html` | Project index, filterable by full home / styling |
| `projects/*.html` | Six project case studies, one file each |
| `gallery.html` | Photographs, filterable by room, with a lightbox |
| `contact.html` | Enquiry form, studio details, FAQ |
| `styleguide.html` | The living design system |
| `404.html` | Not found |

`sitemap.xml` and `robots.txt` are generated alongside them.

## Services

Full home interiors · Modular kitchen · Wardrobes & storage · Visual styling · Virtual design ·
Renovation & makeovers.

The site positions the studio as **design and styling, not contracting** — the client gets a
buildable drawing set and site support, and pays contractors and suppliers directly. If that is
wrong, `services.html` and the FAQ are where to change it.

## Assets

| Path | What it is |
| --- | --- |
| `assets/css/tokens.css` | Design tokens — colour, type, spacing, radius, elevation, motion |
| `assets/css/site.css` | Site styles, including the scroll-animation layer |
| `assets/js/data.js` | Project and gallery data shared between pages |
| `assets/js/app.js` | Navigation, scroll engine, reveals, counters, filters, lightbox, form |
| `assets/img/mark.svg` | Placeholder monogram — swap for the studio's real logo |
| `assets/img/og-cover.png` | Social share card (1200×630) |
| `DESIGN.md` | How the design system works and why it is built this way |
| `DESIGN-apple.md` | The original design specification the system was derived from |

## Motion

**The home hero is a scroll-scrubbed walkthrough.** Scroll drives the film's playhead, so the camera
only moves while you do — forwards and backwards — and the headline changes with it. It is
configured by the `HERO` object in `assets/js/data.js`. With JavaScript off, or under
`prefers-reduced-motion`, it collapses to an ordinary still hero (and never downloads the film).

Swapping the film means replacing three files together — the desktop encode, the phone encode, and
a poster that is the film's **actual first frame**, or the hero visibly jumps when the video paints
over it. Both encodes need dense keyframes, because a seek costs however far the decoder has to
travel from the last one. The exact commands that produced `assets/video/` are in the comment above
`HERO` in `assets/js/data.js`.

Scroll animations elsewhere run in both directions: an element that leaves the viewport re-arms and
replays its entrance from whichever edge it left by, so scrolling back up animates rather than
snapping.

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
on a photograph; images that carry a headline or a chip get a gradient scrim between the two.

Also: a skip link, visible focus rings (re-coloured on dark bands), a focus-trapped lightbox,
labelled form fields with inline errors on blur, `aria-current` on the active nav item, and
sequential heading levels.

---

## Before going live

### Confirm with the studio

- **Project details.** The six project *names* come from the studio's own Instagram highlights
  (Vihang Hills, Lodha Palava, Hiranandani, Palava Fresca, Lodha Acme, Lodha Venezia). Everything
  else about them is illustrative and needs replacing: **carpet areas, years, durations, which
  city each one is in, whether it was a full home or a styling-only project, and the write-ups.**
  Card facts live in `assets/js/data.js`; the write-ups live in `projects/*.html`.
- **Positioning.** The copy says the studio designs and styles but does not contract the build.
  Confirm that is accurate.
- **The 100K figure** is the Instagram follower count at the time the site was written. It appears
  as an animated counter on the home and about pages.

### Still missing

- **Phone / WhatsApp number.** Not available from the source material — no number appears anywhere
  on the site. Add one to `contact.html` (marked with an HTML comment) and to the sticky bar if
  wanted.
- **YouTube channel URL.** The handle is known ("Design with Samiksha") but the full channel URL
  was truncated in the source. `contact.html` lists the channel by name with no link.
- **Logo.** `assets/img/mark.svg` is a placeholder "SW" monogram. Replace it with the studio's own
  mark; every page and the favicon reference that one file.
- **Photography.** Every interior shot is an Unsplash placeholder. Image ids live in
  `assets/js/data.js` for the grids and gallery, and inline in each page for the fixed images.
- **The hero film is AI-generated.** `assets/video/hero-walkthrough.mp4` came from Gemini, not from
  a camera in a finished flat. It reads as an interior render, which is completely ordinary in
  design marketing — but do not caption it as a specific completed project, and replace it with
  footage of a real handover when there is some. The headlines over it are brand statements, not
  project claims, deliberately.
- **The enquiry form does not send anything yet.** Submitting it validates the fields and shows the
  confirmation panel, but no back end is wired up. Point it at a form service (Formspree, Netlify
  Forms, Basin) or your own endpoint.
- **Domain.** Add `<link rel="canonical">` and `og:url` to each page, and replace `example.com` in
  `sitemap.xml` and `robots.txt`.
- **Testimonials.** Deliberately left out rather than filled with invented quotes — the layout has
  room for them once real ones exist.

## Fonts

Newsreader (display) and Manrope (text), loaded from Google Fonts in `assets/css/tokens.css`.
