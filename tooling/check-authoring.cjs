const { mkdtempSync, cpSync, symlinkSync, readFileSync, readdirSync, existsSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join, resolve } = require('node:path');
const { spawnSync } = require('node:child_process');
const assert = require('node:assert/strict');
const base = resolve(__dirname, '..');
const temp = mkdtempSync(join(tmpdir(), 'blog-authoring-'));
function hexo(...args) {
  const result = spawnSync(process.execPath, [join(base, 'node_modules/hexo/bin/hexo'), ...args], { cwd: temp, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
}
try {
  for (const name of ['package.json', '_config.yml', 'source', 'scaffolds', 'themes']) cpSync(join(base, name), join(temp, name), { recursive: true });
  symlinkSync(join(base, 'node_modules'), join(temp, 'node_modules'), 'dir');
  hexo('new', 'post', 'writing-smoke-test');
  const markdown = join(temp, 'source/_posts/writing-smoke-test.md');
  assert.ok(existsSync(markdown), 'hexo new must create an editable Markdown post');
  hexo('generate');
  const generated = readdirSync(join(temp, 'public'), { recursive: true }).find(file => file.endsWith('writing-smoke-test/index.html'));
  assert.ok(generated, 'The new post must produce a dated permalink');
  const archive = readFileSync(join(temp, 'public/archives/index.html'), 'utf8');
  assert.ok(archive.includes('writing-smoke-test'), 'Archive must include the new post automatically');
  assert.ok(readFileSync(join(temp, 'public/index.html'), 'utf8').includes('/blog/'), 'Generated site must retain the Pages subpath');
  console.log('Authoring verified in an isolated temporary copy: new Markdown → post page → archive.');
} finally {
  rmSync(temp, { recursive: true, force: true });
}
