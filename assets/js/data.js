/* ==========================================================================
   Samiksha Warde Designs — shared content data
   --------------------------------------------------------------------------
   Project names are the studio's own, taken from its Instagram highlights.
   Everything else marked below is PLACEHOLDER and must be replaced before
   launch:

     · `id` / `img`   → paths to the studio's own photographs
                        (every photo referenced here is an Unsplash stock
                        image standing in for real work)
     · `area`, `year` → the real figures for each project
     · `category`     → confirm which projects were full homes and which
                        were styling-only

   Scope of this file: the card-level facts that appear in more than one
   place — the project grids on the home and projects pages, and the gallery.
   A project's write-up lives only in its own page under `projects/`, so
   there is exactly one copy of every sentence on the site.
   ========================================================================== */

(function (global) {
  'use strict';

  /* Unsplash returns a resized, format-negotiated file from a single id,
     which keeps the markup free of a hand-written URL per image. */
  function unsplash(id, w) {
    return 'https://images.unsplash.com/photo-' + id +
      '?auto=format&fit=crop&w=' + (w || 1200) + '&q=70';
  }

  var SHOTS = [
    { id: '1600585154340-be6161a56a0c', room: 'Living',   title: 'Sofa wall, Vihang Hills' },
    { id: '1600489000022-c2086d79f9d4', room: 'Kitchen',  title: 'Stone counter, Lodha Palava' },
    { id: '1556909212-d5b604d0c90d',    room: 'Bedroom',  title: 'Master bedroom, Hiranandani' },
    { id: '1583847268964-b28dc8f51f92', room: 'Wardrobe', title: 'Sliding wardrobe, Vihang Hills' },
    { id: '1586023492125-27b2c045efd7', room: 'Living',   title: 'Open plan living and dining' },
    { id: '1617806118233-18e1de247200', room: 'Kitchen',  title: 'Breakfast ledge, Lodha Palava' },
    { id: '1595526114035-0d45ed16cfbf', room: 'Bedroom',  title: 'Bedroom, Palava Fresca' },
    { id: '1604709177225-055f99402ea3', room: 'Living',   title: 'Compact TV wall, Lodha Acme' },
    { id: '1616486338812-3dadae4b4ace', room: 'Living',   title: 'Window wall, Lodha Venezia' },
    { id: '1616137466211-f939a420be84', room: 'Bathroom', title: 'Bath in fluted stone' },
    { id: '1524758631624-e2822e304c36', room: 'Living',   title: 'Styled corner, Thane' },
    { id: '1497366811353-6870744d04b2', room: 'Living',   title: 'Console and mirror unit' },
    { id: '1505691938895-1758d7feb511', room: 'Kids',     title: "Children's room, Lodha Venezia" },
    { id: '1631679706909-1844bbd07221', room: 'Kitchen',  title: 'Island kitchen, Palava Fresca' },
    { id: '1493809842364-78817add7ffb', room: 'Living',   title: 'Reading corner' }
  ];

  var ROOMS = ['All rooms', 'Living', 'Kitchen', 'Bedroom', 'Wardrobe', 'Bathroom', 'Kids'];

  /* ---------------------------------------------------------------- hero
     The scroll-scrubbed hero on the home page. As the visitor scrolls
     through the hero these cross-dissolve and push in, and `line` becomes
     the headline for that scene.

     THIS IS THE ONE PLACE TO SWAP IN THE STUDIO'S REAL TOUR PHOTOS.
     Replace each `id` with a real photograph and adjust `line` to suit —
     nothing else needs touching. Four to six wide shots work best, ideally
     moving through a home in the order someone would walk it. Scene one is
     also the page's poster: it is the image in the HTML, the one that shows
     before any script runs, and the only one shown under reduced motion —
     so make it the strongest frame.

     Keep `line` short. It is set at the hero size, so anything past about
     five words wraps to three lines on a phone. */
  var HERO_SCENES = [
    {
      id: '1600585154340-be6161a56a0c',
      alt: 'Living room in morning light, a Mumbai apartment styled by Samiksha Warde Designs',
      line: 'Turning your house into a home'
    },
    {
      id: '1600489000022-c2086d79f9d4',
      alt: 'Modular kitchen with a honed stone counter',
      line: 'Planned around how you live'
    },
    {
      id: '1595526114035-0d45ed16cfbf',
      alt: 'A styled bedroom with soft morning light',
      line: 'Styled to the last shelf'
    },
    {
      id: '1586023492125-27b2c045efd7',
      alt: 'Open plan living and dining room',
      line: 'Ready the day you move in'
    }
  ];

  /* The two groups the projects page filters on. */
  var CATEGORIES = ['All work', 'Full home', 'Styling'];

  var PROJECTS = [
    {
      slug: 'vihang-hills',
      title: 'Vihang Hills, Thane',
      category: 'Full home',
      typology: '2 BHK apartment',
      area: '1,050 sq ft',
      year: '2025',
      img: '1586023492125-27b2c045efd7'
    },
    {
      slug: 'lodha-palava',
      title: 'Lodha Palava, Dombivli',
      category: 'Full home',
      typology: '2 BHK apartment',
      area: '980 sq ft',
      year: '2025',
      img: '1600489000022-c2086d79f9d4'
    },
    {
      slug: 'hiranandani-estate',
      title: 'Hiranandani Estate, Thane',
      category: 'Styling',
      typology: '3 BHK apartment',
      area: '1,450 sq ft',
      year: '2025',
      img: '1556909212-d5b604d0c90d'
    },
    {
      slug: 'palava-fresca',
      title: 'Palava Fresca, Dombivli',
      category: 'Full home',
      typology: '1 BHK apartment',
      area: '640 sq ft',
      year: '2024',
      img: '1595526114035-0d45ed16cfbf'
    },
    {
      slug: 'lodha-acme',
      title: 'Lodha Acme, Mumbai',
      category: 'Styling',
      typology: '2 BHK apartment',
      area: '870 sq ft',
      year: '2024',
      img: '1604709177225-055f99402ea3'
    },
    {
      slug: 'lodha-venezia',
      title: 'Lodha Venezia, Parel',
      category: 'Full home',
      typology: '3 BHK apartment',
      area: '1,620 sq ft',
      year: '2025',
      img: '1616486338812-3dadae4b4ace'
    }
  ];

  global.SITE_DATA = {
    unsplash: unsplash,
    SHOTS: SHOTS,
    ROOMS: ROOMS,
    CATEGORIES: CATEGORIES,
    HERO_SCENES: HERO_SCENES,
    PROJECTS: PROJECTS
  };
})(window);
