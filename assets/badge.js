/* The Great Desert Race: badge pages. Everything is drawn on a canvas from the link's #fragment:
   #n=<name>&r=<overall rank>&o=<players on the board>&t=<race time in s>&s=<top speed km/h>&l=en|ar
   The fragment never leaves the phone (browsers do not send it to the server), so GitHub never sees a name. */
(function () {
  var KINDS = {
    first:  { big: '1', sup: { en: 'ST', ar: '' }, ring: ['#EE6E85', '#B94D7A'], label: { en: 'CHAMPION', ar: 'البطل' }, ribbon: ['#EE6E85', '#7E63AA'], file: 'desert-race-1st' },
    second: { big: '2', sup: { en: 'ND', ar: '' }, ring: ['#4F86D9', '#1957A2'], label: { en: 'RUNNER-UP', ar: 'الوصيف' }, ribbon: ['#4F86D9', '#4F4C93'], file: 'desert-race-2nd' },
    rank:   { big: null, ring: ['#F4A17F', '#7E63AA'], label: { en: 'LEADERBOARD RANK', ar: 'مرتبتك في لوحة المتصدرين' }, ribbon: ['#F4A17F', '#7E63AA'], file: 'desert-race-rank' }
  };
  var T = {
    en: { sub: { first: 'You finished 1st. Download your badge.', second: 'You finished 2nd. Download your badge.', rank: 'Your place on the leaderboard. Download your badge.' }, title: 'THE GREAT DESERT RACE', time: 'TIME', speed: 'TOP SPEED', kmh: 'km/h', rank: 'LEADERBOARD RANK', of: 'of', guest: 'GUEST', finisher: 'FINISHER', dl: 'Download badge', share: 'Share', note: 'Your name stays on your phone: it is only in this link.' },
    ar: { sub: { first: 'حصلت على المركز الأول. نزّل شارتك.', second: 'حصلت على المركز الثاني. نزّل شارتك.', rank: 'مرتبتك في لوحة المتصدرين. نزّل شارتك.' }, title: 'سباق الصحراء الكبير', time: 'الزمن', speed: 'أعلى سرعة', kmh: 'كم/س', rank: 'المرتبة في لوحة المتصدرين', of: 'من', guest: 'ضيف', finisher: 'أكمل السباق', dl: 'تنزيل الشارة', share: 'مشاركة', note: 'اسمك يبقى على هاتفك: هو موجود في هذا الرابط فقط.' }
  };

  function params() {
    var o = {}, h = (location.hash || '').replace(/^#/, '');
    h.split('&').forEach(function (kv) {
      var i = kv.indexOf('='); if (i < 1) return;
      try { o[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1).replace(/\+/g, ' ')); } catch (e) { }
    });
    return o;
  }
  function cleanName(s) { return (s || '').replace(/[^\p{L}\p{M} .'’-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 20); }
  function fmtTime(t) { t = Math.max(0, +t || 0); var m = Math.floor(t / 60); var s = t - m * 60; return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s.toFixed(1); }
  function hasArabic(s) { return /[؀-ۿ]/.test(s || ''); }

  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function fit(ctx, text, maxW, size, weight) {
    var f = function (px) { return weight + ' ' + px + 'px "TeX Gyre Heros","IBM Plex Sans Arabic",Arial,sans-serif'; };
    var px = size; ctx.font = f(px);
    while (ctx.measureText(text).width > maxW && px > 18) { px -= 2; ctx.font = f(px); }
    return px;
  }
  function text(ctx, s, x, y, size, color, align, maxW) {
    ctx.fillStyle = color; ctx.textAlign = align || 'center'; ctx.textBaseline = 'alphabetic';
    ctx.direction = hasArabic(s) ? 'rtl' : 'ltr';
    if (maxW) size = fit(ctx, s, maxW, size, 700); else ctx.font = '700 ' + size + 'px "TeX Gyre Heros","IBM Plex Sans Arabic",Arial,sans-serif';
    ctx.fillText(s, x, y);
  }

  function draw(canvas, kind, p) {
    var K = KINDS[kind], lang = p.l === 'ar' ? 'ar' : 'en', L = T[lang];
    var W = 1080, H = 1350; canvas.width = W; canvas.height = H;
    var ctx = canvas.getContext('2d');
    var name = cleanName(p.n), rank = parseInt(p.r, 10) || 0, total = parseInt(p.o, 10) || 0;
    var hasTime = p.t !== undefined && p.t !== '', speed = parseInt(p.s, 10) || 0;

    // background
    var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#13306B'); g.addColorStop(1, '#0E1A45');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    var glow = ctx.createRadialGradient(W / 2, 520, 40, W / 2, 520, 600);
    glow.addColorStop(0, 'rgba(238,110,133,0.28)'); glow.addColorStop(1, 'rgba(238,110,133,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    var band = ctx.createLinearGradient(0, 0, W, 0); band.addColorStop(0, '#4560AD'); band.addColorStop(.5, '#EE6D83'); band.addColorStop(1, '#4F4C93');
    ctx.fillStyle = band; ctx.fillRect(0, 0, W, 16); ctx.fillRect(0, H - 16, W, 16);

    // header
    text(ctx, L.title, W / 2, 96, 54, '#F4A17F', 'center', 940);
    text(ctx, '1926  →  2126', W / 2, 150, 34, '#cdd6f5', 'center');

    // ribbons
    var cx = W / 2, cy = 520, R = 300;
    [[-1, K.ribbon[0]], [1, K.ribbon[1]]].forEach(function (s) {
      ctx.fillStyle = s[1]; ctx.beginPath();
      ctx.moveTo(cx + s[0] * 60, cy + R - 60); ctx.lineTo(cx + s[0] * 220, cy + R + 120); ctx.lineTo(cx + s[0] * 135, cy + R + 95);
      ctx.lineTo(cx + s[0] * 60, cy + R + 140); ctx.closePath(); ctx.fill();
    });

    // medal
    var ring = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R); ring.addColorStop(0, K.ring[0]); ring.addColorStop(1, K.ring[1]);
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = ring; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, R - 34, 0, Math.PI * 2); ctx.fillStyle = '#0E1A45'; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, R - 56, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 3; ctx.stroke();

    var big, sup = '';
    if (K.big) { big = K.big; sup = K.sup[lang]; }
    else if (rank) big = '#' + rank;
    else big = L.finisher;
    var bigSize = K.big ? 400 : (rank ? (String(rank).length > 3 ? 190 : String(rank).length > 2 ? 230 : 280) : 90);
    ctx.fillStyle = '#fff'; ctx.textBaseline = 'alphabetic'; ctx.direction = 'ltr';
    ctx.font = '700 ' + bigSize + 'px "TeX Gyre Heros","IBM Plex Sans Arabic",Arial,sans-serif';
    var bw = ctx.measureText(big).width, supSize = 120;
    ctx.font = '700 ' + supSize + 'px "TeX Gyre Heros",Arial,sans-serif';
    var sw = sup ? ctx.measureText(sup).width + 6 : 0;
    var x0 = cx - (bw + sw) / 2, base = cy + bigSize * 0.30;
    ctx.font = '700 ' + bigSize + 'px "TeX Gyre Heros","IBM Plex Sans Arabic",Arial,sans-serif'; ctx.textAlign = 'left'; ctx.fillText(big, x0, base);
    if (sup) { ctx.font = '700 ' + supSize + 'px "TeX Gyre Heros",Arial,sans-serif'; ctx.fillText(sup, x0 + bw + 6, base - bigSize * 0.52); }
    text(ctx, K.label[lang], cx, cy + R - 92, K.big ? 54 : 40, K.ring[0], 'center', 520);
    if (!K.big && rank && total) text(ctx, L.of + ' ' + total, cx, cy + R - 150, 46, '#cdd6f5', 'center');

    // name
    rr(ctx, 100, 996, 880, 110, 55); ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fill();
    text(ctx, name || L.guest, cx, 1068, 62, '#fff', 'center', 800);

    // stats
    var stats = [];
    if (hasTime) stats.push(L.time + '  ' + fmtTime(p.t));
    if (speed) stats.push(L.speed + '  ' + speed + ' ' + L.kmh);
    if (stats.length) text(ctx, stats.join('     ·     '), cx, 1158, 38, '#cdd6f5', 'center', 920);

    // overall rank under the place badge
    if (K.big && rank) {
      var label = L.rank + '  ' + (lang === 'ar' ? '' : '#') + rank + (total ? '  ' + L.of + ' ' + total : '');
      rr(ctx, 120, 1186, 840, 76, 38); var pg = ctx.createLinearGradient(120, 0, 960, 0); pg.addColorStop(0, '#4560AD'); pg.addColorStop(.5, '#EE6D83'); pg.addColorStop(1, '#4F4C93');
      ctx.fillStyle = pg; ctx.fill();
      text(ctx, label, cx, 1238, 40, '#fff', 'center', 780);
    }
    var d = new Date(), pad = function (n) { return (n < 10 ? '0' : '') + n; };
    ctx.direction = 'ltr';
    text(ctx, pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear(), cx, H - 46, 26, '#8ea0d8', 'center');
  }

  window.DesertBadge = {
    init: function (kind) {
      var p = params(), lang = p.l === 'ar' ? 'ar' : 'en';
      document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      var canvas = document.getElementById('badge'), dl = document.getElementById('dl'), sh = document.getElementById('share'), note = document.getElementById('note');
      var h1 = document.querySelector('h1'), sub = document.querySelector('.sub');
      h1.textContent = T[lang].title; sub.textContent = T[lang].sub[kind];
      dl.textContent = T[lang].dl; sh.textContent = T[lang].share; note.textContent = T[lang].note;
      var render = function () { draw(canvas, kind, p); };
      var fonts = ['700 40px "TeX Gyre Heros"', '700 40px "IBM Plex Sans Arabic"'].map(function (f) { return document.fonts.load(f, 'Aa١مرحبا'); });
      Promise.all(fonts).then(render, render); render();
      function blob(cb) { canvas.toBlob(cb, 'image/png'); }
      dl.addEventListener('click', function () {
        blob(function (b) {
          var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = KINDS[kind].file + '.png';
          document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
        });
      });
      if (navigator.canShare) {
        sh.style.display = '';
        sh.addEventListener('click', function () {
          blob(function (b) {
            var f = new File([b], KINDS[kind].file + '.png', { type: 'image/png' });
            if (navigator.canShare({ files: [f] })) navigator.share({ files: [f], title: T[lang].title }).catch(function () { });
          });
        });
      } else sh.style.display = 'none';
    },
    cleanName: cleanName
  };
})();
