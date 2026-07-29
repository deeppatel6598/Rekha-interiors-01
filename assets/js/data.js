/* ==========================================================================
   Rekha Interiors — shared content data
   --------------------------------------------------------------------------
   PLACEHOLDER CONTENT. Every photograph referenced here is an Unsplash stock
   image, and each project's area and year is illustrative — written so the
   layouts can be judged at full length. Before going live, replace:

     · `id` / `img`   → paths to the studio's own photographs
     · `area`, `year` → the real figures for each project

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
    { id: '1600585154340-be6161a56a0c', room: 'Living',   title: 'Sofa wall, Baner' },
    { id: '1600489000022-c2086d79f9d4', room: 'Kitchen',  title: 'Stone counter, Hinjewadi' },
    { id: '1556909212-d5b604d0c90d',    room: 'Bedroom',  title: 'Master bedroom, NIBM Road' },
    { id: '1583847268964-b28dc8f51f92', room: 'Wardrobe', title: 'Sliding wardrobe, Baner' },
    { id: '1586023492125-27b2c045efd7', room: 'Living',   title: 'Open plan living and dining' },
    { id: '1617806118233-18e1de247200', room: 'Kitchen',  title: 'Breakfast counter, Kharadi' },
    { id: '1595526114035-0d45ed16cfbf', room: 'Bedroom',  title: 'Guest bedroom, Shankeshwar' },
    { id: '1604709177225-055f99402ea3', room: 'Living',   title: 'TV unit in oak veneer' },
    { id: '1616486338812-3dadae4b4ace', room: 'Living',   title: 'Riverfront flat, Pune' },
    { id: '1616137466211-f939a420be84', room: 'Bathroom', title: 'Bath in fluted stone' },
    { id: '1524758631624-e2822e304c36', room: 'Office',   title: 'Meeting room, Hinjewadi' },
    { id: '1497366811353-6870744d04b2', room: 'Office',   title: 'Workstations, Baner' },
    { id: '1505691938895-1758d7feb511', room: 'Bedroom',  title: 'Kids bedroom, NIBM Road' },
    { id: '1631679706909-1844bbd07221', room: 'Kitchen',  title: 'Island kitchen, Balewadi' },
    { id: '1493809842364-78817add7ffb', room: 'Living',   title: 'Reading corner' }
  ];

  var ROOMS = ['All rooms', 'Living', 'Kitchen', 'Bedroom', 'Wardrobe', 'Bathroom', 'Office'];

  var PROJECTS = [
    {
      slug: 'la-vida-baner',
      title: 'La Vida, Baner',
      category: 'Residential',
      typology: '3 BHK apartment',
      area: '1,450 sq ft',
      year: '2025',
      img: '1586023492125-27b2c045efd7'
    },
    {
      slug: 'eon-homes-hinjewadi',
      title: 'Eon Homes, Hinjewadi',
      category: 'Residential',
      typology: '2 BHK apartment',
      area: '1,050 sq ft',
      year: '2025',
      img: '1600489000022-c2086d79f9d4'
    },
    {
      slug: 'nibm-road',
      title: 'NIBM Road',
      category: 'Residential',
      typology: '3 BHK apartment',
      area: '1,620 sq ft',
      year: '2024',
      img: '1556909212-d5b604d0c90d'
    },
    {
      slug: 'shankeshwar',
      title: 'Shankeshwar',
      category: 'Residential',
      typology: '2 BHK apartment',
      area: '980 sq ft',
      year: '2024',
      img: '1595526114035-0d45ed16cfbf'
    },
    {
      slug: 'riverfront',
      title: 'Riverfront',
      category: 'Residential',
      typology: '4 BHK apartment',
      area: '2,300 sq ft',
      year: '2025',
      img: '1616486338812-3dadae4b4ace'
    },
    {
      slug: 'balewadi-office',
      title: 'Balewadi office',
      category: 'Commercial',
      typology: 'Office fit-out',
      area: '3,200 sq ft',
      year: '2025',
      img: '1497366811353-6870744d04b2'
    }
  ];

  global.REKHA = {
    unsplash: unsplash,
    SHOTS: SHOTS,
    ROOMS: ROOMS,
    PROJECTS: PROJECTS
  };
})(window);
