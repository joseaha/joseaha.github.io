/* ---- menú de navegación (accesible por teclado) ---- */
const navToggle = document.querySelector('#nav_toggle');
const navList = document.querySelector('#nav_lista');

function setMenu(open) {
    if (!navToggle || !navList) return;
    navList.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    const labelKey = open ? 'nav.closeLabel' : 'nav.openLabel';
    navToggle.setAttribute('aria-label', window.t ? window.t(labelKey) : 'Abrir menú de navegación');
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
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = canvas.getContext('2d');
    const GAP = 34;    // separación de la grilla
    const R = 240;     // radio de influencia del cursor
    const PULL = 12;   // cuánto se acercan los puntos al cursor
    const BASE = 0.12; // alpha base de los puntos
    let w = 0, h = 0, dpr = 1, cols = 0, rows = 0, dots = [];
    let mx = -9999, my = -9999, smx = -9999, smy = -9999;
    let influence = 0, target = 0, raf = null, visible = true;
    let fgRgb = '255,255,255';

    function readFgRgb() {
        const v = getComputedStyle(document.documentElement).getPropertyValue('--fg-rgb').trim();
        if (v) fgRgb = v;
    }
    readFgRgb();
    window.addEventListener('themechange', () => { readFgRgb(); render(performance.now()); });

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
        const alpha = Math.min(a.t, b.t) * 0.6;
        ctx.strokeStyle = 'rgba(' + fgRgb + ',' + alpha.toFixed(3) + ')';
        ctx.beginPath();
        ctx.moveTo(a.dx, a.dy);
        ctx.lineTo(b.dx, b.dy);
        ctx.stroke();
    }

    function render(now) {
        ctx.clearRect(0, 0, w, h);
        // onda ambiental: un brillo diagonal lento que recorre la grilla,
        // para que el hero respire aunque el mouse no se mueva
        const phase = reducedMotion ? 0 : now * 0.00045;
        const active = [];
        for (const d of dots) {
            const vx = smx - d.x, vy = smy - d.y;
            const dist = Math.hypot(vx, vy) || 1;
            const t = dist < R ? (1 - dist / R) * influence : 0;
            d.t = t;
            d.dx = d.x + (vx / dist) * t * PULL;
            d.dy = d.y + (vy / dist) * t * PULL;
            const wave = reducedMotion ? 0 : 0.05 + 0.05 * Math.sin(phase + (d.gx + d.gy) * 0.32);
            ctx.beginPath();
            ctx.fillStyle = 'rgba(' + fgRgb + ',' + Math.min(1, BASE + wave + t * 0.75).toFixed(3) + ')';
            ctx.arc(d.dx, d.dy, 0.9 + wave * 4 + t * 2.8, 0, 6.2832);
            ctx.fill();
            if (t > 0.1) active.push(d);
        }
        ctx.lineWidth = 1;
        for (const d of active) {
            const right = d.gx + 1 < cols ? dots[d.gy * cols + d.gx + 1] : null;
            const down = d.gy + 1 < rows ? dots[(d.gy + 1) * cols + d.gx] : null;
            if (right && right.t > 0.1) link(d, right);
            if (down && down.t > 0.1) link(d, down);
        }
    }

    function loop(now) {
        influence += (target - influence) * 0.08;
        // el cursor dibujado persigue al real con un lerp: movimiento fluido con estela
        smx += (mx - smx) * 0.14;
        smy += (my - smy) * 0.14;
        render(now);
        if (visible && (!reducedMotion || influence > 0.01 || target > 0)) {
            raf = requestAnimationFrame(loop);
        } else {
            raf = null;
        }
    }

    function start() {
        if (!raf && visible) raf = requestAnimationFrame(loop);
    }

    host.addEventListener('pointermove', (e) => {
        const r = host.getBoundingClientRect();
        mx = e.clientX - r.left;
        my = e.clientY - r.top;
        if (smx < -999) { smx = mx; smy = my; }
        target = 1;
        start();
    });
    host.addEventListener('pointerleave', () => { target = 0; start(); });
    // en táctil: un toque produce un pulso que luego decae
    host.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse') return;
        const r = host.getBoundingClientRect();
        mx = e.clientX - r.left;
        my = e.clientY - r.top;
        smx = mx; smy = my;
        target = 1;
        start();
        setTimeout(() => { target = 0; }, 900);
    });

    if ('ResizeObserver' in window) {
        let rt;
        new ResizeObserver(() => {
            clearTimeout(rt);
            rt = setTimeout(() => { build(); render(performance.now()); }, 100);
        }).observe(host);
    } else {
        let rt;
        window.addEventListener('resize', () => {
            clearTimeout(rt);
            rt = setTimeout(() => { build(); render(performance.now()); }, 150);
        });
    }

    if ('IntersectionObserver' in window) {
        new IntersectionObserver((ents) => {
            visible = ents[0].isIntersecting;
            if (visible) start();
            else if (raf) { cancelAnimationFrame(raf); raf = null; }
        }, { threshold: 0 }).observe(host);
    }

    build();
    render(performance.now());
    if (!reducedMotion) start();
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => { build(); render(performance.now()); });
    }
})();
