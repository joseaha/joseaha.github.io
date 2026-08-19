---
title: Portfolio Dev
subtitle: Sitio personal estático con enfoque brutalista monocromo, tema claro/oscuro e idiomas es/en, sin frameworks.
date: 2024 — hoy
role: Diseño, desarrollo y despliegue (proyecto individual)
stack: HTML, CSS, JavaScript vanilla, GitHub Pages
repo: https://github.com/joseaha/joseaha.github.io
repoLabel: Ver en GitHub
demo: https://joseaha.github.io/
cover: /IMG/portfolio-dev-cover.png
tags: HTML, CSS, JavaScript, GitHub Pages
---

## Problema
Necesitaba una carta de presentación técnica propia: un lugar donde mostrar mi stack real (backend, agentes de IA, cloud) con un diseño que no se sintiera genérico ni "plantilla generada por IA", y que fuera lo suficientemente simple de mantener como para poder actualizarlo yo mismo sin fricción.

## Solución
Un sitio estático de una sola página construido con **HTML, CSS y JavaScript vanilla**, sin build step ni frameworks, desplegado directamente en **GitHub Pages** vía GitHub Actions. El diseño sigue una dirección **brutalista monocroma** (inspiración techno): tipografía como protagonista, sin gradientes ni glow, con animaciones sutiles (grilla reactiva al mouse en el hero, tarjetas de proyecto). Sobre esa base agregué **tema claro/oscuro** persistente y **soporte bilingüe es/en** con diccionarios JSON, más un pequeño generador de páginas de detalle por proyecto a partir de Markdown.

## Stack y arquitectura
- HTML semántico + CSS con variables (custom properties) para theming, sin preprocesadores.
- JavaScript vanilla organizado en módulos por responsabilidad (`theme.js`, `i18n.js`, `index.js`) sin dependencias de runtime.
- Despliegue automático a GitHub Pages mediante GitHub Actions (`static.yml`), sin paso de compilación.
- Generación de páginas de proyecto con un script Node ejecutado manualmente (`scripts/build-projects.mjs`), que convierte Markdown con front-matter a HTML estático.

## Retos
El principal reto fue mantener **cero dependencias de build** mientras agregaba funcionalidad que normalmente se resuelve con un framework (theming, i18n, contenido dinámico por proyecto). Resolverlo sin comprometer el estilo visual —evitando reglas CSS duplicadas al introducir el tema claro— exigió apoyarme por completo en custom properties de CSS en vez de hojas de estilo alternativas.

## Resultados
[PENDIENTE: completar] — aún no tengo métricas de tráfico o feedback de reclutadores para citar aquí; se actualizará conforme el sitio reciba visitas reales.
