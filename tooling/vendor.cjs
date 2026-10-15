const { cpSync, mkdirSync } = require('node:fs');
const { join } = require('node:path');
const source = join(__dirname, '..', 'node_modules', 'font-awesome');
const target = join(__dirname, '..', 'source', 'vendor', 'font-awesome');
mkdirSync(target, { recursive: true });
for (const folder of ['css', 'fonts']) cpSync(join(source, folder), join(target, folder), { recursive: true });
cpSync(join(source, 'README.md'), join(target, 'LICENSE-AND-ATTRIBUTION.md'));
