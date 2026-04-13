/* HydraPo v2 — script.js */
'use strict';

// ==============================
// NAV SCROLL EFFECT
// ==============================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ==============================
// HAMBURGER (MOBILE)
// ==============================
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');
let menuOpen = false;
if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', () => {
        menuOpen = !menuOpen;
        if (menuOpen) {
            navLinksEl.style.cssText = `
        display:flex;flex-direction:column;position:fixed;top:64px;left:0;right:0;
        background:rgba(6,10,7,0.98);padding:32px 36px;border-bottom:1px solid rgba(52,255,107,0.12);
        backdrop-filter:blur(24px);gap:24px;z-index:999;`;
        } else {
            navLinksEl.style.cssText = '';
        }
        hamburger.style.opacity = menuOpen ? '0.6' : '1';
    });
    navLinksEl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        menuOpen = false;
        navLinksEl.style.cssText = '';
    }));
}

// ==============================
// HERO CANVAS — Animated Roots + Particles
// ==============================
(function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    // Roots
    const roots = Array.from({ length: 28 }, createRoot);
    function createRoot() {
        return {
            x: Math.random() * (W || 1200),
            y: Math.random() > 0.5 ? 0 : (H || 800),
            segs: [],
            len: 0,
            maxLen: 100 + Math.random() * 220,
            angle: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 0.9,
            opacity: 0.06 + Math.random() * 0.16,
            thick: 0.3 + Math.random() * 0.8,
            wobble: (Math.random() - 0.5) * 0.08,
        };
    }

    // Particles
    const particles = Array.from({ length: 80 }, createParticle);
    function createParticle() {
        return {
            x: Math.random() * (W || 1200),
            y: Math.random() * (H || 800),
            r: 0.4 + Math.random() * 1.8,
            vx: (Math.random() - 0.5) * 0.25,
            vy: -0.08 - Math.random() * 0.25,
            life: Math.random(),
            decay: 0.003 + Math.random() * 0.004,
            opacity: 0.08 + Math.random() * 0.35,
        };
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Roots
        for (let i = 0; i < roots.length; i++) {
            const r = roots[i];
            if (!r.segs.length) {
                r.x = Math.random() * W;
                r.y = Math.random() > 0.5 ? 0 : H;
                r.angle = r.y === 0
                    ? (Math.PI / 2) + (Math.random() - 0.5) * 1.2
                    : -(Math.PI / 2) + (Math.random() - 0.5) * 1.2;
                r.segs.push({ x: r.x, y: r.y });
                r.len = 0;
            }
            if (r.len < r.maxLen) {
                const last = r.segs[r.segs.length - 1];
                r.angle += r.wobble + (Math.random() - 0.5) * 0.1;
                const nx = last.x + Math.cos(r.angle) * r.speed;
                const ny = last.y + Math.sin(r.angle) * r.speed;
                r.segs.push({ x: nx, y: ny });
                r.len += r.speed;
                // Random branch
                if (Math.random() < 0.018 && r.segs.length > 8 && roots.length < 80) {
                    roots.push({ ...createRoot(), x: nx, y: ny, segs: [{ x: nx, y: ny }], len: 0, maxLen: r.maxLen * 0.55, angle: r.angle + (Math.random() - 0.5) * 1.2, opacity: r.opacity * 0.55, thick: r.thick * 0.6 });
                }
            } else {
                r.segs.shift();
                if (r.segs.length < 2) {
                    Object.assign(r, createRoot());
                    r.segs = [];
                }
            }
            if (r.segs.length < 2) continue;
            ctx.beginPath();
            ctx.moveTo(r.segs[0].x, r.segs[0].y);
            for (let j = 1; j < r.segs.length; j++) ctx.lineTo(r.segs[j].x, r.segs[j].y);
            ctx.strokeStyle = `rgba(52,255,107,${r.opacity})`;
            ctx.lineWidth = r.thick;
            ctx.stroke();
        }
        // Prune
        if (roots.length > 100) roots.splice(30, roots.length - 100);

        // Particles
        for (const p of particles) {
            p.x += p.vx; p.y += p.vy; p.life += p.decay;
            const fade = Math.sin(p.life * Math.PI);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(52,255,107,${p.opacity * fade})`;
            ctx.fill();
            if (p.life >= 1 || p.y < -10 || p.x < -10 || p.x > W + 10) {
                Object.assign(p, createParticle());
                p.y = H + 10;
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
})();

// ==============================
// TYPING HEADLINE
// ==============================
(function typeHeadline() {
    const el = document.getElementById('typed-headline');
    if (!el) return;
    const phrases = ['Grows Here.', 'Starts Now.', 'Feeds Cities.', 'Changes Lives.'];
    let pi = 0, ci = 0, deleting = false;

    function tick() {
        const phrase = phrases[pi];
        if (!deleting) {
            el.textContent = phrase.slice(0, ++ci);
            if (ci === phrase.length) { deleting = true; setTimeout(tick, 2800); return; }
            setTimeout(tick, 65);
        } else {
            el.textContent = phrase.slice(0, --ci);
            if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 400); return; }
            setTimeout(tick, 38);
        }
    }
    setTimeout(tick, 1200);
})();

// ==============================
// INTERSECTION OBSERVER — REVEAL
// ==============================
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            setTimeout(() => el.classList.add('revealed'), +(el.dataset.delay || 0));
            revealObs.unobserve(el);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

revealEls.forEach((el) => {
    const sib = [...el.parentElement.children].filter(c =>
        c.classList.contains('reveal-up') || c.classList.contains('reveal-left') || c.classList.contains('reveal-right')
    );
    el.dataset.delay = sib.indexOf(el) * 100;
    revealObs.observe(el);
});

// ==============================
// ANIMATED COUNTERS
// ==============================
function animCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const dur = 2000;
    const start = performance.now();
    function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = Math.floor(eased * target);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target;
    }
    requestAnimationFrame(tick);
}

const cObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.querySelectorAll('.counter').forEach(animCounter);
        e.target.querySelectorAll('.stat-fill, .growth-fill').forEach(f => setTimeout(() => f.classList.add('animated'), 250));
        cObs.unobserve(e.target);
    });
}, { threshold: 0.25 });

['impact', 'grow'].forEach(id => {
    const s = document.getElementById(id);
    if (s) cObs.observe(s);
});

// ==============================
// SMOOTH SCROLL
// ==============================
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
});

// ==============================
// HERO PARALLAX
// ==============================
const heroContent = document.getElementById('hero-content');
window.addEventListener('scroll', () => {
    if (!heroContent) return;
    const sy = window.scrollY;
    heroContent.style.transform = `translateY(${sy * 0.2}px)`;
    heroContent.style.opacity = Math.max(0, 1 - sy / 550);
}, { passive: true });

// ==============================
// 3D CARD TILT
// ==============================
document.querySelectorAll('.glass-card, .stat-card, .team-card, .crop-card, .vc-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-7px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ==============================
// FLOW NODE INTERACTIVE GLOW
// ==============================
document.querySelectorAll('.flow-node').forEach(node => {
    node.addEventListener('mouseenter', () => {
        node.style.boxShadow = '0 0 20px rgba(52,255,107,0.3)';
    });
    node.addEventListener('mouseleave', () => {
        node.style.boxShadow = '';
    });
});

// ==============================
// CURSOR GLOW (Desktop only)
// ==============================
if (window.innerWidth > 1000) {
    const glow = document.createElement('div');
    Object.assign(glow.style, {
        position: 'fixed', pointerEvents: 'none', zIndex: '9998',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(52,255,107,0.05) 0%, transparent 70%)',
        transform: 'translate(-50%, -50%)',
        transition: 'opacity 0.4s', opacity: '0',
    });
    document.body.appendChild(glow);
    let mx = 0, my = 0, gx = 0, gy = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; glow.style.opacity = '1'; });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    (function animG() {
        gx += (mx - gx) * 0.07;
        gy += (my - gy) * 0.07;
        glow.style.left = gx + 'px';
        glow.style.top = gy + 'px';
        requestAnimationFrame(animG);
    })();
}

// ==============================
// HERO ENTRANCE
// ==============================
window.addEventListener('load', () => {
    document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
        setTimeout(() => el.classList.add('revealed'), 350 + i * 200);
    });
});

// ==============================
// STAT CARD TOP GLOW TRACK
// ==============================
document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        card.style.setProperty('--mx', x + '%');
    });
});
