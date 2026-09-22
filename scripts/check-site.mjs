import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { resolve, join, extname } from 'node:path';

const dist = resolve('dist');
const pages = ['index.html', 'projects/index.html', 'cv/index.html'];
const html = new Map(await Promise.all(pages.map(async file => [file, await readFile(join(dist, file), 'utf8')])));
for (const [file, content] of html) {
  assert.equal((content.match(/<h1\b/g) || []).length, 1, `${file}: expected one main heading`);
  assert(content.includes('https://etoilekim.github.io'), `${file}: missing production metadata`);
  assert(!/John Doe|Jiaxin Peng|example\.com|Lorem ipsum/.test(content), `${file}: template placeholder remains`);
  for (const [, attribute, value] of content.matchAll(/\b(href|src)="([^"]*)"/g)) {
    if (!value.startsWith('/') && !value.startsWith('#')) continue;
    const url = new URL(value, `https://etoilekim.github.io/${file.replace(/index\.html$/, '')}`);
    const pathname = decodeURIComponent(url.pathname);
    const target = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
    const path = join(dist, target);
    await access(path).catch(() => { throw new Error(`${file}: missing ${attribute} target ${value}`); });
    if (url.hash && extname(path) === '.html') {
      const destination = await readFile(path, 'utf8');
      assert(destination.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${file}: missing anchor ${value}`);
    }
  }
}
const pdf = await readFile(join(dist, 'files/CV_Namhoon_Kim.pdf'));
assert.equal(pdf.subarray(0, 5).toString(), '%PDF-', 'CV must be a real PDF');
assert(html.get('cv/index.html').includes('data-pdf-url="/files/CV_Namhoon_Kim.pdf"'), 'CV viewer must load the local PDF');
const assets = await readdir(join(dist, '_astro'));
assert(assets.some(file => file.startsWith('pdf.worker.') && file.endsWith('.mjs')), 'PDF worker must be included in the deployment');
console.log('Verified 3 pages, local assets and anchors, metadata, and bundled CV viewer.');
