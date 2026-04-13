(function () {
  'use strict';

  /* ── 1. Page Load Fade ───────────────────────────────────── */

  function initPageFade() {
    window.addEventListener('load', function () {
      document.body.classList.add('nmp-loaded');
    });
  }

  /* ── 2. Hero Entrance ────────────────────────────────────── */

  function initHeroEntrance() {
    var hero = document.querySelector('main > section:first-child');
    if (!hero) return;

    var heading = hero.querySelector('h2');
    var tagline = hero.querySelector('p');

    window.addEventListener('load', function () {
      setTimeout(function () {
        if (heading) heading.classList.add('nmp-hero-in');
        if (tagline) tagline.classList.add('nmp-hero-in');
      }, 120);
    });
  }

  /* ── 3. Staff & Owners expandable buttons ───────────── */

  document.querySelectorAll('article.expandable'). forEach(article => {
    const header = article.querySelector('.card-header');
    const btn = article.querySelector('.expand-btn');

    header.addEventListener('click', () => {
      const isOpen = article.classList.toggle('is-open');
      btn.setAttribute('aria-expanded'. isOpen);
    });
  });

  /* ── 4. Scroll Reveal via IntersectionObserver ───────────── */

  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: just make everything visible immediately
      document.querySelectorAll('.nmp-reveal').forEach(function (el) {
        el.classList.add('nmp-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('nmp-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    document.querySelectorAll('.nmp-reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── 5. Mark Elements for Scroll Reveal ─────────────────── */

  function markRevealTargets() {
    var selectors = [
      'main > section:nth-child(2)',
      'main > section:nth-child(2) p',
      'main > section:nth-child(3) article',
      'main > section:nth-child(4) article',
      'main > section:has(form) > h2',
      'main > section:has(form) > p',
      'main > section:has(form) form',
      'main > section:last-of-type article'
    ];

    selectors.forEach(function (selector) {
      try {
        document.querySelectorAll(selector).forEach(function (el) {
          el.classList.add('nmp-reveal');
        });
      } catch (e) {
        // :has() not supported in older browsers — skip gracefully
      }
    });

    // Section headings (h2s inside main sections, excluding hero)
    var sections = document.querySelectorAll('main > section');
    sections.forEach(function (section, index) {
      if (index === 0) return; // skip hero — handled separately
      var h2 = section.querySelector('h2');
      if (h2) h2.classList.add('nmp-reveal');
    });
  }

  /* ── Init ────────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    initPageFade();
    initHeroEntrance();
    markRevealTargets();
    initScrollReveal();
  });

}());