// Builds assets/icons/*.svg from Hugeicons Pro duotone-rounded, one jewel tone per project.
// Needs a Hugeicons Pro token for npm.hugeicons.com in ~/.npmrc. Run: npm install && npm run build
import fs from 'node:fs';
import * as pack from '@hugeicons-pro/core-duotone-rounded';

const here = new URL('./', import.meta.url);
const out = new URL('../../assets/icons/', import.meta.url);
const { palette, icons } = JSON.parse(fs.readFileSync(new URL('icons.json', here)));

const kebab = (k) => k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
const toSvg = (nodes) =>
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">' +
  nodes
    .map(([tag, attrs]) => {
      const a = Object.entries(attrs)
        .filter(([k]) => k !== 'key')
        .map(([k, v]) => `${kebab(k)}="${v}"`)
        .join(' ');
      return `<${tag} ${a}/>`;
    })
    .join('') +
  '</svg>\n';

const swatches = [];
for (const [slug, { icon, custom, color }] of Object.entries(icons)) {
  const hex = palette[color];
  if (!hex) throw new Error(`${slug}: unknown colour "${color}"`);
  let svg;
  if (custom) {
    svg = fs.readFileSync(new URL(`custom/${custom}`, here), 'utf8');
  } else {
    const nodes = pack[`${icon}DuotoneRounded`];
    if (!nodes) throw new Error(`${slug}: no Hugeicons icon "${icon}"`);
    svg = toSvg(nodes);
  }
  fs.writeFileSync(new URL(`${slug}.svg`, out), svg.replaceAll('currentColor', hex));
  swatches.push(`${slug} ${color} ${hex}`);
}
console.log(swatches.join('\n'));
