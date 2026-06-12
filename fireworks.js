/* ============================================================
   The Aster Life - fireworks

   A small vanilla-canvas particle fireworks engine, no deps.
   - Plays a celebratory burst sequence on page load.
   - Leaves a "set off a firework" button (top-left) that launches
     one on each click - hammer it for your own show.

   One full-screen <canvas> overlay (pointer-events:none) is kept
   around; the animation loop only runs while sparks are alive and
   idles otherwise (zero cost when nothing is happening). The auto
   on-load show is skipped under reduced motion; the button is a
   deliberate click, so it always works. No sound.
   ============================================================ */
(function () {
  'use strict';

  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  var HUES = [265, 285, 320, 45, 170, 210];   // violet/purple (brand) + pink, gold, teal, blue
  var ROCKET_G = 0.12, SPARK_G = 0.06, DRAG = 0.985;

  var canvas, ctx, dpr = 1, W = 0, H = 0;
  var rockets = [], sparks = [], raf = 0;

  // The canvas + loop are created lazily on the first launch, so a visitor
  // who never sets one off (e.g. reduced-motion, no click) gets nothing.
  function init() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.className = 'fx-fireworks';
    var st = canvas.style;
    st.position = 'fixed'; st.top = '0'; st.left = '0';
    st.width = '100%'; st.height = '100%';
    st.pointerEvents = 'none'; st.zIndex = '9999';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    if (!canvas) return;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Launch one rocket, rising from a random spot along the bottom (or a given x).
  function launch(x) {
    init();
    if (typeof x !== 'number') x = W * (0.12 + Math.random() * 0.76);
    rockets.push({
      x: x, y: H + 8, px: x, py: H + 8,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -(10 + Math.random() * 3.5),
      hue: HUES[(Math.random() * HUES.length) | 0]
    });
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function explode(r) {
    var n = 80 + (Math.random() * 60 | 0);
    var power = 3 + Math.random() * 2.2;
    for (var i = 0; i < n; i++) {
      var ang = Math.random() * Math.PI * 2;
      var sp = power * (0.3 + Math.random() * 0.7);
      var twinkle = Math.random() < 0.2;
      var ml = 60 + (Math.random() * 48 | 0);
      sparks.push({
        x: r.x, y: r.y, px: r.x, py: r.y,
        vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
        hue: r.hue + (Math.random() * 26 - 13),
        light: twinkle ? 92 : (56 + Math.random() * 18),
        life: ml, maxLife: ml
      });
    }
  }

  function frame() {
    raf = 0;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';   // additive glow on the dark bg
    ctx.lineCap = 'round';

    for (var i = rockets.length - 1; i >= 0; i--) {
      var r = rockets[i];
      r.px = r.x; r.py = r.y;
      r.x += r.vx; r.y += r.vy; r.vy += ROCKET_G;
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = 'hsla(' + r.hue + ',100%,72%,0.9)';
      ctx.beginPath(); ctx.moveTo(r.px, r.py); ctx.lineTo(r.x, r.y); ctx.stroke();
      if (r.vy >= -0.6) { explode(r); rockets.splice(i, 1); }   // burst near apex
    }

    for (var j = sparks.length - 1; j >= 0; j--) {
      var p = sparks[j];
      p.px = p.x; p.py = p.y;
      p.vx *= DRAG; p.vy *= DRAG; p.vy += SPARK_G;
      p.x += p.vx; p.y += p.vy; p.life--;
      if (p.life <= 0) { sparks.splice(j, 1); continue; }
      var al = Math.min(1, (p.life / p.maxLife) * 1.6);          // hold bright, then fade
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = 'hsla(' + p.hue + ',100%,' + p.light + '%,' + al + ')';
      ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
      ctx.fillStyle = 'hsla(' + p.hue + ',100%,' + Math.min(96, p.light + 16) + '%,' + al + ')';
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.7, 0, Math.PI * 2); ctx.fill();   // bright glowing core
    }

    if (rockets.length || sparks.length) raf = requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, W, H);   // idle: leave the canvas blank, loop stops
  }

  // The welcome sequence on load (skipped under reduced motion).
  function welcome() {
    if (reduce) return;
    var n = 0, MAX = 14;
    (function pop() {
      if (n >= MAX) return;
      launch(); n++;
      if (n < MAX && Math.random() < 0.3) { launch(); n++; }    // occasional pair
      window.setTimeout(pop, 240 + Math.random() * 260);
    })();
  }

  function burstIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round">' +
      '<circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/>' +
      '<path d="M16 12 L20.5 12 M8 12 L3.5 12 M12 8 L12 3.5 M12 16 L12 20.5 ' +
      'M14.8 9.2 L18 6 M9.2 9.2 L6 6 M14.8 14.8 L18 18 M9.2 14.8 L6 18"/>' +
      '</svg>';
  }

  function buildButton() {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'fx-btn';
    b.setAttribute('aria-label', 'Set off a firework');
    b.title = 'Set off a firework';
    b.innerHTML = burstIcon();
    b.addEventListener('click', function () { launch(); });
    document.body.appendChild(b);
  }

  function start() {
    buildButton();
    welcome();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  // Expose the launcher for anything else that wants to set one off.
  window.Fireworks = { launch: launch };
})();
