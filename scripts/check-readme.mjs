// Fails if any project line ("Name: description") is longer than the rc-keyboard-visualiser line.
// Run: node scripts/check-readme.mjs
import fs from 'node:fs';

const MAX = 88;
const readme = fs.readFileSync(new URL('../README.md', import.meta.url), 'utf8');
const lines = [...readme.matchAll(/\[([^\]]+)\]\([^)]+\): (.*)/g)].map(([, name, desc]) => `${name}: ${desc}`);
const over = lines.filter((l) => l.length > MAX);
for (const l of over) console.error(`${l.length} > ${MAX}: ${l}`);
process.exit(over.length ? 1 : 0);
