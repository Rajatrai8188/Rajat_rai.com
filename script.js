/**
 * Raja Rai — Portfolio
 * Handles: nav toggle, scroll reveal, project modals (with full details), contact form, DSA counter.
 * No frameworks; vanilla JS for performance and easy deploy (GitHub Pages / Vercel).
 */

(function () {
  'use strict';

  // ----- Project detail content for modals -----
  const projectDetails = {
    1: {
      title: '10-Minute Delivery Ban Impact Analysis on Indian Quick Commerce',
      problem: 'Understanding how India\'s regulatory ban on 10-minute quick-commerce delivery affected businesses, consumer behavior, and market dynamics.',
      tech: ['Python', 'SQL', 'Power BI'],
      built: 'Data pipelines for policy impact analysis; SQL for querying and aggregating delivery and market data; Power BI dashboards for business insights and stakeholder visualization.',
      outcome: 'Clear view of policy impact on quick-commerce: operational shifts, demand patterns, and business adaptations. Dashboards enable data-driven discussion of regulatory effects.'
    },
    2: {
      title: 'AI Voice Note Summarizer',
      problem: 'Converting long voice notes into concise, actionable summaries to save time and improve usability in real-world workflows.',
      built: 'NLP-based pipeline for transcribing and summarizing voice content. Focus on automation, accuracy, and integration for daily use.',
      tech: ['Python', 'NLP', 'AI/ML'],
      outcome: 'A practical tool that automates summarization and highlights key points from voice notes, demonstrating applied AI/ML and real-world usability.'
    }
  };

  // ----- DOM refs -----
  const header = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  const navLinks = nav ? nav.querySelectorAll('a') : [];
  const modalOverlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');
  const contactForm = document.getElementById('contact-form');
  const contactFeedback = document.getElementById('contact-feedback');
  const dsaNumberEl = document.querySelector('.dsa-number[data-count]');
  const sections = document.querySelectorAll('.section');
  const expandButtons = document.querySelectorAll('.project-expand');

  // ----- Nav: mobile toggle + close on link click -----
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ----- Header: add .scrolled on scroll -----
  function onScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----- Section reveal: add .is-revealed when in view -----
  const revealOpts = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, revealOpts);

  sections.forEach(function (section) {
    revealObserver.observe(section);
  });

  // ----- Project modals: open with full details -----
  function openModal(projectId) {
    const id = String(projectId);
    const data = projectDetails[id];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalContent.innerHTML = [
      data.problem ? `<div class="modal-detail-block"><h4>Problem</h4><p>${escapeHtml(data.problem)}</p></div>` : '',
      `<div class="modal-detail-block"><h4>Tech stack</h4><ul>${(data.tech || []).map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul></div>`,
      data.built ? `<div class="modal-detail-block"><h4>What was analyzed / built</h4><p>${escapeHtml(data.built)}</p></div>` : '',
      data.outcome ? `<div class="modal-detail-block"><h4>Outcome / insight</h4><p>${escapeHtml(data.outcome)}</p></div>` : ''
    ].filter(Boolean).join('');

    modalOverlay.setAttribute('aria-hidden', 'false');
    modalOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (modalClose) modalClose.focus();
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  expandButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const id = btn.getAttribute('data-project');
      openModal(id);
      btn.setAttribute('aria-expanded', 'true');
    });
  });

  function doCloseModal() {
    expandButtons.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    modalOverlay.classList.remove('is-open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (modalClose) {
    modalClose.addEventListener('click', doCloseModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) doCloseModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
      doCloseModal();
    }
  });

  // ----- Contact form: client-side validation + feedback (no backend) -----
  if (contactForm && contactFeedback) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      contactFeedback.classList.remove('error');

      const name = (contactForm.querySelector('[name="name"]') || {}).value || '';
      const email = (contactForm.querySelector('[name="email"]') || {}).value || '';
      const message = (contactForm.querySelector('[name="message"]') || {}).value || '';

      if (!name.trim()) {
        contactFeedback.textContent = 'Please enter your name.';
        contactFeedback.classList.add('error');
        return;
      }
      if (!email.trim()) {
        contactFeedback.textContent = 'Please enter your email.';
        contactFeedback.classList.add('error');
        return;
      }
      if (message.trim().length < 10) {
        contactFeedback.textContent = 'Message must be at least 10 characters.';
        contactFeedback.classList.add('error');
        return;
      }

      // No backend: show success and optionally mailto or leave for future API
      contactFeedback.textContent = 'Thanks! For now this form is display-only—link your Resume, GitHub, and LinkedIn for recruiters.';
      contactForm.reset();
    });
  }

  // ----- DSA counter: animate 0 → 200 when in view -----
  if (dsaNumberEl) {
    const target = parseInt(dsaNumberEl.getAttribute('data-count'), 10) || 200;
    const duration = 1500;

    const countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        let start = null;
        function step(timestamp) {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 2);
          el.textContent = Math.floor(easeOut * target);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target;
          }
        }
        requestAnimationFrame(step);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    countObserver.observe(dsaNumberEl);
  }
})();
