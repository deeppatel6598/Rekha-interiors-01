/* Rekha Interiors — page routing, gallery filters, lightbox, scroll reveal. */

(function () {
  'use strict';

  var unsplash = function (id, w) {
    return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + (w || 1200) + '&q=70';
  };

  var SHOTS = [
    { id: '1600585154340-be6161a56a0c', room: 'Living', title: 'Sofa wall, Baner' },
    { id: '1600489000022-c2086d79f9d4', room: 'Kitchen', title: 'Stone counter, Hinjewadi' },
    { id: '1556909212-d5b604d0c90d', room: 'Bedroom', title: 'Master bedroom, NIBM Road' },
    { id: '1583847268964-b28dc8f51f92', room: 'Wardrobe', title: 'Sliding wardrobe, Baner' },
    { id: '1586023492125-27b2c045efd7', room: 'Living', title: 'Open plan living and dining' },
    { id: '1617806118233-18e1de247200', room: 'Kitchen', title: 'Breakfast counter, Kharadi' },
    { id: '1595526114035-0d45ed16cfbf', room: 'Bedroom', title: 'Guest bedroom, Shankeshwar' },
    { id: '1604709177225-055f99402ea3', room: 'Living', title: 'TV unit in oak veneer' },
    { id: '1616486338812-3dadae4b4ace', room: 'Living', title: 'Riverfront flat, Pune' },
    { id: '1616137466211-f939a420be84', room: 'Bathroom', title: 'Bath in fluted stone' },
    { id: '1524758631624-e2822e304c36', room: 'Office', title: 'Meeting room, Hinjewadi' },
    { id: '1497366811353-6870744d04b2', room: 'Office', title: 'Workstations, Baner' },
    { id: '1505691938895-1758d7feb511', room: 'Bedroom', title: 'Kids bedroom, NIBM Road' },
    { id: '1631679706909-1844bbd07221', room: 'Kitchen', title: 'Island kitchen, Balewadi' },
    { id: '1493809842364-78817add7ffb', room: 'Living', title: 'Reading corner' }
  ];

  var PROJECTS = [
    { title: 'La-Vida, Baner', meta: 'Residential · 3 BHK · Pune', id: '1586023492125-27b2c045efd7', go: 'gallery' },
    { title: 'Eon Homes, Hinjewadi', meta: 'Residential · 2 BHK · Pune', id: '1600489000022-c2086d79f9d4', go: 'gallery' },
    { title: 'NIBM Road', meta: 'Residential · 3 BHK · Pune', id: '1556909212-d5b604d0c90d', go: 'gallery' },
    { title: 'Shankeshwar', meta: 'Residential · 2 BHK · Pune', id: '1595526114035-0d45ed16cfbf', go: 'gallery' },
    { title: 'Riverfront', meta: 'Residential · 4 BHK · Pune', id: '1616486338812-3dadae4b4ace', go: 'gallery' },
    { title: 'Balewadi office', meta: 'Commercial · Fit-out · Pune', id: '1497366811353-6870744d04b2', go: 'gallery' }
  ];

  var ROOMS = ['All rooms', 'Living', 'Kitchen', 'Bedroom', 'Wardrobe', 'Bathroom', 'Office'];
  var PAGES = ['home', 'gallery', 'projects', 'contact'];

  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };

  var state = { page: 'home', room: 'All rooms', light: -1 };

  /* ---------------------------------------------------------------- routing */

  var menu = $('#mobile-menu');
  var menuToggle = $('#menu-toggle');

  function closeMenu() {
    menu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  function setPage(page, opts) {
    if (PAGES.indexOf(page) === -1) page = 'home';
    state.page = page;
    document.body.dataset.page = page;

    PAGES.forEach(function (p) {
      $('#page-' + p).hidden = p !== page;
    });

    $$('[data-nav]').forEach(function (el) {
      if (el.dataset.nav === page) el.setAttribute('aria-current', 'page');
      else el.removeAttribute('aria-current');
    });

    $('#sticky-bar').hidden = page === 'contact';

    closeMenu();
    closeLightbox();

    if (window.location.hash !== '#' + page) {
      window.history.replaceState(null, '', '#' + page);
    }
    if (!opts || !opts.silent) window.scrollTo(0, 0);

    revealSetup();
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('[data-nav]');
    if (!link) return;
    e.preventDefault();
    setPage(link.dataset.nav);
  });

  menuToggle.addEventListener('click', function () {
    var open = menu.hidden;
    menu.hidden = !open;
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  window.addEventListener('hashchange', function () {
    setPage(window.location.hash.replace('#', ''));
  });

  /* ------------------------------------------------------------ card render */

  function projectCard(p) {
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'project-card';

    var img = document.createElement('div');
    img.className = 'project-card__image';
    img.style.backgroundImage = 'url(' + unsplash(p.id, 900) + ')';

    var title = document.createElement('div');
    title.className = 'project-card__title';
    title.textContent = p.title;

    var meta = document.createElement('div');
    meta.className = 'project-card__meta';
    meta.textContent = p.meta;

    var action = document.createElement('span');
    action.className = 'project-card__action';
    action.textContent = 'See the project';

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(action);
    card.addEventListener('click', function () { setPage(p.go); });
    return card;
  }

  function renderProjects() {
    var home = $('#home-projects');
    var all = $('#projects-grid');
    PROJECTS.slice(0, 3).forEach(function (p) {
      home.appendChild(projectCard({ title: p.title, meta: p.meta, id: p.id, go: 'projects' }));
    });
    PROJECTS.forEach(function (p) { all.appendChild(projectCard(p)); });
  }

  /* ---------------------------------------------------------------- gallery */

  function visibleShots() {
    return SHOTS.filter(function (s) {
      return state.room === 'All rooms' || s.room === state.room;
    });
  }

  function renderFilters() {
    var wrap = $('#room-filters');
    wrap.textContent = '';
    ROOMS.forEach(function (room) {
      var count = room === 'All rooms'
        ? SHOTS.length
        : SHOTS.filter(function (s) { return s.room === room; }).length;

      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.setAttribute('aria-pressed', state.room === room ? 'true' : 'false');

      var label = document.createElement('span');
      label.textContent = room;
      var detail = document.createElement('span');
      detail.className = 'chip__count';
      detail.textContent = String(count);

      chip.appendChild(label);
      chip.appendChild(detail);
      chip.addEventListener('click', function () {
        state.room = room;
        state.light = -1;
        renderFilters();
        renderGallery();
        revealSetup();
      });
      wrap.appendChild(chip);
    });
  }

  function renderGallery() {
    var grid = $('#gallery-grid');
    grid.textContent = '';
    visibleShots().forEach(function (shot, i) {
      var fig = document.createElement('button');
      fig.type = 'button';
      fig.className = 'shot';
      fig.setAttribute('data-reveal', '');

      var img = document.createElement('img');
      img.src = unsplash(shot.id, 1000);
      img.alt = shot.title + ', ' + shot.room.toLowerCase() + ', Pune';
      img.loading = 'lazy';

      var caption = document.createElement('span');
      caption.className = 'shot__caption';
      caption.textContent = shot.title;

      fig.appendChild(img);
      fig.appendChild(caption);
      fig.addEventListener('click', function () { openLightbox(i); });
      grid.appendChild(fig);
    });
  }

  /* --------------------------------------------------------------- lightbox */

  var lightbox = $('#lightbox');
  var lightboxImage = $('#lightbox-image');
  var lightboxCaption = $('#lightbox-caption');
  var lastFocus = null;

  function paintLightbox() {
    var list = visibleShots();
    var shot = list[state.light];
    if (!shot) return;
    lightboxImage.src = unsplash(shot.id, 1800);
    lightboxImage.alt = shot.title;
    lightboxCaption.textContent =
      shot.title + ' · ' + shot.room + ' · ' + (state.light + 1) + ' of ' + list.length;
  }

  function openLightbox(index) {
    state.light = index;
    lastFocus = document.activeElement;
    lightbox.hidden = false;
    document.body.classList.add('no-scroll');
    paintLightbox();
    $('#lightbox-close').focus();
  }

  function closeLightbox() {
    if (lightbox.hidden) return;
    state.light = -1;
    lightbox.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function stepLightbox(delta) {
    var list = visibleShots();
    if (!list.length) return;
    state.light = (state.light + delta + list.length) % list.length;
    paintLightbox();
  }

  $('#lightbox-prev').addEventListener('click', function (e) { e.stopPropagation(); stepLightbox(-1); });
  $('#lightbox-next').addEventListener('click', function (e) { e.stopPropagation(); stepLightbox(1); });
  $('#lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target === lightboxImage) closeLightbox();
  });

  window.addEventListener('keydown', function (e) {
    if (lightbox.hidden) {
      if (e.key === 'Escape' && !menu.hidden) closeMenu();
      return;
    }
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') stepLightbox(1);
    if (e.key === 'ArrowLeft') stepLightbox(-1);
  });

  /* ------------------------------------------------------------------- form */

  var form = $('#quote-form');
  var sent = $('#form-sent');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    form.hidden = true;
    sent.hidden = false;
    sent.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });

  $('#form-reset').addEventListener('click', function () {
    form.reset();
    sent.hidden = true;
    form.hidden = false;
  });

  /* ----------------------------------------------------------------- reveal */

  var observer = null;

  function revealSetup() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!observer) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove('is-hidden');
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -6% 0px' });
    }
    requestAnimationFrame(function () {
      $$('[data-reveal]').forEach(function (el) {
        if (el.dataset.revealed) return;
        el.dataset.revealed = '1';
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
        el.classList.add('is-hidden');
        observer.observe(el);
      });
    });
  }

  /* ------------------------------------------------------------------- boot */

  renderProjects();
  renderFilters();
  renderGallery();
  setPage(window.location.hash.replace('#', '') || 'home', { silent: true });
})();
