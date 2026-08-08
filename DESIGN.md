# How the design works

The short version: **photography carries the colour, the interface gets out of its way, and one
teal accent marks everything you can act on.** Every rule below exists to protect that.

The system is defined once in `assets/css/tokens.css` and consumed by `assets/css/site.css`. No
component introduces a raw hex or a magic duration. `styleguide.html` renders the whole thing in a
browser — open it to see every colour, type step, component and motion rule on one page.

---

## 1. Colour

Twelve surfaces, one accent. The page alternates between three grounds — white canvas, warm
parchment, and a dark tile — so sections separate by ground rather than by borders or shadows.

| Role | Token | Value | Measured contrast |
| --- | --- | --- | --- |
| Body text | `--ink` | `#171a19` | 10.6:1 on canvas |
| Secondary copy | `--ink-muted-80` | `#3a403e` | 9.5:1 on parchment |
| Captions, meta | `--ink-muted-48` | `#666c6a` | 5.4:1 canvas · 4.8:1 parchment |
| Links, text actions | `--action` | `#006e64` | 6.2:1 canvas · 5.5:1 parchment |
| Button fill | `--action-solid` | `#00786e` | 5.4:1 with white text |
| Links on dark | `--action-on-dark` | `#4fd1bd` | 8.2:1 on `--surface-tile-1` |

Three of those changed from the original system because they did not pass:

- `--ink-muted-48` was `#7a807e`, which measured **3.7:1** on white. It carried captions, project
  meta, stat labels and fine print — all body-size text, all failing AA. Darkened to `#666c6a`.
- `--action` was `#00857a`. Fine on white at 4.5:1, but **4.1:1 on parchment**, and parchment is
  where half the links sit. Darkened to `#006e64`, which clears both.
- Buttons now use a separate `--action-solid`, because the colour that reads well *as text on a
  light ground* is not the colour that reads well *behind white text*.

**Type is never set directly on a photograph.** Any image carrying a headline or a chip gets a
gradient scrim between the two (`--scrim-top`, `--scrim-bottom`, `--scrim-full`). That is what makes
the contrast hold when the studio swaps in its own photographs — the guarantee comes from the
gradient, not from the particular image happening to be dark in the right place.

## 2. Typography

**Newsreader** (serif) for the voice, **Manrope** (geometric sans) for the detail. The serif keeps
headlines warm — appropriate for a studio selling craft — while the sans keeps specifications,
prices and form labels plain.

One fluid ramp, defined as clamps so nothing needs re-tuning per breakpoint:

| Step | Token | Range |
| --- | --- | --- |
| Hero | `--t-hero` | 38 → 84px |
| Section | `--t-display` | 28 → 46px |
| Sub | `--t-title` | 22 → 32px |
| Lead | `--t-lead` | 18 → 22px |
| Body | `--fs-body` | 17px / 1.55 |
| Caption | `--fs-caption` | 14px / 1.45 |

Two deliberate changes from the source spec, which was written against SF Pro:

- Body tracking relaxed from `-0.374px` (≈ -0.022em) to `-0.01em`. SF Pro is drawn for tight
  tracking; Manrope is not, and at 17px the original setting closed up the counters.
- Body leading raised from 1.47 to 1.55, and heading leading tightened. Long-form paragraphs want
  more air than the spec's single value gave every size at once.

Measure is capped at 46ch (`.measure`), 40ch (`.measure--tight`) or 62ch (`.measure--wide`).

## 3. Layout

Three containers — 720px for text, 980px narrow, 1440px wide — and three vertical rhythm tiers:
`--rhythm-page` (56→120px between sections), `--rhythm-block` (24→40px inside one), and
`--rhythm-tight`. Nothing lands between tiers.

Grids are `auto-fit` with a `minmax` floor, so they reflow by available width rather than by
breakpoint. Below 860px every grid collapses to one column and the desktop nav is replaced by a
floating glass header.

One trap worth knowing about, since it caused two real bugs during the build: `.stack` aligns its
children to the start, which makes each child shrink-to-fit. That is right for a button, but a grid
sized to its content collapses `auto-fit` to a single narrow column. Layout containers inside a
stack are therefore explicitly set to `width: 100%`.

## 4. Elevation

The system has **exactly one drop shadow, and it belongs to photography** (`--shadow-photo`).
Chrome — navs, bars, chips — never casts a shadow; it separates by ground colour and hairline
instead. Cards that physically lift on hover use `--shadow-lift`, which is the same shadow at
hover strength.

## 5. Motion

Everything is opt-in through a data attribute, and the whole layer switches off under
`prefers-reduced-motion: reduce` — not by shortening the animations but by zeroing the transform
distances in `tokens.css`, so nothing can land mid-transition and leave content invisible.

**Scroll reveals run in both directions.** An element that leaves the viewport re-arms and replays
its entrance from whichever edge it left by, so scrolling back up animates rather than snapping.
The direction is read from the IntersectionObserver entry and written to `data-from`.

| Attribute | Effect |
| --- | --- |
| `data-reveal` | Rises 28px from the direction of travel |
| `data-reveal="left"` / `"right"` | Enters sideways |
| `data-reveal="scale"` | Grows from 94% |
| `data-reveal="blur"` | Sharpens from a 10px blur |
| `data-reveal="mask"` | Photograph wipes open from its lower edge |
| `data-reveal="fade"` | Opacity only |
| `data-stagger` | Sets `--i` per child; 60ms apart |
| `data-split` | Headline rises word by word, each in its own mask |
| `data-count` | Counts up on entry, re-runs on re-entry |
| `data-parallax="0.09"` | Image drifts against the scroll |
| `data-hero-scrub` | The home hero pins and scrubs through its photographs |

Timing follows Material's convention — entrances ease out over `--dur-3` (620ms), micro-interactions
run 160–280ms, and grid children stagger 60ms apart. Only `transform`, `opacity`, `clip-path` and
`filter` are animated; nothing here can trigger layout.

Two things share a single `requestAnimationFrame` loop and a single `IntersectionObserver`: the
scroll engine (progress bar, retracting header, enquiry bar, parallax, hero scrub) and the reveal
engine. Adding more animated sections costs no additional listeners.

### The scrubbing hero

The home hero pins while you scroll through it and ties a walkthrough film's playhead to how far
through you are — the camera moves only while you do, in both directions — while the headline
changes with it. It is configured by `HERO` in `assets/js/data.js`.

Three things make video scrubbing actually work, and all three are easy to get wrong:

- **The film is fetched as a Blob and played from an object URL.** Plenty of static hosts do not
  serve HTTP byte-range requests — this repo's own dev server does not — and without ranges
  `video.seekable` pins to `[0,0]`, every seek clamps to frame zero, and the film looks frozen. A
  blob is always fully seekable.
- **Seeks are coalesced.** Setting `currentTime` again while the decoder is still seeking queues up
  work it cannot keep pace with, and a fast flick stalls the picture. Only the newest target is kept.
- **The poster stays up until a real frame has painted**, and the element is primed on the first
  interaction. On iOS a muted video that has never been played will not paint a seeked frame, so
  hiding the poster on metadata alone shows an empty hero.

The encodes matter as much as the code: a seek costs however far the decoder must travel from the
last keyframe, so the desktop master is cut at `-g 8` and the phone encode at `-g 4`. Dense
keyframes cost about 700KB over a default GOP here, and they are the difference between scrubbing
and stuttering.

It runs **full bleed** — edge to edge, the nav sitting on the film — rather than in the inset
rounded card the rest of the site uses. In a box it read as a picture of a room; edge to edge it
reads as being in one. The headline, tagline and button sit as one centred stack in the middle of
the frame.

Because that copy sits on the film rather than in a frosted card, the hero carries a stronger
scrim than the rest of the site (~0.5 through the middle band instead of 0.22). Over a blown-out
white frame that composites to a mid-grey holding **3.7:1** against white type, and the tagline is
sized and weighted past WCAG's large-text threshold so 3:1 is the bar it has to clear. The button
brings its own background, so it is unaffected either way.

Three further decisions worth knowing:

- **`position: sticky`, never `fixed`.** The obvious way to build this is a fixed stage over a tall
  spacer, which is what the `scroll-world` engine this borrows from does. Fixed would fight the
  site's own sticky header and scroll engine, so the frame sticks inside its track instead. The
  track's height *is* the scroll budget.
- **The track starts one viewport tall.** Scene one ships in the HTML; the script adds the rest and
  only then raises `--hero-scenes`. So with scripting off the hero is just the hero — one
  photograph, one headline, no acres of empty scroll — and the growth happens only while the visitor
  is still near the top, so the page never lengthens under someone mid-read.
- **The `<h1>` keeps one fixed accessible name.** A level-one heading whose text changes as you
  scroll is disorienting to announce, so the moving lines are `aria-hidden` and the heading carries a
  stable `aria-label`.

The enquiry bar is fixed to the bottom of the viewport, and a hero that fills that viewport for
several screens would otherwise sit underneath it — on a phone it cut the hero's button in half. The
foot of the hero reserves `--sticky-bar-height` instead, so both stay on screen together rather than
one having to hide. Measured clearance: 21px on a phone, 27px on desktop, at every scroll position.

### Why the page transition is pure CSS

An earlier version intercepted every link click, cancelled the default and navigated from a 150ms
timer so the outgoing page could fade. It worked, but it meant **a link only navigated if a timer
fired** — two quick clicks could race each other, and a script error would have made the entire site
unclickable. That is a bad trade for a 150ms fade.

It is now `@view-transition { navigation: auto; }` plus a CSS arrival animation. Links are ordinary
links, navigation cannot fail, and browsers without view-transition support simply navigate.

## 6. Progressive enhancement

The motion layer only activates once `js` is on `<html>`, set by an inline snippet in `<head>`
before first paint. With JavaScript blocked, every page renders complete and static — no hidden
content, no blank sections. What degrades: the gallery and project grids render from `data.js`, so
those two grids are empty without it; everything else is in the HTML.

## 7. Accessibility

- Every foreground/background pair in `tokens.css` is annotated with its measured ratio. All clear
  WCAG AA: 4.5:1 for text, 3:1 for interface elements.
- Focus rings are visible and re-coloured to `--action-on-dark` on dark bands, where the teal ring
  would otherwise sit too close in value to the ground.
- Tap targets are at least 44px. Three were not and were fixed: service-list rows (26px), the
  Instagram link in the studio card (20px), and breadcrumb links (22px).
- The lightbox traps focus, closes on Escape, steps on arrow keys, and returns focus to the element
  that opened it.
- Form fields have visible labels, validate on blur rather than on keystroke, and show errors
  beside the field they belong to.
- `data-split` headings keep their original text as an `aria-label`, since the visible text becomes
  a pile of per-word spans.
- Chips change border *colour* rather than border *width* when pressed, so selecting one cannot
  nudge the row and reflow the grid beneath it.

## 8. Where the rules came from

`DESIGN-apple.md` is the original specification — a photography-first system with edge-to-edge
tiles alternating light and dark, one interactive colour, and a single drop shadow reserved for
product imagery. This site keeps that structure and applies the contrast corrections listed in §1.

