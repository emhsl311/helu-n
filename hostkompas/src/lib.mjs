import { site, nav } from "../data/site.mjs";
import { criteria, priceDisclaimer, hosts } from "../data/hosts.mjs";

// ---------- помощни функции ----------
export const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Път спрямо base (за подпапки като GitHub Pages) */
export const u = (path) => `${site.base}${path}`;
/** Пълен абсолютен URL */
export const abs = (path) => `${site.url}${site.base}${path}`;

export const fmtPrice = (n) =>
  `${Number(n).toFixed(2).replace(".", ",")} ${site.currency}`;
export const fmtScore = (n) => Number(n).toFixed(1).replace(".", ",");

export const goLink = (host) => u(`/go/${host.slug}/`);
export const reviewLink = (host) => u(`/hosting/${host.slug}/`);

const icons = {
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  ext: '<path d="M14 4h6v6M10 14 20 4M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3z"/><path d="m9 12 2 2 4-4"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .9-3 2s1.3 1.7 3 2 3 .9 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6v2M12 16v2"/>',
  server: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01M11 7.5h6M11 16.5h6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/>',
  cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6"/>',
  pen: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>',
  rocket: '<path d="M5 15c-1.5 1.3-2 4-2 6 2 0 4.7-.5 6-2M14 4c3-1 6-1 6-1s0 3-1 6l-6 6-5-5 6-6z"/><circle cx="15" cy="9" r="1.5"/>',
  wp: '<circle cx="12" cy="12" r="9"/><path d="M5 8l4 11 3-8 3 8 4-11M4 8h4M16 8h4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
};
export const icon = (name, cls = "i") =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || ""}</svg>`;

// ---------- компоненти ----------
export const monogram = (h, size = "") =>
  `<span class="mono ${size}" style="--h:${h.hue}" aria-hidden="true">${esc(h.monogram)}</span>`;

export const scoreRing = (score, size = 64) => {
  const r = 26;
  const c = 2 * Math.PI * r;
  const off = c * (1 - score / 10);
  return `<div class="ring" style="--size:${size}px" role="img" aria-label="Оценка ${fmtScore(score)} от 10">
    <svg viewBox="0 0 64 64"><circle class="ring-bg" cx="32" cy="32" r="${r}"/><circle class="ring-fg" cx="32" cy="32" r="${r}" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${off.toFixed(2)}"/></svg>
    <span>${fmtScore(score)}</span></div>`;
};

export const affButton = (h, label = "Към офертата", cls = "btn btn-primary") =>
  `<a class="${cls}" href="${goLink(h)}" target="_blank" rel="sponsored nofollow noopener" data-track="${h.slug}">${esc(label)} ${icon("ext")}</a>`;

export const scoreBars = (h) =>
  `<ul class="bars">${criteria
    .map(
      (c) =>
        `<li><span class="bars-l">${esc(c.label)}</span><span class="bars-t"><span style="--w:${h.scores[c.key] * 10}%"></span></span><b>${fmtScore(h.scores[c.key])}</b></li>`
    )
    .join("")}</ul>`;

export const proscons = (h) => `
  <div class="pc">
    <div class="pc-col pc-pro"><h4>Предимства</h4><ul>${h.pros.map((p) => `<li>${icon("check")}<span>${esc(p)}</span></li>`).join("")}</ul></div>
    <div class="pc-col pc-con"><h4>Недостатъци</h4><ul>${h.cons.map((p) => `<li>${icon("x")}<span>${esc(p)}</span></li>`).join("")}</ul></div>
  </div>`;

export const disclosureBar = () => `
  <div class="disclosure" role="note">${icon("info")}
    <p><strong>Прозрачност:</strong> Някои линкове в сайта са партньорски. Ако поръчаш през тях, може да получим комисионна, без допълнителен разход за теб. Това не влияе на оценките. <a href="${u("/za-nas/#prozrachnost")}">Научи повече</a>.</p>
  </div>`;

export const priceNote = () => `<p class="fine">${esc(priceDisclaimer)} Последна проверка: ${esc(site.updatedLabel)}.</p>`;

export const breadcrumbs = (items) => {
  const html = `<nav class="crumbs" aria-label="Навигационна пътека"><ol>${items
    .map((it, i) =>
      i === items.length - 1
        ? `<li aria-current="page">${esc(it.label)}</li>`
        : `<li><a href="${u(it.href)}">${esc(it.label)}</a></li>`
    )
    .join("")}</ol></nav>`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      item: abs(it.href),
    })),
  };
  return { html, ld };
};

// ---------- layout ----------
const header = (current) => `
<a class="skip" href="#main">Към съдържанието</a>
<header class="hdr" data-hdr>
  <div class="wrap hdr-in">
    <a class="logo" href="${u("/")}" aria-label="${esc(site.name)}, начало">
      <svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--a1)"/><stop offset="1" stop-color="var(--a2)"/></linearGradient></defs><circle cx="16" cy="16" r="14" fill="none" stroke="url(#lg)" stroke-width="2.5"/><path d="M16 6l3.2 10L16 26l-3.2-10z" fill="url(#lg)"/><circle cx="16" cy="16" r="2" fill="var(--bg)"/></svg>
      <span>${esc(site.name)}</span>
    </a>
    <nav class="nav" id="nav" aria-label="Основна навигация">
      <ul>${nav
        .map((n) => `<li><a href="${u(n.href)}"${current === n.href ? ' aria-current="page"' : ""}>${esc(n.label)}</a></li>`)
        .join("")}</ul>
    </nav>
    <div class="hdr-act">
      <button class="icon-btn" type="button" data-theme-toggle aria-label="Смени светла/тъмна тема">${icon("sun", "i i-sun")}${icon("moon", "i i-moon")}</button>
      <a class="btn btn-primary btn-sm hide-sm" href="${u("/#izbor")}">Намери хостинг</a>
      <button class="icon-btn menu-btn" type="button" data-menu aria-controls="nav" aria-expanded="false" aria-label="Меню">${icon("menu")}</button>
    </div>
  </div>
</header>`;

const footer = () => `
<footer class="ftr">
  <div class="wrap">
    <div class="ftr-grid">
      <div class="ftr-brand">
        <a class="logo" href="${u("/")}"><svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="none" stroke="url(#lg)" stroke-width="2.5"/><path d="M16 6l3.2 10L16 26l-3.2-10z" fill="url(#lg)"/></svg><span>${esc(site.name)}</span></a>
        <p>${esc(site.tagline)}. Помагаме ти да избереш хостинг, без маркетингов шум.</p>
      </div>
      <div><h3>Ревюта</h3><ul>${hosts.map((h) => `<li><a href="${reviewLink(h)}">${esc(h.name)}</a></li>`).join("")}</ul></div>
      <div><h3>Ръководства</h3><ul>
        <li><a href="${u("/rakovodstvo/kak-da-izberem-hosting/")}">Как да изберем хостинг</a></li>
        <li><a href="${u("/rakovodstvo/vidove-hosting/")}">Споделен, VPS или облачен?</a></li>
      </ul></div>
      <div><h3>Информация</h3><ul>
        <li><a href="${u("/za-nas/")}">За нас и методика</a></li>
        <li><a href="${u("/za-nas/#prozrachnost")}">Партньорски линкове</a></li>
        <li><a href="${u("/poveritelnost/")}">Поверителност</a></li>
        <li><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li>
      </ul></div>
    </div>
    <div class="ftr-bot">
      <p>© ${new Date(site.updated).getFullYear()} ${esc(site.name)}. Имената и марките принадлежат на съответните им собственици.</p>
      <p>Някои линкове са партньорски. <a href="${u("/za-nas/#prozrachnost")}">Как печелим</a></p>
    </div>
  </div>
</footer>`;

export function layout({ title, description, path, body, ld = [], current = "", ogType = "website", noindex = false }) {
  const fullTitle = path === "/" ? `${site.name}: ${site.tagline}` : `${title} | ${site.name}`;
  const ldAll = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: site.name,
      url: abs("/"),
      logo: abs("/assets/img/favicon.svg"),
      email: site.email,
    },
    ...ld,
  ];
  return `<!doctype html>
<html lang="bg" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${abs(path)}">`}
<meta name="theme-color" content="#070b14">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:locale" content="${site.locale}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${abs(path)}">
<meta property="og:image" content="${abs("/assets/img/og.png")}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${u("/assets/img/favicon.svg")}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap&subset=cyrillic" rel="stylesheet">
<link rel="stylesheet" href="${u("/assets/css/styles.css")}">
<script>document.documentElement.classList.add("js");try{var t=localStorage.getItem("hk-theme");if(!t)t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.dataset.theme=t}catch(e){}</script>
${ldAll.map((x) => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join("\n")}
</head>
<body>
${header(current)}
<main id="main">
${body}
</main>
${footer()}
<script src="${u("/assets/js/main.js")}" defer></script>
</body>
</html>
`;
}
