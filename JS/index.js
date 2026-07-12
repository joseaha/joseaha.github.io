/* ---- menú de navegación (accesible por teclado) ---- */
const navToggle = document.querySelector('#nav_toggle');
const navList = document.querySelector('#nav_lista');

function setMenu(open) {
    if (!navToggle || !navList) return;
    navList.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    const icon = navToggle.querySelector('i');
    if (icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
}

if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
        setMenu(!navList.classList.contains('open'));
    });

    // cerrar el menú al elegir una sección
    navList.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setMenu(false));
    });

    // cerrar con Escape y devolver el foco al botón
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navList.classList.contains('open')) {
            setMenu(false);
            navToggle.focus();
        }
    });
}

/* ---- hero typewriter ---- */
(function () {
    const el = document.querySelector('#typewriter');
    if (!el) return;
    const roles = [
        'AI Agent Developer',
        'Sistemas RAG',
        'Full-Stack Developer',
        'Cloud & Linux'
    ];
    let r = 0, c = 0, deleting = false;

    function tick() {
        const word = roles[r];
        el.textContent = word.slice(0, c);
        if (!deleting) {
            if (c < word.length) {
                c++;
                setTimeout(tick, 90);
            } else {
                deleting = true;
                setTimeout(tick, 1600);
            }
        } else {
            if (c > 0) {
                c--;
                setTimeout(tick, 45);
            } else {
                deleting = false;
                r = (r + 1) % roles.length;
                setTimeout(tick, 350);
            }
        }
    }
    tick();
})();

/* ---- back-to-top button ---- */
const toTop = document.querySelector(".to-top");
if (toTop) {
    window.addEventListener("scroll", () => {
        if (window.pageYOffset > 100) {
            toTop.classList.add("active");
        } else {
            toTop.classList.remove("active");
        }
    });
}

/* ---- hero: grilla reactiva al mouse (estilo techno) ---- */
(function () {
    const canvas = document.querySelector('#hero_canvas');
    const host = document.querySelector('#home');
    if (!canvas || !host) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    const GAP = 34;   // separación de la grilla
    const R = 160;    // radio de influencia del cursor
    const PULL = 9;   // cuánto se acercan los puntos al cursor
    let w = 0, h = 0, dpr = 1, cols = 0, rows = 0, dots = [];
    let mx = -9999, my = -9999, influence = 0, target = 0, raf = null, visible = true;

    function build() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        const r = host.getBoundingClientRect();
        w = r.width; h = r.height;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        cols = Math.ceil(w / GAP) + 2;
        rows = Math.ceil(h / GAP) + 2;
        dots = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                dots.push({ x: x * GAP, y: y * GAP, gx: x, gy: y, dx: x * GAP, dy: y * GAP, t: 0 });
            }
        }
    }

    function link(a, b) {
        const alpha = Math.min(a.t, b.t) * 0.55;
        ctx.strokeStyle = 'rgba(255,255,255,' + alpha.toFixed(3) + ')';
        ctx.beginPath();
        ctx.moveTo(a.dx, a.dy);
        ctx.lineTo(b.dx, b.dy);
        ctx.stroke();
    }

    function render() {
        ctx.clearRect(0, 0, w, h);
        const active = [];
        for (const d of dots) {
            const vx = mx - d.x, vy = my - d.y;
            const dist = Math.hypot(vx, vy) || 1;
            const t = dist < R ? (1 - dist / R) * influence : 0;
            d.t = t;
            d.dx = d.x + (vx / dist) * t * PULL;
            d.dy = d.y + (vy / dist) * t * PULL;
            ctx.beginPath();
            ctx.fillStyle = 'rgba(255,255,255,' + (0.09 + t * 0.7).toFixed(3) + ')';
            ctx.arc(d.dx, d.dy, 0.9 + t * 2.6, 0, 6.2832);
            ctx.fill();
            if (t > 0.12) active.push(d);
        }
        ctx.lineWidth = 1;
        for (const d of active) {
            const right = d.gx + 1 < cols ? dots[d.gy * cols + d.gx + 1] : null;
            const down = d.gy + 1 < rows ? dots[(d.gy + 1) * cols + d.gx] : null;
            if (right && right.t > 0.12) link(d, right);
            if (down && down.t > 0.12) link(d, down);
        }
    }

    function loop() {
        influence += (target - influence) * 0.07;
        render();
        if (influence > 0.01 || target > 0) {
            raf = requestAnimationFrame(loop);
        } else {
            influence = 0;
            render();
            raf = null;
        }
    }

    function start() {
        if (!raf && visible) raf = requestAnimationFrame(loop);
    }

    host.addEventListener('mousemove', (e) => {
        const r = host.getBoundingClientRect();
        mx = e.clientX - r.left;
        my = e.clientY - r.top;
        target = 1;
        start();
    });
    host.addEventListener('mouseleave', () => { target = 0; start(); });

    let rt;
    window.addEventListener('resize', () => {
        clearTimeout(rt);
        rt = setTimeout(() => { build(); render(); }, 150);
    });

    if ('IntersectionObserver' in window) {
        new IntersectionObserver((ents) => {
            visible = ents[0].isIntersecting;
            if (visible) start();
            else if (raf) { cancelAnimationFrame(raf); raf = null; }
        }, { threshold: 0 }).observe(host);
    }

    build();
    render();
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => { build(); render(); });
    }
})();
