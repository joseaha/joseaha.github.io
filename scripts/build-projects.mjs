#!/usr/bin/env node
// Genera projects/<slug>/index.html (es) y en.html (en) a partir de projects/_source/*.md
// Sin dependencias. Ejecutar manualmente antes de comitear: node scripts/build-projects.mjs

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(ROOT, 'projects', '_source');
const TEMPLATE_PATH = path.join(ROOT, 'projects', '_template.html');
const OUT_DIR = path.join(ROOT, 'projects');

const es = JSON.parse(readFileSync(path.join(ROOT, 'i18n', 'es.json'), 'utf8'));
const en = JSON.parse(readFileSync(path.join(ROOT, 'i18n', 'en.json'), 'utf8'));
const template = readFileSync(TEMPLATE_PATH, 'utf8');

function parseFrontMatter(raw) {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) throw new Error('Front-matter no encontrado');
    const data = {};
    for (const line of match[1].split(/\r?\n/)) {
        if (!line.trim()) continue;
        const idx = line.indexOf(':');
        if (idx === -1) continue;
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        data[key] = value;
    }
    return { data, body: match[2].trim() };
}

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inlineMd(s) {
    let out = escapeHtml(s);
    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
    return out;
}

function mdToHtml(body) {
    const lines = body.split(/\r?\n/);
    let html = '';
    let listOpen = false;
    let paragraph = [];

    function flushParagraph() {
        if (paragraph.length) {
            html += '<p>' + inlineMd(paragraph.join(' ')) + '</p>\n';
            paragraph = [];
        }
    }
    function closeList() {
        if (listOpen) { html += '</ul>\n'; listOpen = false; }
    }

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (line.startsWith('## ')) {
            flushParagraph();
            closeList();
            html += '<h2>' + escapeHtml(line.slice(3).trim()) + '</h2>\n';
        } else if (line.startsWith('- ')) {
            flushParagraph();
            if (!listOpen) { html += '<ul>\n'; listOpen = true; }
            html += '<li>' + inlineMd(line.slice(2).trim()) + '</li>\n';
        } else if (line === '') {
            flushParagraph();
            closeList();
        } else {
            paragraph.push(line);
        }
    }
    flushParagraph();
    closeList();
    return html;
}

function tagsListHtml(csv) {
    if (!csv) return '';
    return csv.split(',').map((t) => '<span>' + escapeHtml(t.trim()) + '</span>').join('');
}

function repoLinkHtml(data, dict) {
    const label = escapeHtml(data.repoLabel || '');
    if (data.repo) {
        return '<a class="detail_link" href="' + escapeHtml(data.repo) + '" target="_blank" rel="noopener">' + label + '</a>';
    }
    return '<span class="project_private"><i class="fa-solid fa-lock"></i> ' + label + '</span>';
}

function demoLinkHtml(data, dict) {
    if (!data.demo) return '';
    return '<a class="detail_link" href="' + escapeHtml(data.demo) + '" target="_blank" rel="noopener">' + escapeHtml(dict['projectDetail.demo']) + '</a>';
}

function render(slug, data, body, lang) {
    const dict = lang === 'en' ? en : es;
    const sections = mdToHtml(body);
    const replacements = {
        '{{lang}}': lang,
        '{{slug}}': slug,
        '{{title}}': escapeHtml(data.title || slug),
        '{{subtitle}}': escapeHtml(data.subtitle || ''),
        '{{role}}': escapeHtml(data.role || ''),
        '{{date}}': escapeHtml(data.date || ''),
        '{{stackLine}}': escapeHtml((data.stack || '').split(',').map((s) => s.trim()).join(' · ')),
        '{{tagsList}}': tagsListHtml(data.tags),
        '{{repoLinkHtml}}': repoLinkHtml(data, dict),
        '{{demoLinkHtml}}': demoLinkHtml(data, dict),
        '{{cover}}': data.cover || '',
        '{{sections}}': sections,
        '{{esCurrent}}': String(lang === 'es'),
        '{{enCurrent}}': String(lang === 'en'),
        '{{navAriaLabel}}': dict['nav.ariaLabel'],
        '{{navAbout}}': dict['nav.about'],
        '{{navSkills}}': dict['nav.skills'],
        '{{navProjects}}': dict['nav.projects'],
        '{{navContact}}': dict['nav.contact'],
        '{{openLabel}}': dict['nav.openLabel'],
        '{{toTopLabel}}': dict['toTop.label'],
        '{{backLink}}': dict['projects.backLink'],
        '{{roleLabel}}': dict['projectDetail.role'],
        '{{dateLabel}}': dict['projectDetail.date'],
        '{{stackLabel}}': dict['projectDetail.stack'],
        '{{footerTagline}}': dict['footer.tagline'],
        '{{footerCopy}}': dict['footer.copy']
    };
    let html = template;
    for (const [key, value] of Object.entries(replacements)) {
        html = html.split(key).join(value);
    }
    return html;
}

function main() {
    const files = readdirSync(SOURCE_DIR).filter((f) => f.endsWith('.md'));
    const bySlug = {};
    for (const file of files) {
        const m = file.match(/^(.+)\.(es|en)\.md$/);
        if (!m) {
            console.warn('Ignorado (nombre no coincide con <slug>.<es|en>.md):', file);
            continue;
        }
        const [, slug, lang] = m;
        bySlug[slug] = bySlug[slug] || {};
        bySlug[slug][lang] = file;
    }

    for (const [slug, langs] of Object.entries(bySlug)) {
        const outDir = path.join(OUT_DIR, slug);
        mkdirSync(outDir, { recursive: true });
        for (const lang of ['es', 'en']) {
            if (!langs[lang]) {
                console.warn('Falta ' + lang + ' para el proyecto "' + slug + '" — se omite ese idioma.');
                continue;
            }
            const raw = readFileSync(path.join(SOURCE_DIR, langs[lang]), 'utf8');
            const { data, body } = parseFrontMatter(raw);
            const html = render(slug, data, body, lang);
            const outFile = path.join(outDir, lang === 'es' ? 'index.html' : 'en.html');
            writeFileSync(outFile, html, 'utf8');
            console.log('Generado:', path.relative(ROOT, outFile));
        }
    }
}

main();
