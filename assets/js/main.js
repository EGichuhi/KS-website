// ── Nav scroll effect ─────────────────────────────────────
const nav = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Mobile Menu ───────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';

    navToggle.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('mobile-open');
    navToggle.classList.toggle('active');
  });
}

// ── Scroll Reveal Animation ───────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { 
  threshold: 0.12, 
  rootMargin: '0px 0px -40px 0px' 
});

revealEls.forEach(el => observer.observe(el));

// Trigger hero reveals immediately
document.querySelectorAll('#hero .reveal').forEach(el => {
  el.classList.add('visible');
});

// ── Contact Form Submission ───────────────────────────────
const MAKE_WEBHOOK_URL = 'YOUR_MAKE_WEBHOOK_URL'; // ← Replace with your actual Make webhook URL

const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMsg = document.getElementById('formMsg');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    formMsg.className = 'form-msg';

    const data = new FormData(form);

    const payload = {
      first_name: data.get('first_name'),
      last_name: data.get('last_name'),
      email: data.get('email'),
      phone: data.get('phone') || '',
      service: data.get('service'),
      message: data.get('message'),
      submitted_at: new Date().toISOString(),
      source: 'jackiekariuki.ca'
    };

    try {
      const res = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        formMsg.textContent = '✓ Your message has been sent! I\'ll be in touch within 48 hours.';
        formMsg.className = 'form-msg success';
        form.reset();
      } else {
        throw new Error('Webhook returned ' + res.status);
      }
    } catch (err) {
      formMsg.textContent = 'Something went wrong. Please email me directly at jackiekariuki@gmail.com';
      formMsg.className = 'form-msg error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}