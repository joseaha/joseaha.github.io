/* ---- i18n es/en: diccionarios + aplicación ---- */
(function () {
    var FALLBACKS = {
        'nav.openLabel': 'Abrir menú de navegación',
        'nav.closeLabel': 'Cerrar menú de navegación',
        'theme.toggle.toLight': 'Cambiar a tema claro',
        'theme.toggle.toDark': 'Cambiar a tema oscuro'
    };

    window.__i18nDict = null;

    window.t = function (key) {
        if (window.__i18nDict && window.__i18nDict[key] != null) return window.__i18nDict[key];
        return FALLBACKS[key] || key;
    };

    function detectLang() {
        var stored = localStorage.getItem('lang');
        if (stored === 'es' || stored === 'en') return stored;
        return navigator.language && navigator.language.toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
    }

    function applyDict(dict) {
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (dict[key] != null) el.innerHTML = dict[key];
        });
        document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
            el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
                var parts = pair.split(':');
                if (parts.length !== 2) return;
                var attr = parts[0].trim(), key = parts[1].trim();
                if (dict[key] != null) el.setAttribute(attr, dict[key]);
            });
        });
    }

    function updateLangButtons(lang) {
        var esBtn = document.querySelector('#lang_es');
        var enBtn = document.querySelector('#lang_en');
        if (esBtn) esBtn.setAttribute('aria-current', String(lang === 'es'));
        if (enBtn) enBtn.setAttribute('aria-current', String(lang === 'en'));
    }

    function updateProjectLinks(lang) {
        document.querySelectorAll('[data-i18n-project-link]').forEach(function (el) {
            el.setAttribute('href', 'projects/' + el.getAttribute('data-i18n-project-link') + '/' + (lang === 'en' ? 'en.html' : 'index.html'));
        });
    }

    function setLang(lang, redirect) {
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;
        fetch('/i18n/' + lang + '.json')
            .then(function (r) { return r.json(); })
            .then(function (dict) {
                window.__i18nDict = dict;
                applyDict(dict);
                updateLangButtons(lang);
                updateProjectLinks(lang);
                if (dict['meta.title']) document.title = dict['meta.title'];
                window.dispatchEvent(new CustomEvent('i18nready', { detail: { lang: lang } }));
                if (redirect && document.body.hasAttribute('data-project-page')) {
                    var target = lang === 'en' ? 'en.html' : 'index.html';
                    if (!location.pathname.endsWith(target)) location.href = target;
                }
            })
            .catch(function () { /* si falla el fetch, se mantiene el texto ya presente en el HTML */ });
    }

    document.addEventListener('DOMContentLoaded', function () {
        var lang = detectLang();
        setLang(lang, false);

        var esBtn = document.querySelector('#lang_es');
        var enBtn = document.querySelector('#lang_en');
        if (esBtn) esBtn.addEventListener('click', function () { setLang('es', true); });
        if (enBtn) enBtn.addEventListener('click', function () { setLang('en', true); });
    });
})();
