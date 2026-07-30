/* ==========================================================================
   Samiksha Warde Designs — behaviour
   --------------------------------------------------------------------------
   Progressive enhancement throughout. Every page renders complete and
   readable with this file blocked; what follows adds motion, filtering and
   the lightbox on top of working markup.

   Contents
     1  environment          6  counters
     2  page transition      7  project cards
     3  navigation           8  gallery
     4  scroll engine        9  lightbox
     5  reveal + stagger    10  quote form
   ========================================================================== */

(function () {
  'use strict';

  var doc = document;
  var body = doc.body;

  var $ = function (sel, scope) { return (scope || doc).querySelector(sel); };
  var $$ = function (sel, scope) {
    return Array.prototype.slice.call((scope || doc).querySelectorAll(sel));
  };

  var DATA = window.SITE_DATA ||
    { SHOTS: [], ROOMS: [], CATEGORIES: [], PROJECTS: [], unsplash: function () { return ''; } };
  var BASE = body.dataset.root || '';

  /* ======================================================== 1. environment */

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = motionQuery.matches;

  /* Listening rather than reading once: the visitor can change the system
     setting while the page is open, and the animations must stop there and
     then rather than at the next navigation. */
  var onMotionChange = function (e) { reduced = e.matches; };
  if (motionQuery.addEventListener) motionQuery.addEventListener('change', onMotionChange);
  else if (motionQuery.addListener) motionQuery.addListener(onMotionChange);

  var supportsIO = 'IntersectionObserver' in window;

  /* ==================================================== 2. page transition

     Handled entirely in CSS — a `page-in` keyframe on arrival, plus
     `@view-transition` for the cross-document fade in browsers that support
     it. Deliberately no JavaScript: an earlier version intercepted every
     link click, cancelled the default and navigated from a timer, which
     meant a link only worked if that timer fired. Two clicks in quick
     succession could race each other, and a failed script would have left
     the whole site unclickable. Native navigation cannot fail that way. */

  /* ========================================================= 3. navigation */

  var menu = $('#mobile-menu');
  var menuToggle = $('#menu-toggle');

  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  }

  if (menu && menuToggle) {
    menuToggle.addEventListener('click', function () {
      var opening = menu.hidden;
      menu.hidden = !opening;
      menuToggle.setAttribute('aria-expanded', opening ? 'true' : 'false');
    });

    /* Anywhere outside the header dismisses it, the way a native sheet does. */
    doc.addEventListener('click', function (e) {
      if (menu.hidden) return;
      if (e.target.closest('.mobile-header')) return;
      closeMenu();
    });
  }

  /* ====================================================== 4. scroll engine
     One passive listener and one rAF frame drive the progress bar, the
     retracting header, the enquiry bar and every parallax layer, so no
     amount of added chrome costs a second scroll handler. */

  var navShell = $('.global-nav-shell');
  var mobileHeader = $('.mobile-header');
  var progressBar = $('.scroll-progress');
  var stickyBar = $('.sticky-bar');
  var parallaxEls = $$('[data-parallax]');

  var lastY = window.pageYOffset;
  var ticking = false;
  var tucked = false;

  function setTucked(next) {
    if (next === tucked) return;
    tucked = next;
    if (navShell) navShell.classList.toggle('is-tucked', next);
    if (mobileHeader) mobileHeader.classList.toggle('is-tucked', next);
    if (next) closeMenu();
  }

  function frame() {
    ticking = false;
    var y = window.pageYOffset;
    var viewport = window.innerHeight;
    var max = doc.documentElement.scrollHeight - viewport;

    if (progressBar) {
      progressBar.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : '0');
    }

    /* Reading downward retracts the header; the first upward movement
       brings it straight back. Near the top it is always shown. */
    var delta = y - lastY;
    if (y < 120) setTucked(false);
    else if (delta > 4) setTucked(true);
    else if (delta < -4) setTucked(false);

    if (stickyBar) {
      /* Held back until the visitor has actually committed to the page,
         and stood down again over the footer so it never covers it. */
      var nearEnd = max - y < 220;
      stickyBar.classList.toggle('is-stowed', y < viewport * 0.6 || nearEnd);
    }

    if (!reduced && parallaxEls.length) {
      for (var i = 0; i < parallaxEls.length; i++) {
        var el = parallaxEls[i];
        var rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > viewport + 200) continue;
        var speed = parseFloat(el.dataset.parallax) || 0.16;
        var mid = rect.top + rect.height / 2 - viewport / 2;
        el.style.setProperty('--py', (mid * -speed).toFixed(1) + 'px');
      }
    }

    lastY = y;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(frame);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  frame();

  /* ==================================================== 5. reveal + stagger */

  /* Splitting a heading into per-word masks. Each word carries its own
     overflow box so that a heading which wraps to three lines still rises
     line by line instead of sliding across the line above it. */
  function splitWords(el) {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = '1';

    var text = el.textContent.replace(/\s+/g, ' ').trim();
    var words = text.split(' ');
    var frag = doc.createDocumentFragment();

    words.forEach(function (word, i) {
      var mask = doc.createElement('span');
      mask.className = 'split-word-mask';

      var inner = doc.createElement('span');
      inner.className = 'split-word';
      inner.textContent = word;
      inner.style.setProperty('--wd', (i * 55) + 'ms');

      mask.appendChild(inner);
      frag.appendChild(mask);
      if (i < words.length - 1) frag.appendChild(doc.createTextNode(' '));
    });

    /* The visible text is now a pile of spans, so the original string is
       restored to assistive technology as a single readable label. */
    el.setAttribute('aria-label', text);
    el.textContent = '';
    el.appendChild(frag);
  }

  if (!reduced) $$('[data-split]').forEach(splitWords);

  $$('[data-stagger]').forEach(function (group) {
    var children = Array.prototype.slice.call(group.children);
    children.forEach(function (child, i) { child.style.setProperty('--i', i); });
  });

  function markIn(el) {
    el.classList.add('is-in');
    if (el.hasAttribute('data-count')) runCounter(el);
    $$('[data-count]', el).forEach(runCounter);
  }

  var revealObserver = null;

  if (supportsIO) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var el = entry.target;
        if (entry.isIntersecting) {
          markIn(el);
        } else {
          /* Re-arm from whichever edge it left by, so scrolling back up
             replays the entrance in the direction of travel rather than
             snapping the element into place. */
          el.dataset.from = entry.boundingClientRect.top > 0 ? 'below' : 'above';
          el.classList.remove('is-in');
        }
      });
    }, { rootMargin: '-4% 0px -8% 0px', threshold: 0 });

    $$('[data-reveal], [data-split], [data-count]').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    $$('[data-reveal], [data-split], [data-count]').forEach(markIn);
  }

  /* Anything added to the page later — filtered cards, rendered grids —
     joins the same observer. */
  function observeNew(scope) {
    var targets = $$('[data-reveal], [data-split], [data-count]', scope);
    if (scope.hasAttribute && scope.hasAttribute('data-reveal')) targets.push(scope);
    targets.forEach(function (el) {
      if (revealObserver) revealObserver.observe(el);
      else markIn(el);
    });
  }

  /* ============================================================ 6. counters */

  function runCounter(el) {
    if (el.dataset.counting === '1') return;

    var target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;

    var suffix = el.dataset.suffix || '';
    var prefix = el.dataset.prefix || '';

    if (reduced) {
      el.textContent = prefix + target.toLocaleString('en-IN') + suffix;
      return;
    }

    el.dataset.counting = '1';
    var duration = parseInt(el.dataset.duration, 10) || 1500;
    var start = 0;

    function tick(now) {
      if (!start) start = now;
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + Math.round(eased * target).toLocaleString('en-IN') + suffix;
      if (t < 1) window.requestAnimationFrame(tick);
      else el.dataset.counting = '0';
    }

    window.requestAnimationFrame(tick);
  }

  /* ======================================================= 7. project cards */

  function projectCard(p) {
    var card = doc.createElement('a');
    card.className = 'project-card';
    card.href = BASE + 'projects/' + p.slug + '.html';
    card.setAttribute('data-reveal', '');

    var frame = doc.createElement('div');
    frame.className = 'project-card__frame';

    var img = doc.createElement('img');
    img.className = 'project-card__image';
    img.src = DATA.unsplash(p.img, 800);
    img.alt = p.title + ' — ' + p.typology + ' by Samiksha Warde Designs';
    img.loading = 'lazy';
    img.width = 800;
    img.height = 600;

    var tag = doc.createElement('span');
    tag.className = 'project-card__tag';
    tag.textContent = p.category;

    frame.appendChild(img);
    frame.appendChild(tag);

    var bodyEl = doc.createElement('div');
    bodyEl.className = 'project-card__body';

    var title = doc.createElement('span');
    title.className = 'project-card__title';
    title.textContent = p.title;

    var meta = doc.createElement('span');
    meta.className = 'project-card__meta';
    meta.textContent = p.typology + ' · ' + p.area + ' · ' + p.year;

    var action = doc.createElement('span');
    action.className = 'project-card__action';
    action.textContent = 'See the project';

    bodyEl.appendChild(title);
    bodyEl.appendChild(meta);
    bodyEl.appendChild(action);

    card.appendChild(frame);
    card.appendChild(bodyEl);
    return card;
  }

  var projectState = { filter: 'All work' };

  function renderProjects() {
    $$('[data-projects]').forEach(function (grid) {
      var limit = parseInt(grid.dataset.limit, 10) || 0;
      var exclude = grid.dataset.exclude || '';
      var useFilter = grid.hasAttribute('data-filterable');

      var list = DATA.PROJECTS.filter(function (p) {
        if (p.slug === exclude) return false;
        if (useFilter && projectState.filter !== 'All work' && p.category !== projectState.filter) return false;
        return true;
      });

      if (limit) list = list.slice(0, limit);

      grid.textContent = '';
      list.forEach(function (p) { grid.appendChild(projectCard(p)); });

      Array.prototype.slice.call(grid.children).forEach(function (child, i) {
        child.style.setProperty('--i', i);
      });

      observeNew(grid);
    });
  }

  function renderProjectFilters() {
    var wrap = $('[data-project-filters]');
    if (!wrap) return;

    var groups = DATA.CATEGORIES && DATA.CATEGORIES.length
      ? DATA.CATEGORIES
      : ['All work'];
    wrap.textContent = '';

    groups.forEach(function (name) {
      var count = name === 'All work'
        ? DATA.PROJECTS.length
        : DATA.PROJECTS.filter(function (p) { return p.category === name; }).length;

      var chip = doc.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.setAttribute('aria-pressed', projectState.filter === name ? 'true' : 'false');

      var label = doc.createElement('span');
      label.textContent = name;
      var num = doc.createElement('span');
      num.className = 'chip__count';
      num.textContent = String(count);

      chip.appendChild(label);
      chip.appendChild(num);
      chip.addEventListener('click', function () {
        projectState.filter = name;
        renderProjectFilters();
        renderProjects();
      });

      wrap.appendChild(chip);
    });
  }

  renderProjectFilters();
  renderProjects();

  /* ============================================================= 8. gallery */

  var galleryState = { room: 'All rooms' };

  function visibleShots() {
    return DATA.SHOTS.filter(function (s) {
      return galleryState.room === 'All rooms' || s.room === galleryState.room;
    });
  }

  function renderRoomFilters() {
    var wrap = $('#room-filters');
    if (!wrap) return;
    wrap.textContent = '';

    DATA.ROOMS.forEach(function (room) {
      var count = room === 'All rooms'
        ? DATA.SHOTS.length
        : DATA.SHOTS.filter(function (s) { return s.room === room; }).length;

      if (!count) return;

      var chip = doc.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.setAttribute('aria-pressed', galleryState.room === room ? 'true' : 'false');

      var label = doc.createElement('span');
      label.textContent = room;
      var num = doc.createElement('span');
      num.className = 'chip__count';
      num.textContent = String(count);

      chip.appendChild(label);
      chip.appendChild(num);
      chip.addEventListener('click', function () {
        galleryState.room = room;
        renderRoomFilters();
        renderGallery();
      });

      wrap.appendChild(chip);
    });
  }

  function renderGallery() {
    var grid = $('#gallery-grid');
    if (!grid) return;

    var shots = visibleShots();
    grid.textContent = '';

    var status = $('#gallery-status');
    if (status) {
      status.textContent = shots.length + ' photograph' + (shots.length === 1 ? '' : 's') +
        (galleryState.room === 'All rooms' ? '' : ' in ' + galleryState.room.toLowerCase());
    }

    shots.forEach(function (shot, i) {
      var fig = doc.createElement('button');
      fig.type = 'button';
      fig.className = 'shot';
      fig.setAttribute('data-reveal', '');
      fig.style.setProperty('--i', i % 6);

      var media = doc.createElement('span');
      media.className = 'shot__media';

      var img = doc.createElement('img');
      img.src = DATA.unsplash(shot.id, 900);
      img.alt = shot.title + ' — ' + shot.room.toLowerCase() +
        ' interior by Samiksha Warde Designs, Mumbai';
      img.loading = 'lazy';
      media.appendChild(img);

      var caption = doc.createElement('span');
      caption.className = 'shot__caption';

      var name = doc.createElement('span');
      name.textContent = shot.title;
      var room = doc.createElement('span');
      room.className = 'shot__room';
      room.textContent = shot.room;

      caption.appendChild(name);
      caption.appendChild(room);

      fig.appendChild(media);
      fig.appendChild(caption);
      fig.addEventListener('click', function () {
        Lightbox.open(shots.map(function (s) {
          return { src: DATA.unsplash(s.id, 1800), caption: s.title, meta: s.room };
        }), i);
      });

      grid.appendChild(fig);
    });

    observeNew(grid);
  }

  renderRoomFilters();
  renderGallery();

  /* ============================================================ 9. lightbox */

  var Lightbox = (function () {
    var el = $('#lightbox');
    if (!el) return { open: function () {} };

    var image = $('#lightbox-image');
    var caption = $('#lightbox-caption');
    var btnPrev = $('#lightbox-prev');
    var btnNext = $('#lightbox-next');
    var btnClose = $('#lightbox-close');

    var items = [];
    var index = 0;
    var lastFocus = null;

    function paint() {
      var item = items[index];
      if (!item) return;
      image.src = item.src;
      image.alt = item.caption;
      caption.textContent = item.caption +
        (item.meta ? ' · ' + item.meta : '') +
        ' · ' + (index + 1) + ' of ' + items.length;
      var single = items.length < 2;
      btnPrev.hidden = single;
      btnNext.hidden = single;
    }

    function open(list, start) {
      if (!list || !list.length) return;
      items = list;
      index = start || 0;
      lastFocus = doc.activeElement;
      el.hidden = false;
      body.classList.add('no-scroll');
      paint();
      btnClose.focus();
    }

    function close() {
      if (el.hidden) return;
      el.hidden = true;
      body.classList.remove('no-scroll');
      image.src = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function step(delta) {
      if (!items.length) return;
      index = (index + delta + items.length) % items.length;
      paint();
    }

    btnPrev.addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
    btnNext.addEventListener('click', function (e) { e.stopPropagation(); step(1); });
    btnClose.addEventListener('click', close);

    el.addEventListener('click', function (e) {
      if (e.target === el || e.target === image) close();
    });

    /* Focus must not escape the dialog while it is modal. */
    el.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusables = $$('button:not([hidden])', el);
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    window.addEventListener('keydown', function (e) {
      if (el.hidden) {
        if (e.key === 'Escape' && menu && !menu.hidden) closeMenu();
        return;
      }
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    });

    return { open: open, close: close };
  })();

  /* Project pages declare their own image set in markup. */
  var lightboxGroup = $$('[data-lightbox-item]');
  if (lightboxGroup.length) {
    var groupItems = lightboxGroup.map(function (btn) {
      return {
        src: btn.dataset.full || btn.querySelector('img').src,
        caption: btn.dataset.caption || '',
        meta: btn.dataset.meta || ''
      };
    });
    lightboxGroup.forEach(function (btn, i) {
      btn.addEventListener('click', function () { Lightbox.open(groupItems, i); });
    });
  }

  /* ========================================================== 10. quote form */

  var form = $('#quote-form');
  var sent = $('#form-sent');

  if (form && sent) {
    var MESSAGES = {
      valueMissing: 'This one is required.',
      typeMismatch: 'Check the format of this.',
      tooShort: 'A little more detail, please.'
    };

    function errorFor(field) {
      var id = field.name + '-error';
      var node = doc.getElementById(id);
      if (!node) {
        node = doc.createElement('span');
        node.className = 'field-error';
        node.id = id;
        field.parentNode.appendChild(node);
      }
      return node;
    }

    function validate(field) {
      var node = errorFor(field);
      if (field.validity.valid) {
        node.textContent = '';
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
        return true;
      }
      var key = ['valueMissing', 'typeMismatch', 'tooShort'].find(function (k) {
        return field.validity[k];
      });
      node.textContent = MESSAGES[key] || 'Please check this field.';
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', node.id);
      return false;
    }

    /* Validating on blur rather than on every keystroke — an error that
       appears while someone is still mid-word reads as an accusation. */
    $$('input, select, textarea', form).forEach(function (field) {
      field.addEventListener('blur', function () { validate(field); });
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid')) validate(field);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var fields = $$('input, select, textarea', form);
      var firstBad = null;

      fields.forEach(function (field) {
        if (!validate(field) && !firstBad) firstBad = field;
      });

      if (firstBad) {
        firstBad.focus();
        return;
      }

      /* No back end is wired up yet — see README. The panel below is what
         the visitor sees; the values are left in the form's own state. */
      form.hidden = true;
      sent.hidden = false;
      sent.setAttribute('tabindex', '-1');
      sent.focus();
      sent.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
    });

    var resetBtn = $('#form-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        form.reset();
        $$('.field-error', form).forEach(function (n) { n.textContent = ''; });
        $$('[aria-invalid]', form).forEach(function (n) { n.removeAttribute('aria-invalid'); });
        sent.hidden = true;
        form.hidden = false;
        var first = $('input, select, textarea', form);
        if (first) first.focus();
      });
    }
  }

  /* Year in the footer, so the notice never goes stale. */
  $$('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
