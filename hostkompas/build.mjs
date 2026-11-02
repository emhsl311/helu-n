// Сглобява сайта в папка dist/.  Стартиране:  node build.mjs
// Няма външни зависимости, нужен е само Node.js 18+.
import { rm, mkdir, writeFile, cp } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { site } from "./data/site.mjs";
import { hosts } from "./data/hosts.mjs";
import { abs } from "./src/lib.mjs";
import { homePage } from "./src/pages/home.mjs";
import { reviewPage } from "./src/pages/review.mjs";
import { guideChoose, guideTypes, aboutPage, privacyPage, notFoundPage, goPage } from "./src/pages/content.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, "dist");

const pages = []; // [път, html, вСитемап]
const add = (path, html, inSitemap = true) => pages.push([path, html, inSitemap]);

add("/", homePage());
for (const h of hosts) add(`/hosting/${h.slug}/`, reviewPage(h));
add("/rakovodstvo/kak-da-izberem-hosting/", guideChoose());
add("/rakovodstvo/vidove-hosting/", guideTypes());
add("/za-nas/", aboutPage());
add("/poveritelnost/", privacyPage());
add("/404.html", notFoundPage(), false);
for (const h of hosts) add(`/go/${h.slug}/`, goPage(h), false);

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(join(root, "public"), out, { recursive: true });

for (const [path, html] of pages) {
  const file = path.endsWith(".html") ? join(out, path) : join(out, path, "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .filter((p) => p[2])
  .map(([path]) => `  <url><loc>${abs(path)}</loc><lastmod>${site.updated}</lastmod></url>`)
  .join("\n")}
</urlset>
`;
await writeFile(join(out, "sitemap.xml"), sitemap);
await writeFile(
  join(out, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: ${site.base}/go/\n\nSitemap: ${abs("/sitemap.xml")}\n`
);

const missing = hosts.filter((h) => !h.affiliateUrl).map((h) => h.name);
console.log(`✓ ${pages.length} страници → dist/`);
if (missing.length)
  console.log(`! Без партньорски линк (водят към официалния сайт): ${missing.join(", ")}\n  Добави ги в data/hosts.mjs → affiliateUrl`);
