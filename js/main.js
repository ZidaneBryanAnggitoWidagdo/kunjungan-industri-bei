/* ============================================================
   Kunjungan Industri BEI — interaksi utama
   Zidane Bryan Anggito Widagdo, XI RPL 1
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- navbar: scrolled state + progress bar ---------- */
  var navbar = document.getElementById('navbar');
  var progressBar = document.getElementById('progressBar');
  var toTop = document.getElementById('toTop');

  function onScroll() {
    var st = window.scrollY || document.documentElement.scrollTop;
    navbar.classList.toggle('scrolled', st > 24);
    toTop.classList.toggle('show', st > 600);
    toTop.hidden = false;
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    progressBar.style.width = (max > 0 ? (st / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------- menu mobile ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
  });
  navLinks.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- scroll spy ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var id = entry.target.id;
      navLinks.querySelectorAll('a').forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(function (s) { spy.observe(s); });

  /* ---------- reveal on scroll ---------- */
  var ro = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        ro.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { ro.observe(el); });

  /* ---------- count-up statistik ---------- */
  var co = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      co.unobserve(el);
      var target = parseInt(el.getAttribute('data-count'), 10);
      var t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / 1400, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString('id-ID');
        if (p < 1) requestAnimationFrame(step);
      }
      if (reduceMotion) { el.textContent = target.toLocaleString('id-ID'); }
      else requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(function (el) { co.observe(el); });

  /* ---------- ticker: duplikasi konten agar loop mulus ---------- */
  var tickerTrack = document.getElementById('tickerTrack');
  if (tickerTrack) {
    tickerTrack.innerHTML += tickerTrack.innerHTML;
  }

  /* ---------- galeri: filter ---------- */
  var filterBtns = document.querySelectorAll('.filter');
  var gItems = Array.prototype.slice.call(document.querySelectorAll('#galleryGrid .g-item'));

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });
      var f = btn.getAttribute('data-filter');
      gItems.forEach(function (item) {
        var show = f === 'semua' || item.getAttribute('data-cat') === f;
        item.classList.toggle('hide', !show);
        if (show) item.classList.add('in');
      });
    });
  });

  /* ---------- galeri: lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var lbCount = document.getElementById('lbCount');
  var lbIndex = 0;

  function visibleItems() {
    return gItems.filter(function (i) { return !i.classList.contains('hide'); });
  }

  function openLb(idx) {
    var vis = visibleItems();
    if (!vis.length) return;
    lbIndex = (idx + vis.length) % vis.length;
    var fig = vis[lbIndex];
    var img = fig.querySelector('img');
    lbImg.src = img.getAttribute('src');
    lbImg.alt = img.getAttribute('alt');
    lbCap.textContent = fig.querySelector('figcaption').textContent.replace(/^\s*(IDX|Museum BI)\s*/, '');
    lbCount.textContent = (lbIndex + 1) + ' / ' + vis.length;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLb() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  var lbClose = document.getElementById('lbClose');
  var lbPrev = document.getElementById('lbPrev');
  var lbNext = document.getElementById('lbNext');

  gItems.forEach(function (fig) {
    fig.setAttribute('tabindex', '0');
    fig.setAttribute('role', 'button');
    fig.setAttribute('aria-label', 'Perbesar foto: ' + fig.querySelector('figcaption').textContent.trim());
    fig.addEventListener('click', function () { openLb(visibleItems().indexOf(fig)); });
    fig.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLb(visibleItems().indexOf(fig));
      }
    });
  });

  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click', function () { openLb(lbIndex - 1); });
  lbNext.addEventListener('click', function () { openLb(lbIndex + 1); });
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLb();
  });
  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') openLb(lbIndex - 1);
    if (e.key === 'ArrowRight') openLb(lbIndex + 1);
  });

  /* ---------- vlog: overlay putar ---------- */
  var video = document.getElementById('vlogVideo');
  var shell = document.getElementById('videoShell');
  var overlay = document.getElementById('videoOverlay');

  overlay.addEventListener('click', function () {
    if (reduceMotion === false) {
      var p = video.play();
      if (p && p.catch) p.catch(function () { /* biarkan kontrol native */ });
    } else {
      video.play();
    }
  });
  video.addEventListener('play', function () { shell.classList.add('playing'); });
  video.addEventListener('pause', function () { shell.classList.remove('playing'); });
  video.addEventListener('ended', function () { shell.classList.remove('playing'); });

  /* ---------- kanvas: candlestick dekoratif ---------- */
  var canvas = document.getElementById('chartCanvas');
  var ctx = canvas.getContext('2d');
  var running = true;
  var candles = [];
  var CANDLE_N = 42;
  var lastPrice = 50;

  function initCandles() {
    candles = [];
    lastPrice = 50;
    for (var i = 0; i < CANDLE_N; i++) candles.push(makeCandle());
  }

  function makeCandle() {
    var open = lastPrice;
    var close = Math.max(12, Math.min(88, open + (Math.random() - 0.48) * 14));
    var hi = Math.max(open, close) + Math.random() * 6;
    var lo = Math.min(open, close) - Math.random() * 6;
    lastPrice = close;
    return { open: open, close: close, hi: hi, lo: lo, age: 0 };
  }

  function sizeCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(t) {
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    /* grid samar */
    ctx.strokeStyle = 'rgba(148,163,184,0.07)';
    ctx.lineWidth = 1;
    for (var gy = 1; gy < 6; gy++) {
      var y = (h / 6) * gy;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    var cw = w / CANDLE_N;
    for (var i = 0; i < candles.length; i++) {
      var c = candles[i];
      var x = i * cw + cw / 2;
      var up = c.close >= c.open;
      var col = up ? 'rgba(61, 220, 151,' : 'rgba(248, 113, 113,';
      /* fade: muda -> tua ke belakang */
      var alpha = 0.16 + (i / candles.length) * 0.3;
      ctx.strokeStyle = col + alpha + ')';
      ctx.fillStyle = col + (alpha + 0.1) + ')';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x, h - (c.hi / 100) * h * 0.8 - h * 0.08);
      ctx.lineTo(x, h - (c.lo / 100) * h * 0.8 - h * 0.08);
      ctx.stroke();
      var top = h - (Math.max(c.open, c.close) / 100) * h * 0.8 - h * 0.08;
      var bot = h - (Math.min(c.open, c.close) / 100) * h * 0.8 - h * 0.08;
      ctx.fillRect(x - cw * 0.24, top, cw * 0.48, Math.max(2, bot - top));
    }

    /* garis harga */
    ctx.strokeStyle = 'rgba(233,182,79,0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var j = 0; j < candles.length; j++) {
      var px = j * cw + cw / 2;
      var py = h - ((candles[j].close / 100) * h * 0.8 + h * 0.08);
      if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();

    /* titik berkilau */
    for (var k = 0; k < 26; k++) {
      var sx = (Math.sin(k * 12.9898 + t * 0.0004) * 0.5 + 0.5) * w;
      var sy = (Math.sin(k * 78.233 + t * 0.0003) * 0.5 + 0.5) * h;
      var sa = 0.04 + 0.05 * Math.abs(Math.sin(t * 0.001 + k));
      ctx.fillStyle = 'rgba(247,212,136,' + sa + ')';
      ctx.beginPath();
      ctx.arc(sx, sy, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  var lastAdd = 0;
  function loop(t) {
    if (!running) return;
    if (t - lastAdd > 950) {
      lastAdd = t;
      candles.push(makeCandle());
      if (candles.length > CANDLE_N) candles.shift();
    }
    draw(t);
    requestAnimationFrame(loop);
  }

  var heroVisible = true;
  new IntersectionObserver(function (entries) {
    var was = heroVisible;
    heroVisible = entries[0].isIntersecting;
    if (heroVisible && !was && !reduceMotion) requestAnimationFrame(loop);
  }, { threshold: 0.02 }).observe(document.querySelector('.hero'));

  sizeCanvas();
  initCandles();
  window.addEventListener('resize', function () {
    sizeCanvas();
    draw(0);
  });
  if (reduceMotion) {
    draw(0); /* satu frame statis */
  } else {
    requestAnimationFrame(loop);
  }

  /* ---------- tahun footer ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
