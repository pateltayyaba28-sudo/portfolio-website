/**
 * Tayyaba Patel — Portfolio Script
 * Vanilla JS · No external libraries
 *
 *  1.  Scroll progress bar
 *  2.  Navbar scroll effect (shadow on scroll)
 *  3.  Active nav link via Intersection Observer
 *  4.  Hamburger toggle (close on link / outside click / Escape)
 *  5.  Smooth scroll for all in-page anchors
 *  6.  Scroll-reveal animations (Intersection Observer)
 *  7.  Skill bar fill animation (Intersection Observer)
 *  8.  Contact form: validate → mailto submission
 *  9.  Back-to-top button
 * 10.  Hero blob parallax on mouse move (desktop only)
 * 11.  Card 3D tilt on hover (desktop only)
 * 12.  Auto year in footer
 */

'use strict';

/* ──────────────────────────────────────────────────────────────
   UTILITIES
────────────────────────────────────────────────────────────── */

function $(sel, root) { return (root || document).querySelector(sel); }
function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

function throttle(fn, ms) {
  var last = 0;
  return function () {
    var now = Date.now();
    if (now - last >= ms) { last = now; fn.apply(this, arguments); }
  };
}

/* ──────────────────────────────────────────────────────────────
   1. SCROLL PROGRESS BAR
────────────────────────────────────────────────────────────── */

var progressBar = $('#scrollProgress');

function updateProgress() {
  if (!progressBar) return;
  var scrollTop  = window.scrollY || document.documentElement.scrollTop;
  var docHeight  = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
  progressBar.setAttribute('aria-valuenow', Math.round(pct));
}

window.addEventListener('scroll', throttle(updateProgress, 16), { passive: true });
updateProgress();

/* ──────────────────────────────────────────────────────────────
   2. NAVBAR SCROLL EFFECT
────────────────────────────────────────────────────────────── */

var navbar = $('#navbar');

function handleNavbarScroll() {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}

window.addEventListener('scroll', throttle(handleNavbarScroll, 80), { passive: true });
handleNavbarScroll();

/* ──────────────────────────────────────────────────────────────
   3. ACTIVE NAV LINK — Intersection Observer per section
────────────────────────────────────────────────────────────── */

var navLinks = $$('.nav-link');
var sections = $$('section[id]');

// Map section id → nav link
var navMap = {};
navLinks.forEach(function (link) {
  var href = link.getAttribute('href');
  if (href && href.startsWith('#')) {
    navMap[href.slice(1)] = link;
  }
});

function setActive(id) {
  navLinks.forEach(function (link) { link.classList.remove('active'); });
  if (id && navMap[id]) { navMap[id].classList.add('active'); }
}

var sectionObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  },
  {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0,
  }
);

sections.forEach(function (s) { sectionObserver.observe(s); });

/* ──────────────────────────────────────────────────────────────
   4. HAMBURGER MENU
────────────────────────────────────────────────────────────── */

var hamburger = $('#hamburger');
var navLinksEl = $('#navLinks');

function openMenu() {
  if (!navLinksEl || !hamburger) return;
  navLinksEl.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  if (!navLinksEl || !hamburger) return;
  navLinksEl.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (hamburger) {
  hamburger.addEventListener('click', function () {
    var isOpen = navLinksEl && navLinksEl.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });
}

// Close on nav link click
if (navLinksEl) {
  navLinksEl.addEventListener('click', function (e) {
    if (e.target.closest('.nav-link') || e.target.closest('.nav-hire-btn')) {
      closeMenu();
    }
  });
}

// Close on outside click
document.addEventListener('click', function (e) {
  if (
    navLinksEl &&
    navLinksEl.classList.contains('open') &&
    !navLinksEl.contains(e.target) &&
    hamburger &&
    !hamburger.contains(e.target)
  ) {
    closeMenu();
  }
});

// Close on Escape
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && navLinksEl && navLinksEl.classList.contains('open')) {
    closeMenu();
    if (hamburger) hamburger.focus();
  }
});

/* ──────────────────────────────────────────────────────────────
   5. SMOOTH SCROLL
────────────────────────────────────────────────────────────── */

document.addEventListener('click', function (e) {
  var anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  var hash = anchor.getAttribute('href');
  if (!hash || hash === '#') return;
  var target = document.querySelector(hash);
  if (!target) return;
  e.preventDefault();
  var navH = navbar ? navbar.getBoundingClientRect().height : 0;
  var top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
  window.scrollTo({ top: top, behavior: 'smooth' });
});

/* ──────────────────────────────────────────────────────────────
   6. SCROLL REVEAL ANIMATIONS
────────────────────────────────────────────────────────────── */

var revealObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);

$$('.reveal').forEach(function (el) { revealObserver.observe(el); });

/* ──────────────────────────────────────────────────────────────
   7. SKILL BAR FILL ANIMATION
────────────────────────────────────────────────────────────── */

var skillObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var fill = entry.target;
        var w = fill.getAttribute('data-width');
        requestAnimationFrame(function () {
          fill.style.width = w + '%';
        });
        skillObserver.unobserve(fill);
      }
    });
  },
  { threshold: 0.25 }
);

$$('.skill-fill').forEach(function (bar) { skillObserver.observe(bar); });

/* ──────────────────────────────────────────────────────────────
   8. CONTACT FORM — validation + mailto
────────────────────────────────────────────────────────────── */

var contactForm = $('#contactForm');
var submitBtn   = $('#submitBtn');
var formSuccess = $('#formSuccess');

var rules = [
  {
    fieldId: 'fname',
    errorId: 'fnameError',
    validate: function (v) {
      v = v.trim();
      if (!v) return 'Please enter your name.';
      if (v.length < 2) return 'Name must be at least 2 characters.';
      return '';
    },
  },
  {
    fieldId: 'femail',
    errorId: 'femailError',
    validate: function (v) {
      v = v.trim();
      if (!v) return 'Please enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Please enter a valid email address.';
      return '';
    },
  },
  {
    fieldId: 'fsubject',
    errorId: 'fsubjectError',
    validate: function (v) {
      v = v.trim();
      if (!v) return 'Please enter a subject.';
      if (v.length < 3) return 'Subject must be at least 3 characters.';
      return '';
    },
  },
  {
    fieldId: 'fmessage',
    errorId: 'fmessageError',
    validate: function (v) {
      v = v.trim();
      if (!v) return 'Please enter your message.';
      if (v.length < 20) return 'Message must be at least 20 characters.';
      return '';
    },
  },
];

function setFieldError(fieldId, errorId, msg) {
  var field = $('#' + fieldId);
  var errEl = $('#' + errorId);
  if (!field || !errEl) return;
  if (msg) {
    field.classList.add('invalid');
    errEl.textContent = msg;
  } else {
    field.classList.remove('invalid');
    errEl.textContent = '';
  }
}

function validateAll() {
  var ok = true;
  rules.forEach(function (r) {
    var field = $('#' + r.fieldId);
    if (!field) return;
    var err = r.validate(field.value);
    setFieldError(r.fieldId, r.errorId, err);
    if (err) ok = false;
  });
  return ok;
}

var touched = false;

// Live validation after first submit attempt
rules.forEach(function (r) {
  var field = $('#' + r.fieldId);
  if (!field) return;
  ['input', 'blur'].forEach(function (ev) {
    field.addEventListener(ev, function () {
      if (!touched) return;
      setFieldError(r.fieldId, r.errorId, r.validate(field.value));
    });
  });
});

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    touched = true;

    if (formSuccess) {
      formSuccess.classList.remove('visible');
      formSuccess.textContent = '';
    }

    if (!validateAll()) {
      var firstErr = contactForm.querySelector('.invalid');
      if (firstErr) firstErr.focus();
      return;
    }

    var name    = ($('#fname')    ? $('#fname').value.trim()    : '');
    var email   = ($('#femail')   ? $('#femail').value.trim()   : '');
    var subject = ($('#fsubject') ? $('#fsubject').value.trim() : '');
    var message = ($('#fmessage') ? $('#fmessage').value.trim() : '');

    var body =
      'Name: ' + name + '\n' +
      'Email: ' + email + '\n\n' +
      message;

    var mailto =
      'mailto:pateltayyaba28@gmail.com' +
      '?subject=' + encodeURIComponent(subject) +
      '&body='    + encodeURIComponent(body);

    if (formSuccess) {
      formSuccess.textContent = 'Opening your email client — your message is pre-filled and ready to send!';
      formSuccess.classList.add('visible');
    }

    window.location.href = mailto;

    setTimeout(function () {
      contactForm.reset();
      touched = false;
      rules.forEach(function (r) { setFieldError(r.fieldId, r.errorId, ''); });
      if (formSuccess) {
        formSuccess.classList.remove('visible');
        formSuccess.textContent = '';
      }
    }, 2000);
  });
}

/* ──────────────────────────────────────────────────────────────
   9. BACK TO TOP BUTTON
────────────────────────────────────────────────────────────── */

var backToTop = $('#backToTop');

function handleBackToTop() {
  if (!backToTop) return;
  backToTop.classList.toggle('visible', window.scrollY > 400);
}

window.addEventListener('scroll', throttle(handleBackToTop, 120), { passive: true });
handleBackToTop();

if (backToTop) {
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ──────────────────────────────────────────────────────────────
   10. HERO BLOB PARALLAX (desktop mouse move)
────────────────────────────────────────────────────────────── */

var blobs = $$('.blob');
var isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (isDesktop && blobs.length) {
  document.addEventListener('mousemove', throttle(function (e) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var x = (e.clientX / w - 0.5) * 2; // -1 to 1
    var y = (e.clientY / h - 0.5) * 2;

    blobs.forEach(function (blob, i) {
      var depth = (i + 1) * 12;
      blob.style.transform = 'translate(' + (x * depth) + 'px, ' + (y * depth) + 'px)';
    });
  }, 30));
}

/* ──────────────────────────────────────────────────────────────
   11. CARD 3D TILT (desktop hover)
────────────────────────────────────────────────────────────── */

if (isDesktop) {
  var tiltCards = $$('.project-card, .skill-card');

  tiltCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width  - 0.5;
      var y = (e.clientY - rect.top)  / rect.height - 0.5;
      var tX = y * -6;
      var tY = x *  6;
      card.style.transform =
        'perspective(900px) rotateX(' + tX + 'deg) rotateY(' + tY + 'deg) translateY(-6px)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });
}

/* ──────────────────────────────────────────────────────────────
   12. AUTO YEAR IN FOOTER
────────────────────────────────────────────────────────────── */

var yearEl = $('#footerYear');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
