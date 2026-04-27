(function () {
  'use strict';

  /* ── 1. Page Load Fade ───────────────────────────────────── */

  function initPageFade() {
    window.addEventListener('load', () => {
      document.body.classList.add('nmp-loaded');
    });
  }

  /* ── 2. Hero Entrance ────────────────────────────────────── */

  function initHeroEntrance() {
    const hero = document.querySelector('main > section:first-child');
    if (!hero) return;

    const heading = hero.querySelector('h2');
    const tagline = hero.querySelector('p');

    window.addEventListener('load', () => {
      setTimeout(() => {
        if (heading) heading.classList.add('nmp-hero-in');
        if (tagline) tagline.classList.add('nmp-hero-in');
      }, 120);
    });
  }

  /* ── 3. Staff & Owners expandable buttons ───────────── */

  function initExpandableCards() {
    document.querySelectorAll('article.expandable').forEach(article => {
      const header = article.querySelector('.card-header');
      const btn = article.querySelector('.expand-btn');

      if (!header || !btn) return;

      header.addEventListener('click', () => {
        const isOpen = article.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', isOpen);
      });
    });
  }

  /* ── 4. Scroll Reveal via IntersectionObserver ───────────── */

  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: just make everything visible immediately
      document.querySelectorAll('.nmp-reveal').forEach(el => {
        el.classList.add('nmp-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
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

    document.querySelectorAll('.nmp-reveal').forEach(el => {
      observer.observe(el);
    });
  }

  /* ── 5. Mark Elements for Scroll Reveal ─────────────────── */

  function markRevealTargets() {
    const selectors = [
      'main > section:nth-child(2)',
      'main > section:nth-child(2) p',
      'main > section:nth-child(3) article',
      'main > section:nth-child(4) article',
      'main > section:has(form) > h2',
      'main > section:has(form) > p',
      'main > section:has(form) form',
      'main > section:last-of-type article'
    ];

    selectors.forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(el => {
          el.classList.add('nmp-reveal');
        });
      } catch (e) {
        // :has() not supported in older browsers — skip gracefully
      }
    });

    // Section headings (h2s inside main sections, excluding hero)
    const sections = document.querySelectorAll('main > section');
    sections.forEach((section, index) => {
      if (index === 0) return; // skip hero — handled separately
      const h2 = section.querySelector('h2');
      if (h2) h2.classList.add('nmp-reveal');
    });
  }

  /* ── Init ────────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', () => {
    initPageFade();
    initHeroEntrance();
    initExpandableCards();
    markRevealTargets();
    initScrollReveal();
  });

}());
