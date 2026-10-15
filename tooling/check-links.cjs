const { readdirSync, readFileSync, existsSync, statSync } = require('node:fs');
const { join, dirname, resolve, relative } = require('node:path');
const assert = require('node:assert/strict');
const root = resolve(__dirname, '..', 'public');
const origin = 'https://sud0x67.github.io';
const files = readdirSync(root, { recursive: true }).filter(file => /\.(html|css)$/.test(file));
let count = 0;
for (const file of files) {
  const contents = readFileSync(join(root, file), 'utf8');
  const base = new URL('/blog/' + file, origin);
  const values = [...contents.matchAll(/(?:href|src)=["']([^"']+)["']|url\(["']?([^\s)'";]+)["']?\)/g)];
  for (const match of values) {
    const value = match[1] || match[2];
    if (!value || value.startsWith('#') || /^(data|mailto|tel):/.test(value)) continue;
    const url = new URL(value, base);
    if (url.origin !== origin) continue;
    if (url.pathname === '/' || url.pathname === '/blog') continue; // Intentional link to the separate navigation site.
    assert.ok(url.pathname.startsWith('/blog/'), `${file}: link escapes the blog subpath: ${value}`);
    const target = join(root, decodeURIComponent(url.pathname.slice('/blog/'.length)));
    const candidate = existsSync(target) && statSync(target).isDirectory() ? join(target, 'index.html') : target;
    assert.ok(existsSync(candidate), `${file}: missing local link ${value} (${relative(root, candidate)})`);
    count++;
  }
}
const posts = readdirSync(join(__dirname, '..', 'source', '_posts')).filter(file => file.endsWith('.md'));
assert.ok(posts.length >= 4, 'The four original posts must be restored');
console.log(`Validated ${files.length} HTML/CSS files and ${count} internal links under /blog/. Restored posts: ${posts.length}.`);
