/* ---- theme toggle (claro/oscuro), persistente ---- */
(function () {
    const btn = document.querySelector('#theme_toggle');
    if (!btn) return;

    const icon = btn.querySelector('i');

    function apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        btn.setAttribute('aria-pressed', String(theme === 'light'));
        var labelKey = theme === 'light' ? 'theme.toggle.toDark' : 'theme.toggle.toLight';
        btn.setAttribute('aria-label', window.t ? window.t(labelKey) : 'Cambiar tema');
        if (icon) icon.className = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }

    apply(document.documentElement.getAttribute('data-theme') || 'dark');

    window.addEventListener('i18nready', () => {
        apply(document.documentElement.getAttribute('data-theme') || 'dark');
    });

    btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        const next = current === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', next);
        apply(next);
    });
})();
