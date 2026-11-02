// Copies the Bricolage Grotesque woff2 files next to the built CSS so the wireframes open offline.
import { copyFileSync, mkdirSync, realpathSync } from "node:fs";
import { join } from "node:path";
const src = join(realpathSync("node_modules/@fontsource-variable/bricolage-grotesque"), "files");
mkdirSync("dist/fonts", { recursive: true });
for (const f of ["bricolage-grotesque-latin-standard-normal.woff2", "bricolage-grotesque-latin-ext-standard-normal.woff2"]) {
  copyFileSync(join(src, f), join("dist/fonts", f));
}
console.log("fonts copied");
