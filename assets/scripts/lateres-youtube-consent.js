/*
  Consent gate for YouTube embeds.

  No iframe is created until the visitor asks for one, either from the banner or
  from the placeholder shown in the video's place. The decision is stored under a
  single site-wide key so one click covers every embed on the site, and it can be
  withdrawn from the privacy policy page.
*/
(function () {
  'use strict';

  var STORAGE_KEY = 'lateres_youtube_consent';
  var GRANTED = 'granted';
  var DENIED = 'denied';
  var UNDECIDED = 'undecided';

  function readState() {
    var stored;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // Private mode or storage disabled: nothing was stored, nothing can be.
      return UNDECIDED;
    }
    return stored === GRANTED || stored === DENIED ? stored : UNDECIDED;
  }

  function writeState(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
  }

  /* youtube.com sets advertising cookies, youtube-nocookie.com does not. */
  function privacyEnhanced(src) {
    return src.replace(/^(https?:)?\/\/(www\.)?youtube\.com\//, 'https://www.youtube-nocookie.com/');
  }

  function buildPlayer(container) {
    var src = container.getAttribute('data-youtube-src');
    if (!src) {
      return;
    }

    var iframe = document.createElement('iframe');
    iframe.src = privacyEnhanced(src);
    iframe.title = container.getAttribute('data-youtube-title') || 'YouTube-video';
    iframe.setAttribute('allow', 'accelerometer; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    iframe.setAttribute('loading', 'lazy');

    /* Bootstrap's .embed-responsive positions the iframe; the placeholder goes away. */
    container.textContent = '';
    container.appendChild(iframe);
  }

  function loadAllPlayers() {
    var containers = document.querySelectorAll('[data-youtube-src]');
    for (var i = 0; i < containers.length; i++) {
      if (!containers[i].querySelector('iframe')) {
        buildPlayer(containers[i]);
      }
    }
  }

  /*
    Elements carrying data-youtube-consent-when are shown only in the states they
    name, e.g. "denied undecided". Used for the banner and the withdrawal controls.
  */
  function syncStateElements(state) {
    var nodes = document.querySelectorAll('[data-youtube-consent-when]');
    for (var i = 0; i < nodes.length; i++) {
      var states = nodes[i].getAttribute('data-youtube-consent-when').split(/\s+/);
      nodes[i].hidden = states.indexOf(state) === -1;
    }
  }

  function apply(state) {
    writeState(state);
    if (state === GRANTED) {
      loadAllPlayers();
      syncStateElements(GRANTED);
    } else {
      /* Reload so any iframe already on the page is torn out for good. */
      if (document.querySelector('[data-youtube-src] iframe')) {
        window.location.reload();
        return;
      }
      syncStateElements(state);
    }
  }

  document.addEventListener('click', function (event) {
    if (!event.target.closest) {
      return;
    }

    if (event.target.closest('[data-youtube-consent-grant]')) {
      event.preventDefault();
      apply(GRANTED);
      return;
    }

    if (event.target.closest('[data-youtube-consent-deny]')) {
      event.preventDefault();
      apply(DENIED);
    }
  });

  var state = readState();
  if (state === GRANTED) {
    loadAllPlayers();
  }
  syncStateElements(state);

  window.lateresYoutubeConsent = {
    state: readState,
    grant: function () {
      apply(GRANTED);
    },
    revoke: function () {
      apply(DENIED);
    }
  };
})();
