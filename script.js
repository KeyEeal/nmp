(function () {
  'use strict';

  /* ── 0. CSS :has() Feature Support Detection ─────────────── */

  try {
    if (!CSS.supports("selector(:has(*))")) {
      document.documentElement.classList.add("no-has");
    }
  } catch (e) {
    document.documentElement.classList.add("no-has");
  }

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

  /* ── 6. Contact Form (Formspree) ────────────────────────── */

  function initContactForm() {
    const form = document.getElementById('nmp-contact-form');
    if (!form) return;

    const modal = document.getElementById('nmp-success-modal');
    const closeButtons = document.querySelectorAll('.nmp-modal-close, #nmp-close-modal-btn');
    const overlay = document.querySelector('.nmp-modal-overlay');
    const submitBtn = form.querySelector('[data-fs-submit-btn]');

    function openModal() {
      if (!modal) return;
      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const closeBtn = document.getElementById('nmp-close-modal-btn');
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (submitBtn) submitBtn.focus();
    }

    closeButtons.forEach(btn => btn.addEventListener('click', closeModal));
    if (overlay) overlay.addEventListener('click', closeModal);

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal?.classList.contains('is-active')) closeModal();
    });

    // Focus trap
    window.addEventListener('keydown', e => {
      if (!modal?.classList.contains('is-active')) return;
      const focusable = modal.querySelectorAll('button, [tabindex="0"]');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          last.focus(); e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus(); e.preventDefault();
        }
      }
    });

    // Handle submission manually
    form.addEventListener('submit', async e => {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      try {
        const response = await fetch('https://formspree.io/f/mpqblbje', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });

        if (response.ok) {
          form.reset();
          openModal();
        } else {
          const data = await response.json();
          const msg = data?.errors?.map(e => e.message).join(', ') || 'Something went wrong. Please try again.';
          alert(msg);
        }
      } catch (err) {
        alert('Network error. Please check your connection and try again.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
      }
    });
  }

  /* ── Init ────────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', () => {
    initPageFade();
    initHeroEntrance();
    initExpandableCards();
    markRevealTargets();
    initScrollReveal();
    initContactForm();
  });

}());
