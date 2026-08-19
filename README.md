# joseaha.github.io

Portafolio personal — sitio 100% estático, sin frameworks ni dependencias, desplegado en GitHub Pages.

## Estructura

```
├── index.html              Página principal (SPA de una sola página)
├── CSS/
│   ├── reset.css           Reset base
│   ├── index.css           Design system completo (tokens en :root) + estilos del index
│   └── project.css         Estilos de las páginas de detalle de proyecto
├── JS/
│   ├── index.js            Nav, back-to-top, canvas del hero
│   ├── i18n.js             Cambio de idioma ES/EN
│   └── theme.js            Tema claro/oscuro (localStorage + prefers-color-scheme)
├── i18n/
│   ├── es.json             Textos en español
│   └── en.json             Textos en inglés
├── IMG/                    Imágenes (nombres en kebab-case, sin espacios)
├── certs/                  Certificaciones en PDF (nombre-institución-año.pdf)
├── projects/
│   ├── _template.html      Plantilla con {{placeholders}} para páginas de detalle
│   ├── _source/            Fuente de cada proyecto: <slug>.<es|en>.md (front-matter + markdown)
│   └── <slug>/             Salida generada: index.html (es) + en.html (en) — NO editar a mano
├── scripts/
│   └── build-projects.mjs  Generador de páginas de proyecto (Node, sin dependencias)
└── .github/workflows/
    └── static.yml          Deploy a GitHub Pages en cada push a main
```

## Convenciones

- **Archivos**: kebab-case, sin espacios ni paréntesis (`portfolio-dev-cover.png`, no `mobile (6).png`).
- **Imágenes de portada**: `IMG/<slug>-cover.<png|svg>`, referenciadas desde el front-matter (`cover:`) del `.md`.
- **Colores/tipografía**: solo tokens de `CSS/index.css` (`:root` y `[data-theme="light"]`). Paleta monocroma, sin acentos de color.
- **Nuevo proyecto**: crear `projects/_source/<slug>.es.md` y `<slug>.en.md`, añadir la portada en `IMG/`, y ejecutar el build.

## Build

Solo hace falta al añadir o editar proyectos (el resto del sitio no se compila):

```bash
node scripts/build-projects.mjs
```

## Desarrollo local

```bash
python -m http.server 8000
# → http://localhost:8000
```

## Deploy

Push a `main` → GitHub Actions publica todo el repositorio en https://joseaha.github.io (sin Jekyll, artefacto estático).
