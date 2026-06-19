// Compile the app's Tailwind v4 CSS into a static stylesheet for design-sync
// previews. Run from the repo root so bare imports resolve against the repo's
// node_modules (postcss + @tailwindcss/postcss):
//   node .design-sync/compile-css.mjs
// Output (.design-sync/compiled.css) is gitignored and wired via cfg.cssEntry.
// RE-RUN THIS before every package-build / driver run — especially after
// editing .design-sync/previews/* (new utility classes must be compiled in).
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const input = resolve('.design-sync/tw-entry.css');
const out = resolve('.design-sync/compiled.css');
const css = readFileSync(input, 'utf8');
const result = await postcss([tailwind()]).process(css, { from: input, to: out });
writeFileSync(out, result.css);
console.error(`compiled.css: ${(result.css.length / 1024).toFixed(0)} KB`);
