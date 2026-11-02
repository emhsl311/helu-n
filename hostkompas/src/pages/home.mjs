import { site } from "../../data/site.mjs";
import { hosts, criteria } from "../../data/hosts.mjs";
import {
  esc, u, abs, icon, monogram, scoreRing, affButton, scoreBars, proscons,
  disclosureBar, priceNote, fmtPrice, fmtScore, reviewLink, layout,
} from "../lib.mjs";

const faqs = [
  {
    q: "Кой е най-добрият хостинг в България?",
    a: "Няма един хостинг, който е най-добър за всички. За повечето начинаещи най-изгодният старт е Hostinger. За WordPress с отлична поддръжка избери SiteGround. Ако искаш поддръжка и фактура на български, гледай SuperHosting.bg. Използвай нашия тест „Кой е за мен?“, за да получиш препоръка за твоя случай.",
  },
  {
    q: "Колко струва хостинг за един сайт?",
    a: "Споделеният хостинг за малък сайт струва около 3 до 10 € на месец при промоционални цени. Внимавай с цената при подновяване: тя често е 2 до 4 пъти по-висока. Облачният хостинг за по-големи проекти започва от около 12 до 15 € на месец.",
  },
  {
    q: "По-добре ли е хостинг със сървър в България?",
    a: "Сървърът в България дава малко по-бързо зареждане за посетители от страната, но разликата спрямо центрове за данни в Европа (Франкфурт, Амстердам) е минимална. По-важни са качеството на сървъра, кешът и използването на CDN.",
  },
  {
    q: "Мога ли да сменя хостинга по-късно?",
    a: "Да. Повечето доставчици предлагат безплатно или евтино прехвърляне на сайта. Домейнът също може да бъде пренасочен или прехвърлен. Затова не се притеснявай, ако първият ти избор не е перфектен.",
  },
  {
    q: "Какво е партньорски линк и плащам ли повече през него?",
    a: "Не плащаш повече. Партньорският линк просто казва на доставчика, че си дошъл от нашия сайт, и той ни плаща малка комисионна. Понякога през такива линкове има и допълнителни отстъпки.",
  },
  {
    q: "Нужен ли ми е WordPress хостинг?",
    a: "„WordPress хостинг“ обикновено е споделен хостинг с допълнителни удобства: инсталация с един клик, кеш и автоматични обновления. Всички доставчици в нашата класация поддържат WordPress без проблем.",
  },
];

const quickPicks = [
  { slug: "hostinger", label: "Най-ниска цена", ic: "coin" },
  { slug: "siteground", label: "Най-добър за WordPress", ic: "wp" },
  { slug: "superhosting", label: "Поддръжка на български", ic: "chat" },
];

const terminal = () => `
<div class="term" aria-hidden="true">
  <div class="term-bar"><i></i><i></i><i></i><span>hostkompas, сравнение</span></div>
  <div class="term-body">
    <p class="t-line" style="--d:0"><span class="t-pr">$</span> hostkompas compare --region bg</p>
    <p class="t-line t-mut" style="--d:1">→ ${hosts.length} доставчика · ${criteria.length} критерия · цени в €</p>
    ${hosts
      .map(
        (h, i) =>
          `<p class="t-line t-row" style="--d:${i + 2}"><span class="t-n">${h.rank}</span><span class="t-name">${esc(h.name)}</span><span class="t-bar"><span style="--w:${(h.score - 7) * 33.3}%;--h:${h.hue}"></span></span><span class="t-sc">${fmtScore(h.score)}</span></p>`
      )
      .join("")}
    <p class="t-line t-ok" style="--d:${hosts.length + 2}">✓ препоръка: <b>${esc(hosts[0].name)}</b>, ${esc(hosts[0].badge.toLowerCase())}</p>
    <p class="t-line" style="--d:${hosts.length + 3}"><span class="t-pr">$</span> <span class="t-cur"></span></p>
  </div>
</div>`;

const rankCard = (h) => `
<article class="rank" id="${h.slug}" style="--h:${h.hue}" data-reveal>
  <div class="rank-num" aria-hidden="true">#${h.rank}</div>
  <div class="rank-head">
    ${monogram(h, "mono-lg")}
    <div class="rank-title">
      <span class="badge">${esc(h.badge)}</span>
      <h3><a href="${reviewLink(h)}">${esc(h.name)}</a></h3>
      <p class="rank-for">${icon("info")} ${esc(h.bestFor)}</p>
    </div>
    ${scoreRing(h.score, 72)}
  </div>
  <p class="rank-sum">${esc(h.summary)}</p>
  <div class="rank-grid">
    ${scoreBars(h)}
    ${proscons(h)}
  </div>
  <div class="rank-foot">
    <div class="price"><span class="price-from">от</span> <strong>~${fmtPrice(h.priceFrom)}</strong><span class="price-per">/мес.</span><small>${esc(h.priceNote)}</small></div>
    <div class="rank-cta">
      <a class="btn btn-ghost" href="${reviewLink(h)}">Пълно ревю ${icon("arrow")}</a>
      ${affButton(h, `Към ${h.name}`)}
    </div>
  </div>
</article>`;

const rows = [
  ["Оценка", (h) => `<b class="tbl-score">${fmtScore(h.score)}</b>`],
  ["Цена от", (h) => `~${fmtPrice(h.priceFrom)}<small>/мес.</small>`],
  ["Контролен панел", (h) => esc(h.facts.panel)],
  ["Център за данни", (h) => esc(h.facts.datacenters)],
  ["SSL сертификат", (h) => esc(h.facts.ssl)],
  ["Архиви", (h) => esc(h.facts.backups)],
  ["Домейн", (h) => esc(h.facts.domain)],
  ["Имейл кутии", (h) => esc(h.facts.email)],
  ["Поддръжка", (h) => esc(h.facts.support)],
  ["На български", (h) => (h.facts.bgSupport ? `<span class="yes">${icon("check")} Да</span>` : `<span class="no">${icon("x")} Не</span>`)],
  ["Гаранция / тест", (h) => esc(h.facts.refund)],
  ["Договор", (h) => esc(h.facts.contract)],
];

const table = () => `
<div class="tbl-wrap" data-reveal tabindex="0" role="region" aria-label="Сравнителна таблица, може да се скролира хоризонтално">
  <table class="tbl">
    <thead><tr><th scope="col"><span class="sr">Параметър</span></th>${hosts
      .map((h) => `<th scope="col" style="--h:${h.hue}">${monogram(h, "mono-sm")}<a href="${reviewLink(h)}">${esc(h.name)}</a></th>`)
      .join("")}</tr></thead>
    <tbody>
      ${rows.map(([label, fn]) => `<tr><th scope="row">${label}</th>${hosts.map((h) => `<td>${fn(h)}</td>`).join("")}</tr>`).join("")}
      <tr class="tbl-cta"><th scope="row"><span class="sr">Оферта</span></th>${hosts.map((h) => `<td>${affButton(h, "Оферта", "btn btn-primary btn-sm")}</td>`).join("")}</tr>
    </tbody>
  </table>
</div>`;

const quiz = () => `
<div class="quiz" data-quiz data-reveal>
  <div class="quiz-prog" aria-hidden="true"><span data-quiz-bar></span></div>
  <form data-quiz-form>
    <fieldset class="q-step is-on" data-step="0">
      <legend><span class="q-n">1/3</span> Какъв сайт правиш?</legend>
      <div class="opts">
        <label class="opt"><input type="radio" name="type" value="blog" required><span>${icon("pen")}<b>Блог или визитка</b><small>Личен сайт, портфолио, малка фирма</small></span></label>
        <label class="opt"><input type="radio" name="type" value="shop"><span>${icon("cart")}<b>Онлайн магазин</b><small>WooCommerce, OpenCart и др.</small></span></label>
        <label class="opt"><input type="radio" name="type" value="wordpress"><span>${icon("wp")}<b>Сериозен WordPress</b><small>Фирмен сайт, медия, клиентски проекти</small></span></label>
        <label class="opt"><input type="radio" name="type" value="scale"><span>${icon("rocket")}<b>Голям проект</b><small>Много трафик, агенция, приложение</small></span></label>
      </div>
    </fieldset>
    <fieldset class="q-step" data-step="1">
      <legend><span class="q-n">2/3</span> Какъв е бюджетът ти?</legend>
      <div class="opts">
        <label class="opt"><input type="radio" name="budget" value="low"><span>${icon("coin")}<b>Възможно най-евтино</b><small>До ~5 € на месец</small></span></label>
        <label class="opt"><input type="radio" name="budget" value="mid"><span>${icon("layers")}<b>Разумно</b><small>5 до 15 € на месец</small></span></label>
        <label class="opt"><input type="radio" name="budget" value="high"><span>${icon("rocket")}<b>Важно е да работи отлично</b><small>Бюджетът не е проблем</small></span></label>
      </div>
    </fieldset>
    <fieldset class="q-step" data-step="2">
      <legend><span class="q-n">3/3</span> Кое е най-важно за теб?</legend>
      <div class="opts">
        <label class="opt"><input type="radio" name="prio" value="bg"><span>${icon("chat")}<b>Поддръжка на български</b><small>И фактура от българска фирма</small></span></label>
        <label class="opt"><input type="radio" name="prio" value="speed"><span>${icon("bolt")}<b>Скорост</b><small>Бързо зареждане и добро SEO</small></span></label>
        <label class="opt"><input type="radio" name="prio" value="beginner"><span>${icon("shield")}<b>Лесно управление</b><small>Нямам технически опит</small></span></label>
      </div>
    </fieldset>
    <div class="q-nav">
      <button type="button" class="btn btn-ghost" data-quiz-back hidden>Назад</button>
      <span class="q-hint">Избери отговор, за да продължиш</span>
    </div>
  </form>
  <div class="q-result" data-quiz-result hidden aria-live="polite"></div>
</div>
<script type="application/json" id="quiz-data">${JSON.stringify(
  hosts.map((h) => ({
    slug: h.slug, name: h.name, monogram: h.monogram, hue: h.hue, score: h.score, badge: h.badge,
    bestFor: h.bestFor, verdict: h.verdict, tags: h.tags, priceFrom: h.priceFrom,
    review: reviewLink(h), go: u(`/go/${h.slug}/`),
  }))
).replace(/</g, "\\u003c")}</script>`;

const critIcons = { speed: "bolt", price: "coin", support: "chat", ease: "shield", features: "layers" };
const critText = {
  speed: "LiteSpeed/NGINX, кеш, PHP версии, локация на центровете за данни и CDN.",
  price: "Реална цена за 3 години, включително подновяване, а не само промоцията.",
  support: "Скорост на отговора, компетентност, канали и наличност на български.",
  ease: "Контролен панел, инсталация на WordPress, домейни и имейл без главоболия.",
  features: "Архиви, SSL, staging, имейл, сигурност и възможност за растеж.",
};

export function homePage() {
  const ldList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Най-добрият хостинг в България (${site.updatedLabel})`,
    itemListElement: hosts.map((h) => ({ "@type": "ListItem", position: h.rank, url: abs(`/hosting/${h.slug}/`), name: h.name })),
  };
  const ldFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  const body = `
<section class="hero">
  <div class="hero-bg" aria-hidden="true"><div class="grid-bg"></div><div class="glow g1"></div><div class="glow g2"></div></div>
  <div class="wrap hero-in">
    <div class="hero-copy">
      <p class="eyebrow"><span class="dot"></span> Обновено: ${esc(site.updatedLabel)}</p>
      <h1>Най-добрият <span class="grad">хостинг</span> за твоя сайт в България</h1>
      <p class="lead">Сравнихме ${hosts.length} от най-популярните хостинг доставчика по скорост, цена, поддръжка и лекота на използване, за да не губиш часове в четене на рекламни обещания.</p>
      <div class="hero-cta">
        <a class="btn btn-primary btn-lg" href="${u("/#klasaciya")}">Виж класацията ${icon("arrow")}</a>
        <a class="btn btn-ghost btn-lg" href="${u("/#izbor")}">Тест: кой е за мен? <small>30 сек.</small></a>
      </div>
      <ul class="trust">
        <li>${icon("shield")} Независими оценки</li>
        <li>${icon("layers")} ${criteria.length} критерия</li>
        <li>${icon("coin")} Цени в евро</li>
      </ul>
    </div>
    ${terminal()}
  </div>
</section>

<section class="wrap picks" aria-label="Бърз избор">
  ${quickPicks
    .map((p) => {
      const h = hosts.find((x) => x.slug === p.slug);
      if (!h) return "";
      return `<a class="pick" href="#${h.slug}" style="--h:${h.hue}">${icon(p.ic)}<span><small>${esc(p.label)}</small><b>${esc(h.name)}</b></span>${icon("arrow", "i pick-arr")}</a>`;
    })
    .join("")}
</section>

<div class="wrap">${disclosureBar()}</div>

<section class="sec" id="klasaciya">
  <div class="wrap">
    <header class="sec-head">
      <p class="kicker">Класация ${new Date(site.updated).getFullYear()}</p>
      <h2>Топ ${hosts.length} хостинг доставчици</h2>
      <p>Подредени по обща оценка. Всеки е най-добър за различен тип потребител, затова прочети за кого е подходящ.</p>
    </header>
    <div class="ranks">${hosts.map(rankCard).join("")}</div>
    ${priceNote()}
  </div>
</section>

<section class="sec sec-alt" id="sravnenie">
  <div class="wrap">
    <header class="sec-head">
      <p class="kicker">Сравнение</p>
      <h2>Всички важни параметри на едно място</h2>
      <p>На телефон плъзни таблицата настрани, за да видиш всички доставчици.</p>
    </header>
    ${table()}
    ${priceNote()}
  </div>
</section>

<section class="sec" id="izbor">
  <div class="wrap narrow">
    <header class="sec-head center">
      <p class="kicker">Персонална препоръка</p>
      <h2>Кой хостинг е за мен?</h2>
      <p>Отговори на 3 въпроса и ще ти предложим най-подходящия доставчик.</p>
    </header>
    ${quiz()}
  </div>
</section>

<section class="sec sec-alt" id="metodika">
  <div class="wrap">
    <header class="sec-head">
      <p class="kicker">Методика</p>
      <h2>Как оценяваме</h2>
      <p>Всеки доставчик получава оценка от 1 до 10 по пет критерия. Общата оценка не е проста средна стойност: тежест имат и цената при подновяване, и за кого е подходящ доставчикът. <a href="${u("/za-nas/#metodika")}">Пълна методика</a>.</p>
    </header>
    <div class="crit">${criteria
      .map((c) => `<div class="crit-c" data-reveal>${icon(critIcons[c.key])}<h3>${esc(c.label)}</h3><p>${esc(critText[c.key])}</p></div>`)
      .join("")}</div>
  </div>
</section>

<section class="sec" id="rakovodstva">
  <div class="wrap">
    <header class="sec-head">
      <p class="kicker">Научи повече</p>
      <h2>Ръководства за начинаещи</h2>
    </header>
    <div class="guides">
      <a class="guide" href="${u("/rakovodstvo/kak-da-izberem-hosting/")}" data-reveal>${icon("book")}<h3>Как да изберем хостинг: 7 неща, които да провериш</h3><p>От цената при подновяване до архивите: пълен чеклист, преди да платиш.</p><span>Прочети ${icon("arrow")}</span></a>
      <a class="guide" href="${u("/rakovodstvo/vidove-hosting/")}" data-reveal>${icon("server")}<h3>Споделен, VPS или облачен хостинг?</h3><p>Разликите с прости думи и кога си струва да надградиш.</p><span>Прочети ${icon("arrow")}</span></a>
    </div>
  </div>
</section>

<section class="sec sec-alt" id="vaprosi">
  <div class="wrap narrow">
    <header class="sec-head center">
      <p class="kicker">ЧЗВ</p>
      <h2>Често задавани въпроси</h2>
    </header>
    <div class="faq">${faqs.map((f) => `<details data-reveal><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div>
  </div>
</section>

<section class="wrap cta-band" data-reveal>
  <div>
    <h2>Готов ли си да пуснеш сайта си?</h2>
    <p>Нашият избор №1 за повечето хора е <b>${esc(hosts[0].name)}</b>: ${esc(hosts[0].verdict.charAt(0).toLowerCase() + hosts[0].verdict.slice(1))}</p>
  </div>
  ${affButton(hosts[0], `Започни с ${hosts[0].name}`, "btn btn-primary btn-lg")}
</section>
`;

  return layout({
    title: "Най-добрият хостинг в България",
    description: `Сравнение и класация на най-добрия хостинг в България за ${new Date(site.updated).getFullYear()}: цени в евро, плюсове и минуси, поддръжка на български и тест кой хостинг е подходящ за теб.`,
    path: "/",
    body,
    ld: [ldList, ldFaq],
  });
}
