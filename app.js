/* ============================================================
   The Aster Life — app logic

   An ADDITIVE decision tree. Nothing is ever cleared:
   - The "Choose your own adventure" button is the root node.
   - Tapping a node retracts its unpicked siblings INTO the parent and draws
     new lines OUT to its children; the picked path stays live as a spine.
   - Tapping a node already in the spine un-picks it (its children retract and
     its siblings return).
   - The whole tree gently re-centers on the active path after each tap.

   No breadcrumb — the live spine IS the trail. Vanilla JS, no deps.
   ============================================================ */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var DUR = 300;            // keep in sync with --dur in style.css
  var ROOT = { id: '__root__', root: true };

  var treeEl    = document.getElementById('tree');
  var flowEl    = document.getElementById('tree-flow');
  var linesEl   = document.getElementById('connectors');

  // Navigation state. `trail` is the picked spine below the root:
  // []  -> root open, choosing a branch
  // [b] -> branch b picked, choosing a sub-category
  // [b, s] -> sub-category s picked, showing its cards
  var rootOpen = false;
  var trail = [];

  // id -> rendered element, plus a child->parent id lookup for the whole tree.
  var registry = new Map();
  var parentId = {};
  var fanEl = null;          // the .fan container (reused)
  var lineRaf = 0;

  // bookkeeping for the line layer (set on every update)
  var curSpineIds = [];
  var curFanIds = [];
  var curParentId = null;

  // ---------- small helpers ----------
  function hoverCapable() { return window.matchMedia('(hover: hover)').matches; }
  function prefersReduce() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function idOf(node) { return node.id; }

  // ---------- tree shape ----------
  function buildParentIndex() {
    TREE.branches.forEach(function (b) {
      parentId[b.id] = ROOT.id;
      b.subcategories.forEach(function (s) {
        parentId[s.id] = b.id;
        s.cards.forEach(function (c) { parentId[c.id] = s.id; });
      });
    });
  }
  function childrenOf(node) {
    if (node === ROOT) return TREE.branches;
    if (node.subcategories) return node.subcategories;
    if (node.cards) return node.cards;
    return [];
  }
  function nodeById(id) {
    if (id === ROOT.id) return ROOT;
    var found = null;
    TREE.branches.forEach(function (b) {
      if (b.id === id) found = b;
      b.subcategories.forEach(function (s) {
        if (s.id === id) found = s;
        s.cards.forEach(function (c) { if (c.id === id) found = c; });
      });
    });
    return found;
  }

  // ---------- gradient placeholders (stand in for card photos) ----------
  var GRADIENTS = [
    ['#8b5cf6', '#6d28d9'], ['#a78bfa', '#7c3aed'], ['#7c3aed', '#4338ca'],
    ['#8b5cf6', '#c026d3'], ['#9333ea', '#db2777'], ['#6d28d9', '#0d9488'],
    ['#7c3aed', '#2563eb'], ['#a21caf', '#7c3aed'], ['#5b21b6', '#0e7490'],
    ['#8b5cf6', '#4f46e5']
  ];
  function cardGradient(card) {
    var n = parseInt(String(card.id).replace(/\D/g, ''), 10) || 0;
    var pair = GRADIENTS[n % GRADIENTS.length];
    return 'linear-gradient(' + (135 + (n % 4) * 12) + 'deg, ' + pair[0] + ', ' + pair[1] + ')';
  }

  // ---------- reusable inline-SVG glyph (location pin) ----------
  function pinGlyph() {
    return '<svg viewBox="0 0 24 24" width="24" height="24">' +
      '<path d="M12 2c-3.9 0-7 3.1-7 7 0 5 7 13 7 13s7-8 7-13c0-3.9-3.1-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/>' +
      '</svg>';
  }

  // ---------- element builders ----------
  function buildRoot() {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'tree-node root';
    b.textContent = 'Choose your own adventure';
    b.addEventListener('click', function () {
      rootOpen = !rootOpen;
      trail = [];
      update();
    });
    return b;
  }
  function buildOption(node) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'tree-node option';
    b.textContent = node.label;
    b.addEventListener('click', function () { onOptionClick(node); });
    return b;
  }
  function buildCard(card) {
    var el = document.createElement('div');
    el.className = 'tree-node card';
    var bg = document.createElement('div');
    bg.className = 'card-bg';
    var grad = cardGradient(card);
    if (card.image) {
      bg.classList.add('has-photo');
      bg.style.backgroundImage = 'url("' + card.image + '"), ' + grad;  // photo over gradient base
    } else {
      bg.style.backgroundImage = grad;
    }
    el.appendChild(bg);

    var ov = document.createElement('div');
    ov.className = 'card-overlay';
    ov.innerHTML =
      '<div class="card-name">' + esc(card.name) + '</div>' +
      '<div class="card-blurb">' + esc(card.blurb) + '</div>' +
      '<div class="card-meta">' +
        '<span class="card-loc">' + pinGlyph() + esc(card.location) + '</span>' +
      '</div>';
    var actions = document.createElement('div');
    actions.className = 'card-actions';

    var visit = document.createElement('a');
    visit.className = 'visit';
    visit.textContent = 'Visit';
    visit.href = card.url;
    visit.target = '_blank';
    visit.rel = 'noopener';
    visit.addEventListener('click', function (e) { e.stopPropagation(); });
    actions.appendChild(visit);

    // Favorite toggle - sits at the row's right, in line with Visit.
    if (window.Favorites) actions.appendChild(window.Favorites.makeHeart(card));

    ov.appendChild(actions);
    el.appendChild(ov);

    if (!hoverCapable()) {
      el.addEventListener('click', function () { el.classList.toggle('revealed'); });
    }
    return el;
  }

  function ensureEl(node, kind) {
    var id = idOf(node);
    if (registry.has(id)) return registry.get(id);
    var el = kind === 'root' ? buildRoot() : kind === 'card' ? buildCard(node) : buildOption(node);
    registry.set(id, el);
    return el;
  }

  // ---------- interactions ----------
  function onOptionClick(node) {
    var idx = trail.findIndex(function (n) { return n.id === node.id; });
    if (idx >= 0) trail = trail.slice(0, idx);   // tap a live spine node -> un-pick it
    else trail = trail.concat([node]);           // tap a fan child -> pick it
    update();
  }

  // ---------- the line layer ----------
  function isNarrow() { return window.matchMedia('(max-width: 640px)').matches; }
  function rel(r, tr) {
    return {
      left: r.left - tr.left, top: r.top - tr.top, width: r.width, height: r.height,
      bottom: r.bottom - tr.top, cx: r.left + r.width / 2 - tr.left, cy: r.top + r.height / 2 - tr.top
    };
  }
  function addPath(d) {
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    linesEl.appendChild(p);
  }
  function curve(ax, ay, bx, by) {
    var dy = by - ay;
    addPath('M ' + ax + ' ' + ay + ' C ' + ax + ' ' + (ay + dy * 0.5) +
            ', ' + bx + ' ' + (by - dy * 0.5) + ', ' + bx + ' ' + by);
  }
  function spineLink(aId, bId, tr) {
    var a = registry.get(aId), b = registry.get(bId);
    if (!a || !b) return;
    var ar = rel(a.getBoundingClientRect(), tr), br = rel(b.getBoundingClientRect(), tr);
    if (br.top - ar.bottom < 1) return;
    // Out of the parent's left side -> into the child's left side, straight down
    // then curving. The root is a capsule, so it leaves the very left of its flat
    // bottom (just past the left curve) rather than its rounded side.
    var ax = (aId === ROOT.id) ? ar.left + ar.height / 2 : ar.left;
    var ay = (aId === ROOT.id) ? ar.bottom : ar.bottom - 8;
    curve(ax, ay, br.left, br.top + 8);
  }

  function drawLines() {
    var tr = treeEl.getBoundingClientRect();
    linesEl.setAttribute('width', treeEl.clientWidth);
    linesEl.setAttribute('height', flowEl.scrollHeight);
    while (linesEl.firstChild) linesEl.removeChild(linesEl.firstChild);
    if (isNarrow()) drawLinesNarrow(tr); else drawLinesWide(tr);
  }

  // Desktop: a curved fan from each parent down to its children.
  function drawLinesWide(tr) {
    for (var k = 1; k < curSpineIds.length; k++) spineLink(curSpineIds[k - 1], curSpineIds[k], tr);
    if (!curParentId) return;
    var parent = registry.get(curParentId);
    if (!parent) return;
    var pr = rel(parent.getBoundingClientRect(), tr);
    curFanIds.forEach(function (fid) {
      var b = registry.get(fid);
      if (!b) return;
      var br = rel(b.getBoundingClientRect(), tr);
      if (br.top - pr.bottom < 1) return;
      curve(pr.cx, pr.bottom, br.cx, br.top);
    });
  }

  // Mobile: the choices branch off a rail that curves out of the parent and
  // runs down the left edge, so siblings clearly read as siblings.
  function drawLinesNarrow(tr) {
    for (var k = 1; k < curSpineIds.length; k++) spineLink(curSpineIds[k - 1], curSpineIds[k], tr);
    if (!curFanIds.length || !curParentId) return;
    var parent = registry.get(curParentId);
    if (!parent) return;
    var pr = rel(parent.getBoundingClientRect(), tr);
    var rects = curFanIds.map(function (id) {
      var el = registry.get(id);
      return el ? rel(el.getBoundingClientRect(), tr) : null;
    }).filter(Boolean);
    if (!rects.length) return;

    var minLeft = Math.min.apply(null, rects.map(function (r) { return r.left; }));
    var railX = Math.max(8, minLeft - 20);
    var lastY = rects[rects.length - 1].cy;

    // Origin: the parent's left side — except the root (a capsule), which leaves
    // the very left of its flat bottom (just past the left curve). Straight DOWN
    // out of the parent, then curve over to the rail and run down the left edge.
    var sx = (curParentId === ROOT.id) ? pr.left + pr.height / 2 : pr.left;
    var sy = (curParentId === ROOT.id) ? pr.bottom : pr.bottom - 8;
    var joinY = pr.bottom + 20, mid = (joinY - sy) * 0.5;
    addPath('M ' + sx + ' ' + sy +
            ' C ' + sx + ' ' + (sy + mid) + ', ' + railX + ' ' + (joinY - mid) +
            ', ' + railX + ' ' + joinY +
            ' L ' + railX + ' ' + lastY);
    // Elbow from the rail into each child's LEFT SIDE.
    rects.forEach(function (r) {
      addPath('M ' + railX + ' ' + r.cy +
              ' C ' + (railX + 12) + ' ' + r.cy + ', ' + (r.left - 12) + ' ' + r.cy +
              ', ' + r.left + ' ' + r.cy);
    });
  }
  // Redraw lines every frame for the animation window so they stay glued to
  // moving nodes (this is what makes lines "draw out" and "retract").
  function animateLines() {
    if (lineRaf) cancelAnimationFrame(lineRaf);
    var startTs = null;
    function frame(ts) {
      if (startTs === null) startTs = ts;
      drawLines();
      if (ts - startTs < DUR + 90) lineRaf = requestAnimationFrame(frame);
      else { lineRaf = 0; drawLines(); }
    }
    lineRaf = requestAnimationFrame(frame);
  }

  // ---------- FLIP helpers ----------
  function play(el, dx, dy, scale, fadeIn) {
    el.style.transition = 'none';
    el.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + scale + ')';
    if (fadeIn) el.style.opacity = '0';
    el.getBoundingClientRect();                   // commit the start state
    requestAnimationFrame(function () {
      el.style.transition = 'transform var(--dur) var(--ease), opacity var(--dur) var(--ease)';
      el.style.transform = '';
      if (fadeIn) el.style.opacity = '';
    });
  }
  function centerOf(rect) { return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }; }

  // ---------- render ----------
  function update() {
    var animate = !prefersReduce();

    // 1. Measure where everything is right now.
    var first = new Map();
    registry.forEach(function (el, id) { first.set(id, el.getBoundingClientRect()); });

    // 2. Work out the new visible set.
    var spine = rootOpen ? [ROOT].concat(trail) : [ROOT];
    var parent = spine[spine.length - 1];
    var fanNodes = rootOpen ? childrenOf(parent) : [];
    var fanKind = (parent !== ROOT && parent.cards) ? 'card' : 'option';
    var newIds = new Set();
    spine.forEach(function (n) { newIds.add(idOf(n)); });
    fanNodes.forEach(function (n) { newIds.add(idOf(n)); });

    // 3. Freeze exiting elements out of flow so they don't disturb layout.
    var exiting = [];
    registry.forEach(function (el, id) {
      if (!newIds.has(id)) exiting.push({ id: id, el: el });
    });
    var trRect = treeEl.getBoundingClientRect();
    exiting.forEach(function (item) {
      var r = first.get(item.id);
      var el = item.el;
      el.style.position = 'absolute';
      el.style.margin = '0';
      el.style.left = (r.left - trRect.left) + 'px';
      el.style.top = (r.top - trRect.top) + 'px';
      el.style.width = r.width + 'px';
      treeEl.appendChild(el);
      registry.delete(item.id);
    });

    // 4. Ensure spine + fan elements exist, then lay them out in order.
    var entered = [];
    spine.forEach(function (n) {
      if (!registry.has(idOf(n))) entered.push(idOf(n));
      var el = ensureEl(n, n === ROOT ? 'root' : 'option');
      el.classList.toggle('selected', n !== ROOT && rootOpen);
      el.style.position = '';
      el.style.left = el.style.top = el.style.width = el.style.margin = '';
      flowEl.appendChild(el);
    });
    if (fanNodes.length) {
      if (!fanEl) { fanEl = document.createElement('div'); }
      fanEl.className = 'fan' + (fanKind === 'card' ? ' fan-cards' : '');
      fanNodes.forEach(function (n) {
        if (!registry.has(idOf(n))) entered.push(idOf(n));
        var el = ensureEl(n, fanKind);
        el.classList.remove('selected');
        el.style.position = '';
        el.style.left = el.style.top = el.style.width = el.style.margin = '';
        fanEl.appendChild(el);
      });
      flowEl.appendChild(fanEl);
    } else if (fanEl && fanEl.parentNode) {
      fanEl.parentNode.removeChild(fanEl);
    }

    // bookkeeping for the line layer
    curSpineIds = spine.map(idOf);
    curFanIds = fanNodes.map(idOf);
    curParentId = fanNodes.length ? idOf(parent) : null;

    // 5. Animate: FLIP persistent nodes, grow new ones out of their parent,
    //    retract exiting ones into their parent.
    if (animate) {
      registry.forEach(function (el, id) {
        var last = el.getBoundingClientRect();
        if (entered.indexOf(id) >= 0) {
          var pEl = registry.get(parentId[id]);
          var pc = pEl ? centerOf(pEl.getBoundingClientRect()) : centerOf(last);
          var c = centerOf(last);
          play(el, pc.x - c.x, pc.y - c.y, 0.6, true);
        } else {
          var f = first.get(id);
          if (f) {
            var dx = f.left - last.left, dy = f.top - last.top;
            if (dx || dy) play(el, dx, dy, 1, false);
          }
        }
      });
      exiting.forEach(function (item) {
        var el = item.el;
        var pEl = registry.get(parentId[item.id]);
        var tx = 0, ty = 0;
        if (pEl) {
          var pc = centerOf(pEl.getBoundingClientRect());
          var ec = centerOf(el.getBoundingClientRect());
          tx = pc.x - ec.x; ty = pc.y - ec.y;
        }
        el.style.transition = 'transform var(--dur) var(--ease), opacity var(--dur) var(--ease)';
        requestAnimationFrame(function () {
          el.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(0.5)';
          el.style.opacity = '0';
        });
        window.setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, DUR + 40);
      });
      animateLines();
    } else {
      exiting.forEach(function (item) { if (item.el.parentNode) item.el.parentNode.removeChild(item.el); });
      drawLines();
    }

    // 6. Gently re-center on the active path.
    var focus = fanNodes.length ? fanEl : registry.get(idOf(parent));
    if (focus) {
      window.setTimeout(function () {
        focus.scrollIntoView({ behavior: animate ? 'smooth' : 'auto', block: 'center' });
      }, animate ? 60 : 0);
    }
  }

  // Keep lines aligned on resize.
  var resizeRaf = 0;
  window.addEventListener('resize', function () {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(drawLines);
  });

  // ---------- init ----------
  buildParentIndex();
  ensureEl(ROOT, 'root');
  flowEl.appendChild(registry.get(ROOT.id));
  update();
})();
