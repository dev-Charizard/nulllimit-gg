/* =====================================================================
   null;limit — /intro.js
   The one script. Everything here is progressive: with JS off the page
   renders complete, the form posts natively, and nothing is gated.

   1. intro     — the jump-discontinuity sequence (plays once)
   2. counter   — builds.shipped counts up, then pulses its glow pool once
   3. type      — the cycling placeholder on "What are we building?"
   4. form      — validation + Formspree submit + mailto fallback
   5. cursor    — thin silver ring, fine pointers only
   6. reveal    — scroll reveal on sections and rows, fires once
   ===================================================================== */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var INTRO_KEY = 'nl:intro';

  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function read(k)     { try { return localStorage.getItem(k); } catch (e) { return null; } }

  /* Typewriter. ~28ms/char ±12ms jitter — even timing reads as fake.
     Returns a handle with .cancel(). */
  function typeInto(el, text, opts, done) {
    opts = opts || {};
    var base = opts.speed || 28, jit = opts.jitter == null ? 12 : opts.jitter;
    var i = 0, t = null, live = true;
    function tick() {
      if (!live) return;
      el.textContent = text.slice(0, ++i);
      if (i < text.length) t = setTimeout(tick, base + (Math.random() * 2 - 1) * jit);
      else if (done) done();
    }
    t = setTimeout(tick, base);
    return { cancel: function () { live = false; clearTimeout(t); } };
  }


  /* -------------------------------------------------------------------
     1. INTRO
     ------------------------------------------------------------------- */
  function intro() {
    if (!root.classList.contains('nl-intro')) return;   // head script decided: seen, or flag set

    var LINES = [
      { text: '> null;limit',          ret: false },
      { text: '> const limit = null;', ret: false },
      { text: '> typeof limit',        ret: false },
      { text: '"undefined"',           ret: true  }
    ];

    var ov = doc.createElement('div');
    ov.className = 'intro';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-label', 'Intro');
    ov.innerHTML =
      '<div class="intro-in">' +
        '<div class="intro-term" aria-hidden="true">' +
          LINES.map(function (l) { return '<span class="ln' + (l.ret ? ' ret' : '') + '"></span>'; }).join('') +
        '</div>' +
        /* THE MARK — same geometry as mark-themable.svg. Rings carry the metal, bars do not.
           Bars are 330.6 long; rings r=107.4 → circumference ≈ 674.9. Rings stay open. */
        '<svg class="intro-mark" viewBox="-102.2 -102.2 1080.4 934.4" role="img" aria-label="null;limit">' +
          '<defs><linearGradient id="nlSilverIntro" gradientUnits="userSpaceOnUse" x1="-102.2" y1="-102.2" x2="978.2" y2="832.2">' +
            '<stop offset="0%" stop-color="#FFFFFF"/><stop offset="18%" stop-color="#B9BEC4"/><stop offset="38%" stop-color="#F4F6F8"/>' +
            '<stop offset="55%" stop-color="#8D949B"/><stop offset="72%" stop-color="#E6E9EC"/><stop offset="88%" stop-color="#A2A8AE"/>' +
            '<stop offset="100%" stop-color="#DFE3E6"/></linearGradient></defs>' +
          '<path class="seg bar" data-seg="b1" style="--len:330.6" d="M0 570.1H330.6"/>' +
          '<path class="seg bar" data-seg="b2" style="--len:330.6" d="M545.4 159.9H876.0"/>' +
          '<circle class="seg ring" data-seg="r1" style="--len:674.9" cx="438.0" cy="570.1" r="107.4"/>' +
          '<circle class="seg ring" data-seg="r2" style="--len:674.9" cx="438.0" cy="159.9" r="107.4"/>' +
        '</svg>' +
        '<p class="intro-line metal-text">THE LIMIT IS UNDEFINED.</p>' +
        '<button type="button" class="intro-door">[ the limit doesn’t exist → ]</button>' +
      '</div>' +
      '<span class="intro-skip" aria-hidden="true">[ click to skip ]</span>';
    doc.body.appendChild(ov);

    var lns  = ov.querySelectorAll('.ln');
    var seg  = {};
    Array.prototype.forEach.call(ov.querySelectorAll('.seg'), function (s) { seg[s.getAttribute('data-seg')] = s; });
    var line = ov.querySelector('.intro-line');
    var door = ov.querySelector('.intro-door');
    var skip = ov.querySelector('.intro-skip');

    var timers = [], typer = null, finished = false, closed = false;
    function after(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function clearAll() { timers.forEach(clearTimeout); timers = []; if (typer) typer.cancel(); }

    var blk = doc.createElement('span'); blk.className = 'cur-blk';

    function typeLine(i, next) {
      var l = LINES[i], el = lns[i];
      if (l.ret) {                       // a returned value prints, it isn't typed
        el.textContent = l.text; el.appendChild(blk); after(500, next); return;
      }
      el.appendChild(blk);
      var txt = doc.createTextNode(''); el.insertBefore(txt, blk);
      typer = typeInto(txt, l.text, {}, function () { after(260, next); });
    }

    function drawMark() {
      seg.b1.classList.add('in');                                  // 1. lower bar, from the left
      after(520,  function () { seg.r1.classList.add('in'); });    // 2. lower ring — the excluded endpoint
      /* 3. beat. the gap is the point. */
      after(1300, function () { seg.r2.classList.add('in'); });    // 4. upper ring
      after(1800, function () { seg.b2.classList.add('in'); });    // 5. upper bar, out to the right
      after(2500, function () { line.classList.add('show'); });    // beat 3
      after(3000, function () { door.classList.add('show'); finish(false); }); // beat 4
    }

    function play() {
      after(1500, function () { skip.classList.add('show'); });
      after(400, function () {
        typeLine(0, function () { typeLine(1, function () { typeLine(2, function () { typeLine(3, function () {
          blk.remove(); after(300, drawMark);
        }); }); }); });
      });
    }

    /* Finished state: everything visible, door up. */
    function finish(instant) {
      if (finished) return;
      finished = true;
      clearAll();
      if (instant) {
        LINES.forEach(function (l, i) { lns[i].textContent = l.text; });
        blk.remove();
        ov.classList.add('done');
      }
      skip.classList.remove('show');
      try { door.focus({ preventScroll: true }); } catch (e) { door.focus(); }
    }

    function close() {
      if (closed) return;
      closed = true;
      store(INTRO_KEY, '1');
      doc.removeEventListener('keydown', onKey, true);
      doc.removeEventListener('click', onClick, true);
      root.classList.remove('nl-intro');
      if (reduce) { ov.remove(); return; }
      ov.classList.add('out');
      setTimeout(function () { ov.remove(); }, 400);
    }

    /* Any click/tap/key skips to the finished state. From the finished state,
       Enter / Space / Escape or a click walks through the door. Tab keeps
       working so keyboard users can reach the button. */
    function onKey(e) {
      if (!finished) { e.preventDefault(); finish(true); return; }
      if (e.key === 'Tab' || e.key === 'Shift' || e.key === 'Alt' || e.key === 'Control' || e.key === 'Meta') return;
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') { e.preventDefault(); close(); }
    }
    function onClick(e) {
      if (!finished) { e.preventDefault(); finish(true); return; }
      /* finished: the door handles its own click; anything else also lets you through */
      if (e.target !== door) close();
    }
    door.addEventListener('click', function () { if (finished) close(); });
    doc.addEventListener('keydown', onKey, true);
    doc.addEventListener('click', onClick, true);

    if (reduce) finish(true); else play();
  }


  /* -------------------------------------------------------------------
     2. COUNTER — the number lives in the markup (#builds-n). We only animate it.
     ------------------------------------------------------------------- */
  function counter() {
    var el = doc.getElementById('builds-n');
    if (!el) return;
    var target = parseInt(el.textContent, 10);
    if (isNaN(target) || reduce || doc.hidden) return;        // hidden tab: rAF is paused, just show it
    var t0 = null, D = 600, settled = false;
    function settle() {
      if (settled) return;
      settled = true;
      el.textContent = String(target);
      /* one slow pulse of the green pool behind the counter, then it settles
         back to its resting opacity (the CSS transition does the easing) */
      var pool = doc.querySelector('.fx-glow--green');
      if (pool) {
        pool.style.opacity = '1';
        setTimeout(function () { pool.style.opacity = ''; }, 1400);
      }
    }
    function step(ts) {
      if (settled) return;
      if (t0 == null) t0 = ts;
      var p = Math.min(1, (ts - t0) / D);
      var e = 1 - Math.pow(1 - p, 3);                         // ease-out
      el.textContent = String(Math.round(target * e));
      if (p < 1) requestAnimationFrame(step); else settle();
    }
    el.textContent = '0';
    requestAnimationFrame(step);
    setTimeout(settle, D + 400);                              // never leave it stuck below the real number
  }


  /* -------------------------------------------------------------------
     3. PLACEHOLDER — cycles. Pauses on focus and when the field has a value.
     ------------------------------------------------------------------- */
  function placeholder() {
    var el = doc.getElementById('f-what');
    if (!el || reduce) return;                                // reduced motion: static first entry (from the HTML)
    var LIST = [
      'a rocketship',
      'an app my athletes actually open',
      'a database that never goes down',
      'a booking system that takes payment',
      'something nobody’s built yet'
    ];
    var i = 0, t = null, paused = false;
    function set(s) { el.setAttribute('placeholder', s); }
    function typeOut(s, cb) {
      var n = 0;
      (function tick() {
        if (paused) return;
        set(s.slice(0, ++n));
        if (n < s.length) t = setTimeout(tick, 28 + (Math.random() * 2 - 1) * 12); else t = setTimeout(cb, 2000);
      })();
    }
    function wipe(s, cb) {
      var n = s.length;
      (function tick() {
        if (paused) return;
        set(s.slice(0, --n));
        if (n > 0) t = setTimeout(tick, 16); else t = setTimeout(cb, 350);
      })();
    }
    function cycle() { var s = LIST[i]; typeOut(s, function () { wipe(s, function () { i = (i + 1) % LIST.length; cycle(); }); }); }
    function pause()  { paused = true; clearTimeout(t); set(LIST[0]); }
    function resume() { if (!paused || el.value) return; paused = false; i = 0; cycle(); }
    el.addEventListener('focus', pause);
    el.addEventListener('blur', resume);
    el.addEventListener('input', function () { if (el.value) pause(); });
    if (doc.activeElement !== el && !el.value) cycle(); else paused = true;
  }


  /* -------------------------------------------------------------------
     4. FORM — Formspree via fetch, native POST without JS, mailto if it fails.
     ------------------------------------------------------------------- */
  function form() {
    var f = doc.getElementById('build-form');
    if (!f) return;
    var status = doc.getElementById('form-status');
    var btn = f.querySelector('button[type="submit"]');
    var EMAIL = 'vitoshi@nulllimit.gg';
    f.setAttribute('novalidate', '');

    var RULES = [
      { id: 'f-what',  msg: 'Tell us what we’re building.' },
      { id: 'f-name',  msg: 'We need a name to reply to.' },
      { id: 'f-email', msg: 'Enter a valid email so we can reply.', email: true }
    ];
    function field(id) { return doc.getElementById(id); }
    function wrap(el)  { return el.closest('.field'); }
    function setErr(el, msg) {
      var w = wrap(el), e = w.querySelector('.err');
      if (msg) { w.classList.add('is-invalid'); e.textContent = msg; el.setAttribute('aria-invalid', 'true'); }
      else     { w.classList.remove('is-invalid'); e.textContent = ''; el.removeAttribute('aria-invalid'); }
    }
    function check(r) {
      var el = field(r.id), v = el.value.trim(), bad = !v || (r.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
      setErr(el, bad ? r.msg : '');
      return !bad;
    }
    RULES.forEach(function (r) {
      var el = field(r.id);
      el.addEventListener('blur', function () { if (wrap(el).classList.contains('is-invalid')) check(r); });
      el.addEventListener('input', function () { if (wrap(el).classList.contains('is-invalid')) check(r); });
    });

    /* dim placeholder colour on selects until a value is chosen */
    Array.prototype.forEach.call(f.querySelectorAll('select'), function (s) {
      function sync() { s.classList.toggle('is-empty', !s.value); }
      s.addEventListener('change', sync); sync();
    });

    function mailtoHref() {
      var d = new FormData(f), lines = [];
      ['service', 'what', 'details', 'name', 'email', 'timeline', 'budget'].forEach(function (k) {
        var v = (d.get(k) || '').toString().trim(); if (v) lines.push(k + ': ' + v);
      });
      return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Build request — ' + (d.get('what') || '')) +
             '&body=' + encodeURIComponent(lines.join('\n'));
    }

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true, first = null;
      RULES.forEach(function (r) { if (!check(r)) { ok = false; first = first || field(r.id); } });
      if (!ok) { first.focus(); return; }

      btn.disabled = true; btn.textContent = 'Sending…'; status.textContent = '';
      fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function () {
          var done = doc.createElement('div');
          done.className = 'form-done';
          done.innerHTML = '<p class="prompt">build.reserved</p>' +
            '<h3 class="display">Got it.</h3>' +
            '<p>Response within 24 hours.</p>';
          f.replaceWith(done);
          done.querySelector('h3').setAttribute('tabindex', '-1');
          done.querySelector('h3').focus();
        })
        .catch(function () {
          btn.disabled = false; btn.textContent = 'Reserve a build →';
          status.innerHTML = 'That didn’t send. <a href="' + mailtoHref() + '">Email it instead →</a>';
        });
    });
  }


  /* -------------------------------------------------------------------
     5. CURSOR — thin --silver ring. Hidden over form fields so it never
        fights the I-beam. Fine pointers only; CSS gates the media query.
     ------------------------------------------------------------------- */
  function cursor() {
    if (reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var c = doc.createElement('div'); c.className = 'cur'; c.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(c);
    root.classList.add('has-cur');
    var x = 0, y = 0, on = false;
    doc.addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY;
      c.style.left = x + 'px'; c.style.top = y + 'px';
      if (!on) { on = true; c.classList.add('on'); }
    }, { passive: true });
    doc.addEventListener('mouseleave', function () { c.classList.remove('on'); on = false; });
    doc.addEventListener('mouseover', function (e) {
      var t = e.target;
      c.classList.toggle('off', !!t.closest('input, textarea, select'));
      c.classList.toggle('big', !!t.closest('a, button, label'));
    });
  }


  /* -------------------------------------------------------------------
     6. REVEAL — sections and rows fade up once as they enter. The .rv
        class is only added here, so no-JS, no-IO, and reduced-motion
        visitors get the static final state.
     ------------------------------------------------------------------- */
  function reveal() {
    if (reduce || !('IntersectionObserver' in window)) return;
    var targets = Array.prototype.slice.call(doc.querySelectorAll('.section, .builds, .foot'));
    Array.prototype.forEach.call(doc.querySelectorAll('.rows'), function (list) {
      Array.prototype.forEach.call(list.children, function (row, i) {
        row.style.setProperty('--rv-d', (i * 50) + 'ms');   // 50ms stagger per row
        targets.push(row);
      });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('rv-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (t) { t.classList.add('rv'); io.observe(t); });
  }


  function init() { intro(); counter(); placeholder(); form(); cursor(); reveal(); }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})();
