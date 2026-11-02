import { site } from "../../data/site.mjs";
import { hosts } from "../../data/hosts.mjs";
import {
  esc, abs, icon, monogram, scoreRing, affButton, scoreBars, proscons,
  disclosureBar, priceNote, fmtPrice, fmtScore, reviewLink, breadcrumbs, layout,
} from "../lib.mjs";

const factLabels = [
  ["panel", "Контролен панел", "layers"],
  ["datacenters", "Център за данни", "globe"],
  ["ssl", "SSL", "shield"],
  ["backups", "Архиви", "clock"],
  ["domain", "Домейн", "globe"],
  ["email", "Имейл", "mail"],
  ["support", "Поддръжка", "chat"],
  ["refund", "Гаранция", "coin"],
  ["contract", "Договор", "book"],
];

export function reviewPage(h) {
  const path = `/hosting/${h.slug}/`;
  const title = `${h.name}: ревю, цени, плюсове и минуси (${new Date(site.updated).getFullYear()})`;
  const crumbs = breadcrumbs([
    { href: "/", label: "Начало" },
    { href: "/#klasaciya", label: "Класация" },
    { href: path, label: h.name },
  ]);
  const alts = hosts.filter((x) => x.slug !== h.slug).slice(0, 3);
  const toc = [
    ...h.review.map((s, i) => ({ id: `s${i}`, label: s.h })),
    { id: "plyusove", label: "Плюсове и минуси" },
    { id: "parametri", label: "Всички параметри" },
    { id: "zaklyuchenie", label: "Заключение" },
  ];

  const ldReview = {
    "@context": "https://schema.org",
    "@type": "Review",
    name: title,
    datePublished: site.updated,
    author: { "@type": "Organization", name: site.author },
    publisher: { "@type": "Organization", name: site.name },
    itemReviewed: {
      "@type": "Product",
      name: `${h.name} хостинг`,
      brand: { "@type": "Brand", name: h.name },
      url: h.homepage,
    },
    reviewRating: { "@type": "Rating", ratingValue: h.score, bestRating: 10, worstRating: 1 },
    reviewBody: h.verdict,
  };

  const body = `
<section class="rv-hero" style="--h:${h.hue}">
  <div class="hero-bg" aria-hidden="true"><div class="grid-bg"></div><div class="glow g1"></div></div>
  <div class="wrap">
    ${crumbs.html}
    <div class="rv-head">
      ${monogram(h, "mono-xl")}
      <div class="rv-title">
        <span class="badge">#${h.rank} · ${esc(h.badge)}</span>
        <h1>Ревю на ${esc(h.name)}</h1>
        <p class="lead">${esc(h.summary)}</p>
        <p class="rv-meta">${icon("clock")} Последна проверка: ${esc(site.updatedLabel)} · ${esc(site.author)}</p>
      </div>
      <div class="rv-score">
        ${scoreRing(h.score, 104)}
        <span>Обща оценка</span>
      </div>
    </div>
  </div>
</section>

<div class="wrap">${disclosureBar()}</div>

<div class="wrap rv-layout">
  <article class="prose rv-main">
    <div class="verdict-box" data-reveal>
      <h2 class="h-sm">Накратко</h2>
      <p>${esc(h.verdict)}</p>
      <p class="for"><b>Подходящ за:</b> ${esc(h.bestFor)}</p>
    </div>

    <nav class="toc" aria-label="Съдържание"><h2 class="h-sm">Съдържание</h2><ol>${toc
      .map((t) => `<li><a href="#${t.id}">${esc(t.label)}</a></li>`)
      .join("")}</ol></nav>

    <h2 class="h-sm">Оценки по критерии</h2>
    ${scoreBars(h)}

    ${h.review.map((s, i) => `<section id="s${i}"><h2>${esc(s.h)}</h2>${s.p.map((p) => `<p>${esc(p)}</p>`).join("")}</section>`).join("")}

    <section class="callout" data-reveal>
      ${icon("coin")}
      <div><h3>Цена</h3><p>От <b>~${fmtPrice(h.priceFrom)}/мес.</b> (${esc(h.priceNote)}). ${esc(h.renewalNote)}</p></div>
    </section>

    <section id="plyusove"><h2>Плюсове и минуси</h2>${proscons(h)}</section>

    <section id="parametri"><h2>Всички параметри</h2>
      <dl class="facts">${factLabels
        .map(([k, l, ic]) => `<div>${icon(ic)}<dt>${l}</dt><dd>${esc(h.facts[k])}</dd></div>`)
        .join("")}
        <div>${icon("chat")}<dt>На български</dt><dd>${h.facts.bgSupport ? "Да" : "Не"}</dd></div>
      </dl>
    </section>

    <section id="zaklyuchenie" class="final" data-reveal>
      <h2>Заключение</h2>
      <p>${esc(h.verdict)}</p>
      <div class="final-row">${scoreRing(h.score, 64)}${affButton(h, `Виж офертата на ${h.name}`, "btn btn-primary btn-lg")}</div>
    </section>

    ${priceNote()}
  </article>

  <aside class="rv-side">
    <div class="side-card" style="--h:${h.hue}">
      <div class="side-top">${monogram(h)}<div><b>${esc(h.name)}</b><small>${esc(h.badge)}</small></div></div>
      <div class="price"><span class="price-from">от</span> <strong>~${fmtPrice(h.priceFrom)}</strong><span class="price-per">/мес.</span><small>${esc(h.priceNote)}</small></div>
      <ul class="side-list">${h.pros.slice(0, 3).map((p) => `<li>${icon("check")}${esc(p)}</li>`).join("")}</ul>
      ${affButton(h, "Към офертата", "btn btn-primary btn-block")}
      <p class="fine">Партньорски линк. Не плащаш повече.</p>
    </div>
  </aside>
</div>

<section class="sec sec-alt">
  <div class="wrap">
    <header class="sec-head"><p class="kicker">Алтернативи</p><h2>Сравни с други доставчици</h2></header>
    <div class="alts">${alts
      .map(
        (a) => `<a class="alt" href="${reviewLink(a)}" style="--h:${a.hue}" data-reveal>
          <div class="alt-top">${monogram(a)}<div><b>${esc(a.name)}</b><small>${esc(a.badge)}</small></div><span class="alt-sc">${fmtScore(a.score)}</span></div>
          <p>${esc(a.bestFor)}</p><span class="alt-go">Ревю ${icon("arrow")}</span></a>`
      )
      .join("")}</div>
  </div>
</section>

<div class="mobile-cta" data-mobile-cta>
  <div>${monogram(h, "mono-sm")}<span><b>${esc(h.name)}</b><small>от ~${fmtPrice(h.priceFrom)}/мес.</small></span></div>
  ${affButton(h, "Оферта", "btn btn-primary btn-sm")}
</div>
`;

  return layout({
    title,
    description: `Ревю на ${h.name}: оценка ${fmtScore(h.score)}/10, цени от ~${fmtPrice(h.priceFrom)}/мес., плюсове, минуси и за кого е подходящ. ${h.bestFor}.`,
    path,
    body,
    ld: [ldReview, crumbs.ld],
    ogType: "article",
  });
}
