/* ============================================================
   The Aster Life - favorites

   Save experience cards and recall them later. Backed by the
   browser's localStorage (this device/browser only), so a student's
   picks survive across visits with no login and no backend.

   Owns its own UI: a floating button (appears once something is
   saved) and a slide-out panel listing the saved cards. The tree
   asks for a heart via Favorites.makeHeart(card) and drops it into
   each card; everything else lives here. Vanilla JS, no deps.
   ============================================================ */
(function () {
  'use strict';

  var KEY = 'theasterlife.favorites.v1';

  // Saved cards as small snapshots { name, blurb, location, url }, newest
  // first. Keyed by url - a stable, unique value - so saved picks survive
  // future edits to the tree data (card ids are positional and would shift).
  var items = load();

  // ---------- store (localStorage, fault-tolerant) ----------
  function load() {
    try {
      var arr = JSON.parse(window.localStorage.getItem(KEY) || '[]');
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }            // private mode / corrupt -> empty
  }
  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(items)); }
    catch (e) { /* quota / private mode - keep working in-memory this session */ }
  }
  function indexOf(url) {
    for (var i = 0; i < items.length; i++) if (items[i].url === url) return i;
    return -1;
  }
  function isFav(url) { return indexOf(url) >= 0; }

  function toggle(card) {
    var i = indexOf(card.url);
    if (i >= 0) items.splice(i, 1);
    else items.unshift({ name: card.name, blurb: card.blurb, location: card.location, url: card.url });
    save();
    refreshAll();
    return i < 0;                          // true if now favorited
  }
  function remove(url) {
    var i = indexOf(url);
    if (i < 0) return;
    items.splice(i, 1);
    save();
    refreshAll();
  }

  // ---------- shared bits ----------
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function heartSvg() {
    return '<svg class="heart-icon" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 ' +
      '3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 ' +
      '11.54L12 21.35z"/></svg>';
  }
  function pinGlyph() {
    return '<svg class="fav-pin" viewBox="0 0 24 24" aria-hidden="true" width="14" height="14">' +
      '<path d="M12 2c-3.9 0-7 3.1-7 7 0 5 7 13 7 13s7-8 7-13c0-3.9-3.1-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/>' +
      '</svg>';
  }

  // ---------- per-card heart ----------
  // The same url can have several hearts on screen at once (a card is
  // re-created as you move around the tree), so we never hold references -
  // state is read from the store and pushed to every heart on each change.
  function makeHeart(card) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'heart';
    btn.dataset.url = card.url;
    btn.innerHTML = heartSvg();
    reflect(btn);
    btn.addEventListener('click', function (e) {
      e.stopPropagation();                 // never trigger the card's reveal/Visit
      e.preventDefault();
      toggle(card);
    });
    return btn;
  }
  function reflect(btn) {
    var on = isFav(btn.dataset.url);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? 'Remove from favorites' : 'Add to favorites');
    btn.title = on ? 'Saved - tap to remove' : 'Save to favorites';
  }

  // ---------- floating button + panel ----------
  var fab, fabCount, panel, panelList, scrim, lastFocus;

  function closeSvg() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22">' +
      '<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>';
  }

  function buildUI() {
    fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'fav-fab';
    fab.setAttribute('aria-haspopup', 'dialog');
    fab.setAttribute('aria-expanded', 'false');
    fab.innerHTML = heartSvg() + '<span class="fav-fab-count"></span>';
    fab.addEventListener('click', openPanel);
    fabCount = fab.querySelector('.fav-fab-count');

    scrim = document.createElement('div');
    scrim.className = 'fav-scrim';
    scrim.addEventListener('click', closePanel);

    panel = document.createElement('aside');
    panel.className = 'fav-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'Your saved favorites');
    panel.innerHTML =
      '<div class="fav-panel-head">' +
        '<h2 class="fav-panel-title">Saved favorites</h2>' +
        '<button type="button" class="fav-close" aria-label="Close favorites">' + closeSvg() + '</button>' +
      '</div>' +
      '<div class="fav-list"></div>';
    panel.querySelector('.fav-close').addEventListener('click', closePanel);
    panelList = panel.querySelector('.fav-list');

    document.body.appendChild(scrim);
    document.body.appendChild(panel);
    document.body.appendChild(fab);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('fav-open')) closePanel();
    });

    refreshAll();
  }

  function refreshAll() {
    var hearts = document.querySelectorAll('.heart');
    for (var i = 0; i < hearts.length; i++) reflect(hearts[i]);
    updateFab();
    renderPanel();
  }

  function updateFab() {
    if (!fab) return;
    var n = items.length;
    fabCount.textContent = n;
    fab.setAttribute('aria-label', n === 1 ? '1 saved favorite' : n + ' saved favorites');
    fab.classList.toggle('show', n > 0);
  }

  function renderPanel() {
    if (!panelList) return;
    if (!items.length) {
      panelList.innerHTML = '<p class="fav-empty">What\'s the point of a favorites list if you have no favorites?!</p>';
      return;
    }
    var html = '';
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      html +=
        '<div class="fav-item">' +
          '<div class="fav-item-main">' +
            '<div class="fav-item-name">' + esc(it.name) + '</div>' +
            (it.location ? '<div class="fav-item-loc">' + pinGlyph() + esc(it.location) + '</div>' : '') +
          '</div>' +
          '<div class="fav-item-actions">' +
            '<a class="fav-visit" href="' + esc(it.url) + '" target="_blank" rel="noopener">Visit</a>' +
            '<button type="button" class="fav-remove" data-url="' + esc(it.url) + '" ' +
              'aria-label="Remove ' + esc(it.name) + ' from favorites" title="Remove">' + heartSvg() + '</button>' +
          '</div>' +
        '</div>';
    }
    panelList.innerHTML = html;
    var removes = panelList.querySelectorAll('.fav-remove');
    for (var j = 0; j < removes.length; j++) {
      removes[j].addEventListener('click', function () { remove(this.dataset.url); });
    }
  }

  function openPanel() {
    lastFocus = document.activeElement;
    document.body.classList.add('fav-open');
    fab.setAttribute('aria-expanded', 'true');
    var close = panel.querySelector('.fav-close');
    if (close) close.focus();
  }
  function closePanel() {
    document.body.classList.remove('fav-open');
    fab.setAttribute('aria-expanded', 'false');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // ---------- init ----------
  // makeHeart and friends are exposed synchronously (app.js calls them as it
  // builds cards); the UI is built once the DOM is ready.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }

  window.Favorites = { makeHeart: makeHeart, isFav: isFav, toggle: toggle, remove: remove };
})();
