/**
 * Tayyaba Patel — Portfolio Script
 * Vanilla JS only. No external libraries.
 *
 * Features:
 *  - Sticky navbar with scroll-triggered styling
 *  - Active nav link highlighting based on scroll position
 *  - Mobile hamburger menu with overlay close
 *  - Smooth scroll for all in-page anchors
 *  - Intersection Observer: reveal-on-scroll animations
 *  - Intersection Observer: skill bar fill animations
 *  - Contact form validation with inline errors
 *  - Footer year auto-update
 */

'use strict';

/* ──────────────────────────────────────────────────────────────
   UTILITIES
────────────────────────────────────────────────────────────── */

/**
 * Query a single element, scoped to an optional parent.
 * @param {string} selector
 * @param {Element|Document} [parent=document]
 * @returns {Element|null}
 */
function $(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Query all matching elements as an Array.
 * @param {string} selector
 * @param {Element|Document} [parent=document]
 * @returns {Element[]}
 */
function $$(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

/**
 * Throttle a function so it fires at most once per `limit` ms.
 * @param {Function} fn
 * @param {number} limit - milliseconds
 * @returns {Function}
 */
function throttle(fn, limit = 100) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

/* ──────────────────────────────────────────────────────────────
   1. NAVBAR — scroll-triggered styling
────────────────────────────────────────────────────────────── */

const navbar = $('#navbar');

function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', throttle(handleNavbarScroll, 80), { passive: true });
handleNavbarScroll(); // run once on load

/* ──────────────────────────────────────────────────────────────
   2. SMOOTH SCROLL — for all in-page anchor links
────────────────────────────────────────────────────────────── */

function smoothScrollTo(targetEl) {
  if (!targetEl) return;
  const navHeight = navbar ? navbar.getBoundingClientRect().height : 0;
  const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 8;
  window.scrollTo({ top, behavior: 'smooth' });
}

document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const hash = anchor.getAttribute('href');
  if (!hash || hash === '#') return;
  const target = document.querySelector(hash);
  if (!target) return;
  e.preventDefault();
  smoothScrollTo(target);
});

/* ──────────────────────────────────────────────────────────────
   3. ACTIVE NAV LINK — highlight current section on scroll
────────────────────────────────────────────────────────────── */

const navLinks = $$('.nav-link');
const sections = $$('section[id]');

function updateActiveLink() {
  const navHeight = navbar ? navbar.getBoundingClientRect().height : 0;
  const scrollMid = window.scrollY + navHeight + 80;

  let currentId = '';

  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollMid >= top && scrollMid < bottom) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === `#${currentId}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', throttle(updateActiveLink, 100), { passive: true });
updateActiveLink();

/* ──────────────────────────────────────────────────────────────
   4. HAMBURGER MENU
────────────────────────────────────────────────────────────── */

const hamburger = $('#hamburger');
const navLinksEl = $('#navLinks');

function openMenu() {
  navLinksEl.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  navLinksEl.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = navLinksEl.classList.contains('open');
  isOpen ? closeMenu() : openMenu();
});

// Close menu when a nav link is clicked
navLinksEl.addEventListener('click', (e) => {
  if (e.target.closest('.nav-link')) {
    closeMenu();
  }
});

// Close menu on click outside (on the backdrop)
document.addEventListener('click', (e) => {
  if (
    navLinksEl.classList.contains('open') &&
    !navLinksEl.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    closeMenu();
  }
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinksEl.classList.contains('open')) {
    closeMenu();
    hamburger.focus();
  }
});

/* ──────────────────────────────────────────────────────────────
   5. SCROLL REVEAL — Intersection Observer
────────────────────────────────────────────────────────────── */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once visible, stop watching to save resources
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  }
);

$$('.reveal').forEach((el) => revealObserver.observe(el));

/* ──────────────────────────────────────────────────────────────
   6. SKILL BAR ANIMATION — fill on reveal
────────────────────────────────────────────────────────────── */

const skillBarObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const targetWidth = fill.getAttribute('data-width');
        // Small delay for visual appeal
        requestAnimationFrame(() => {
          fill.style.width = targetWidth + '%';
        });
        skillBarObserver.unobserve(fill);
      }
    });
  },
  { threshold: 0.4 }
);

$$('.skill-bar-fill').forEach((bar) => skillBarObserver.observe(bar));

/* ──────────────────────────────────────────────────────────────
   7. CONTACT FORM VALIDATION
────────────────────────────────────────────────────────────── */

const contactForm = $('#contactForm');

/**
 * Validation rules for each field.
 * Each entry: { fieldId, errorId, validate: (value) => string|'' }
 */
const validationRules = [
  {
    fieldId: 'name',
    errorId: 'nameError',
    validate: (v) => {
      if (!v.trim()) return 'Please enter your name.';
      if (v.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    },
  },
  {
    fieldId: 'email',
    errorId: 'emailError',
    validate: (v) => {
      if (!v.trim()) return 'Please enter your email address.';
      // RFC 5322-like simple check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(v.trim())) return 'Please enter a valid email address.';
      return '';
    },
  },
  {
    fieldId: 'subject',
    errorId: 'subjectError',
    validate: (v) => {
      if (!v.trim()) return 'Please enter a subject.';
      if (v.trim().length < 3) return 'Subject must be at least 3 characters.';
      return '';
    },
  },
  {
    fieldId: 'message',
    errorId: 'messageError',
    validate: (v) => {
      if (!v.trim()) return 'Please enter your message.';
      if (v.trim().length < 20) return 'Message must be at least 20 characters.';
      return '';
    },
  },
];

/**
 * Show or clear an error for a single field.
 * @param {string} fieldId
 * @param {string} errorId
 * @param {string} message - empty string = no error
 */
function setFieldError(fieldId, errorId, message) {
  const field = $(`#${fieldId}`);
  const errorEl = $(`#${errorId}`);
  if (!field || !errorEl) return;

  if (message) {
    field.classList.add('invalid');
    errorEl.textContent = message;
  } else {
    field.classList.remove('invalid');
    errorEl.textContent = '';
  }
}

/**
 * Validate all fields. Returns true if all pass.
 * @returns {boolean}
 */
function validateForm() {
  let allValid = true;
  validationRules.forEach(({ fieldId, errorId, validate }) => {
    const field = $(`#${fieldId}`);
    if (!field) return;
    const error = validate(field.value);
    setFieldError(fieldId, errorId, error);
    if (error) allValid = false;
  });
  return allValid;
}

// Live validation on input (only after first submit attempt)
let hasSubmitted = false;

validationRules.forEach(({ fieldId, errorId, validate }) => {
  const field = $(`#${fieldId}`);
  if (!field) return;
  field.addEventListener('input', () => {
    if (!hasSubmitted) return;
    const error = validate(field.value);
    setFieldError(fieldId, errorId, error);
  });
  field.addEventListener('blur', () => {
    if (!hasSubmitted) return;
    const error = validate(field.value);
    setFieldError(fieldId, errorId, error);
  });
});

const submitBtn = $('#submitBtn');
const formSuccess = $('#formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hasSubmitted = true;

    // Hide any previous success message
    formSuccess.classList.remove('visible');
    formSuccess.textContent = '';

    const isValid = validateForm();
    if (!isValid) {
      // Focus first invalid field for accessibility
      const firstInvalid = contactForm.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Simulate async form submission
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    const btnText = submitBtn.querySelector('.btn-text');
    const originalText = btnText.textContent;
    btnText.textContent = 'Sending';

    try {
      await simulateFormSubmit();

      // Success
      formSuccess.textContent = 'Message sent! I\'ll be in touch within 24 hours.';
      formSuccess.classList.add('visible');
      contactForm.reset();
      hasSubmitted = false;

      // Clear any remaining error states
      validationRules.forEach(({ fieldId, errorId }) => {
        setFieldError(fieldId, errorId, '');
      });
    } catch {
      formSuccess.style.background = 'rgba(248,113,113,0.08)';
      formSuccess.style.borderColor = 'rgba(248,113,113,0.2)';
      formSuccess.style.color = '#f87171';
      formSuccess.textContent = 'Something went wrong. Please try again or email me directly.';
      formSuccess.classList.add('visible');
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      btnText.textContent = originalText;
    }
  });
}

/**
 * Fake async submission (1.5 s delay).
 * Replace with a real fetch() call in production.
 * @returns {Promise<void>}
 */
function simulateFormSubmit() {
  return new Promise((resolve) => setTimeout(resolve, 1500));
}

/* ──────────────────────────────────────────────────────────────
   8. FOOTER YEAR
────────────────────────────────────────────────────────────── */

const yearEl = $('#year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* ──────────────────────────────────────────────────────────────
   9. HERO — subtle parallax on mouse move (desktop only)
────────────────────────────────────────────────────────────── */

const heroShapes = $$('.shape');

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.addEventListener('mousemove', throttle((e) => {
    const { innerWidth: w, innerHeight: h } = window;
    const x = (e.clientX / w - 0.5) * 2; // -1 to 1
    const y = (e.clientY / h - 0.5) * 2; // -1 to 1

    heroShapes.forEach((shape, i) => {
      const depth = (i + 1) * 8;
      shape.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });
  }, 30));
}

/* ──────────────────────────────────────────────────────────────
   10. CARD TILT EFFECT — subtle 3D on project cards (desktop)
────────────────────────────────────────────────────────────── */

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const cards = $$('.project-card, .skill-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top)  / rect.height - 0.5;

      const tiltX = y * -8;  // degrees
      const tiltY = x *  8;

      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
