/* ===== NAVBAR — scroll shadow + active link ===== */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
  highlightNav();
});

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
    navLinks.classList.remove('open');
  }
});

/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===== ACTIVE NAV LINK ===== */
function highlightNav() {
  const sections   = document.querySelectorAll('section');
  const navAnchors = document.querySelectorAll('.nav-links a');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 160) current = sec.getAttribute('id');
  });
  navAnchors.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}
highlightNav();

/* ===== TYPING ANIMATION ===== */
const roles = ['AI & ML Engineer', 'Full-Stack Developer', 'Problem Solver', 'Software Developer'];
let roleIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  if (!typedEl) return;
  const current = roles[roleIndex];
  const speed   = isDeleting ? 55 : 95;
  if (isDeleting) {
    typedEl.textContent = current.slice(0, charIndex--);
    if (charIndex < 0) {
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roles.length;
      setTimeout(type, 500); return;
    }
  } else {
    typedEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      isDeleting = true; setTimeout(type, 2000); return;
    }
  }
  setTimeout(type, speed);
}
type();

/* ===== PARTICLE STARFIELD ===== */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const COUNT = 90;
  const COLOR = '0,212,160';

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    return {
      x:    rand(0, W),
      y:    rand(0, H),
      r:    rand(0.6, 2.2),
      dx:   rand(-0.25, 0.25),
      dy:   rand(-0.2, -0.05),
      alpha: rand(0.3, 0.9),
      dAlpha: rand(0.002, 0.005),
      fadeIn: true,
    };
  }

  for (let i = 0; i < COUNT; i++) particles.push(createParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      /* twinkle */
      if (p.fadeIn) {
        p.alpha += p.dAlpha;
        if (p.alpha >= 0.9) p.fadeIn = false;
      } else {
        p.alpha -= p.dAlpha;
        if (p.alpha <= 0.2) p.fadeIn = true;
      }

      /* move */
      p.x += p.dx;
      p.y += p.dy;

      /* wrap around */
      if (p.y < -5) { p.y = H + 5; p.x = rand(0, W); }
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;

      /* draw dot */
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLOR},${p.alpha})`;
      ctx.fill();
    });

    /* draw connecting lines between nearby particles */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${COLOR},${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ===== 3D TILT EFFECT ON PROJECT CARDS ===== */
(function initTilt() {
  /* Skip on touch/mobile devices */
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('[data-tilt]').forEach(card => {
    const MAX_TILT  = 10; /* degrees */
    const MAX_SHIFT = 6;  /* px translate */

    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2); /* -1 to 1 */
      const dy     = (e.clientY - cy) / (rect.height / 2); /* -1 to 1 */

      const rotateX =  -dy * MAX_TILT;
      const rotateY =   dx * MAX_TILT;
      const shiftX  =   dx * MAX_SHIFT;
      const shiftY  =   dy * MAX_SHIFT;

      card.style.transform =
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(${shiftX}px,${shiftY}px) scale(1.03)`;
      card.style.transition = 'transform 0.1s ease';

      /* move glow with cursor */
      const glow = card.querySelector('.card-glow');
      if (glow) {
        const gx = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
        const gy = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
        glow.style.background =
          `radial-gradient(ellipse at ${gx}% ${gy}%, rgba(0,212,160,0.18), transparent 65%)`;
        glow.style.opacity = '1';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) translate(0,0) scale(1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      const glow = card.querySelector('.card-glow');
      if (glow) glow.style.opacity = '0';
    });
  });
})();

/* ===== CONTACT FORM ===== */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.innerHTML  = '<i class="fas fa-check"></i> Message Sent!';
  btn.style.background = 'linear-gradient(135deg,#00c896,#009970)';
  btn.disabled   = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    btn.style.background = '';
    btn.disabled  = false;
    e.target.reset();
  }, 3000);
}
