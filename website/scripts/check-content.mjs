// Lists every "[ADD …]", "[VERIFY …]" and <TODO> placeholder in content/,
// so you can see at a glance what still needs writing or verifying.
// Run: npm run check-content
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "content");
const re = /\[(?:ADD|VERIFY|TO VERIFY|PLACEHOLDER)[^\]]*\]|<TODO>([\s\S]*?)<\/TODO>|"src":\s*null/g;
let total = 0;
function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (/\.(mdx?|json)$/.test(f.name)) {
      const lines = fs.readFileSync(p, "utf8").split("\n");
      const hits = [];
      lines.forEach((l, i) => { for (const m of l.matchAll(re)) hits.push(`  ${String(i + 1).padStart(4)}  ${m[1] ? `TODO: ${m[1]}` : m[0] === '"src": null' ? "photo placeholder (no src)" : m[0]}`); });
      if (hits.length) { console.log(`\n${path.relative(root, p)}  (${hits.length})`); console.log(hits.join("\n")); total += hits.length; }
    }
  }
}
walk(root);
console.log(`\n${total} placeholder(s) remaining in content/.`);
