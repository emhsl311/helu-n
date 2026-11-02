import { site } from "../../data/site.mjs";
import { hosts, criteria } from "../../data/hosts.mjs";
import {
  esc, u, icon, monogram, affButton, fmtScore, reviewLink, breadcrumbs, layout,
} from "../lib.mjs";

// Обща рамка за статия (ръководства, информационни страници)
function article({ path, title, h1, lead, description, crumbLabel, parent, html, toc = [], aside = true, noindex = false, ldType = "Article" }) {
  const crumbs = breadcrumbs([{ href: "/", label: "Начало" }, ...(parent ? [parent] : []), { href: path, label: crumbLabel }]);
  const ld = {
    "@context": "https://schema.org",
    "@type": ldType,
    headline: h1,
    dateModified: site.updated,
    author: { "@type": "Organization", name: site.author },
    publisher: { "@type": "Organization", name: site.name },
  };
  const body = `
<section class="pg-hero">
  <div class="hero-bg" aria-hidden="true"><div class="grid-bg"></div><div class="glow g1"></div></div>
  <div class="wrap">
    ${crumbs.html}
    <h1>${h1}</h1>
    ${lead ? `<p class="lead">${lead}</p>` : ""}
    <p class="rv-meta">${icon("clock")} Обновено: ${esc(site.updatedLabel)}</p>
  </div>
</section>
<div class="wrap ${aside ? "rv-layout" : "narrow"}">
  <article class="prose rv-main">
    ${toc.length ? `<nav class="toc" aria-label="Съдържание"><h2 class="h-sm">Съдържание</h2><ol>${toc.map((t) => `<li><a href="#${t[0]}">${esc(t[1])}</a></li>`).join("")}</ol></nav>` : ""}
    ${html}
  </article>
  ${aside ? `<aside class="rv-side"><div class="side-card"><h3 class="h-sm">Топ 3 за ${new Date(site.updated).getFullYear()}</h3><ol class="mini-rank">${hosts
    .slice(0, 3)
    .map((h) => `<li style="--h:${h.hue}">${monogram(h, "mono-sm")}<a href="${reviewLink(h)}"><b>${esc(h.name)}</b><small>${esc(h.badge)}</small></a><span>${fmtScore(h.score)}</span></li>`)
    .join("")}</ol><a class="btn btn-ghost btn-block" href="${u("/#klasaciya")}">Цялата класация ${icon("arrow")}</a></div></aside>` : ""}
</div>`;
  return layout({ title, description, path, body, ld: [ld, crumbs.ld], ogType: "article", noindex });
}

const H = (slug) => hosts.find((h) => h.slug === slug);
const hl = (slug) => {
  const h = H(slug);
  return h ? `<a href="${reviewLink(h)}">${esc(h.name)}</a>` : slug;
};

// ------------------------------------------------------------
export function guideChoose() {
  const path = "/rakovodstvo/kak-da-izberem-hosting/";
  const steps = [
    ["cena", "Гледай цената за 3 години, не за месец",
      `<p>Рекламираната цена почти винаги е промоционална и важи само при плащане за дълъг период напред. След това идва <b>цената при подновяване</b>, която често е 2 до 4 пъти по-висока.</p>
       <p>Направи проста сметка: <i>(промо цена × месеци от първия период) + (цена при подновяване × останалите месеци)</i>. Сравнявай доставчиците по общата сума за 36 месеца.</p>`],
    ["lokaciya", "Къде са сървърите",
      `<p>Колкото по-близо е сървърът до посетителите, толкова по-бързо се зарежда сайтът. За българска аудитория идеални са сървъри в България или в Централна Европа (Франкфурт, Амстердам, Виена). Разликата между тях е няколко милисекунди, т.е. почти незабележима.</p>
       <p>Ако аудиторията ти е международна, добави безплатен CDN, например Cloudflare.</p>`],
    ["tehnologii", "Технологии: LiteSpeed, NGINX, PHP 8",
      `<p>Модерният хостинг използва <b>LiteSpeed</b> или <b>NGINX</b>, поддържа актуални версии на PHP (8.x), HTTP/2 или HTTP/3 и има вграден кеш. Тези неща влияят повече на скоростта, отколкото мегабайтите и гигабайтите в рекламата.</p>`],
    ["arhivi", "Архиви (backup)",
      `<p>Някой ден нещо ще се счупи: плъгин, обновление или хакерска атака. Провери дали доставчикът прави <b>автоматични дневни архиви</b>, колко дни ги пази и дали възстановяването е безплатно и с един клик.</p>`],
    ["poddrazhka", "Поддръжка",
      `<p>Пиши на чата преди да купиш и задай конкретен въпрос. Колко бързо отговарят? Разбират ли проблема? Ако английският не ти е силна страна, избери доставчик с поддръжка на български, например ${hl("superhosting")} или ${hl("icn")}.</p>`],
    ["vklyucheno", "Какво е включено",
      `<ul>
         <li><b>SSL сертификат</b>: задължителен е за всеки сайт и трябва да е безплатен.</li>
         <li><b>Имейл кутии</b>: ако искаш адрес от типа ime@tvoyafirma.bg.</li>
         <li><b>Домейн</b>: някои планове дават безплатен домейн за първата година.</li>
         <li><b>Staging</b>: копие на сайта за тестове, преди промените да станат видими.</li>
       </ul>`],
    ["rastezh", "Възможност за растеж",
      `<p>Провери дали можеш лесно да минеш към по-мощен план, VPS или облак при същия доставчик. Преместването на сайт е напълно възможно, но е по-удобно да не се налага. Повече за разликите прочети в <a href="${u("/rakovodstvo/vidove-hosting/")}">„Споделен, VPS или облачен хостинг?“</a>.</p>`],
  ];
  const html = `
    <p>Изборът на хостинг изглежда сложен заради десетките технически термини в офертите. Всъщност решението зависи от <b>седем неща</b>. Ако провериш тях, ще избегнеш 95% от проблемите.</p>
    ${steps.map((s, i) => `<section id="${s[0]}"><h2><span class="step-n">${i + 1}</span>${esc(s[1])}</h2>${s[2]}</section>`).join("")}
    <section id="chekl" class="callout">${icon("check")}<div><h3>Бърз чеклист</h3>
      <ul class="checklist">
        <li>Сметнах цената за 36 месеца, включително подновяването</li>
        <li>Сървърите са в България или Централна Европа</li>
        <li>Има безплатен SSL и автоматични архиви</li>
        <li>Тествах поддръжката с въпрос преди покупката</li>
        <li>Има гаранция за връщане на парите или пробен период</li>
      </ul></div></section>
    <section id="preporaka"><h2>Нашата препоръка</h2>
      <p>За повечето начинаещи ${hl("hostinger")} е най-изгодният старт. За сериозен WordPress сайт избери ${hl("siteground")}. Ако искаш всичко на български, гледай ${hl("superhosting")}.</p>
      <p><a class="btn btn-primary" href="${u("/#izbor")}">Направи теста „Кой е за мен?“ ${icon("arrow")}</a></p>
    </section>`;
  return article({
    path,
    title: "Как да изберем хостинг: 7 неща, които да провериш",
    h1: "Как да изберем хостинг: 7 неща, които да провериш",
    lead: "Практично ръководство без излишен жаргон: какво наистина има значение, преди да платиш за хостинг.",
    description: "Как да изберем хостинг за сайт: цена при подновяване, локация на сървъра, технологии, архиви, поддръжка и чеклист преди покупка.",
    crumbLabel: "Как да изберем хостинг",
    parent: { href: "/#rakovodstva", label: "Ръководства" },
    toc: [...steps.map((s) => [s[0], s[1]]), ["chekl", "Бърз чеклист"], ["preporaka", "Нашата препоръка"]],
    html,
  });
}

// ------------------------------------------------------------
export function guideTypes() {
  const path = "/rakovodstvo/vidove-hosting/";
  const types = [
    { id: "spodelen", ic: "layers", name: "Споделен хостинг", price: "~3 до 10 €/мес.", who: "Блогове, визитки, малки магазини",
      body: "Твоят сайт живее на един сървър заедно с много други сайтове и споделя ресурсите им. Евтино е, доставчикът се грижи за всичко, а ти само качваш сайта. Подходящ е за 90% от новите сайтове.",
      plus: ["Най-ниска цена", "Не изисква технически познания", "Имейл и домейн често са включени"],
      minus: ["Ресурсите са ограничени", "Съседен сайт с много трафик може да те забави"] },
    { id: "vps", ic: "server", name: "VPS", price: "~5 до 40 €/мес.", who: "Разработчици и специфични приложения",
      body: "Виртуален частен сървър с гарантирани ресурси и пълен контрол (root достъп). Сам инсталираш и поддържаш софтуера, освен ако не платиш за управляван VPS.",
      plus: ["Гарантирани ресурси", "Пълна свобода на настройките"],
      minus: ["Изисква администриране и знания за Linux", "Сигурността е твоя отговорност"] },
    { id: "oblak", ic: "globe", name: "Управляван облачен хостинг", price: "~12 до 100+ €/мес.", who: "Растящи проекти, магазини, агенции",
      body: "Собствен облачен сървър (DigitalOcean, AWS, Google Cloud), който доставчикът управлява вместо теб: обновления, кеш, архиви, сигурност. Комбинира силата на VPS с удобството на споделения хостинг.",
      plus: ["Отлична скорост и стабилност", "Мащабиране с няколко клика", "Плащане месечно"],
      minus: ["По-висока цена", "Имейлът често е отделна услуга"] },
  ];
  const html = `
    <p>Когато сравняваш оферти, ще срещнеш три основни вида хостинг. Ето разликите с прости думи.</p>
    <div class="types">${types
      .map(
        (t) => `<section class="type" id="${t.id}" data-reveal>
          <div class="type-h">${icon(t.ic)}<div><h2>${t.name}</h2><p class="type-meta"><b>${t.price}</b> · ${t.who}</p></div></div>
          <p>${t.body}</p>
          <div class="pc"><div class="pc-col pc-pro"><h4>Плюсове</h4><ul>${t.plus.map((p) => `<li>${icon("check")}<span>${p}</span></li>`).join("")}</ul></div>
          <div class="pc-col pc-con"><h4>Минуси</h4><ul>${t.minus.map((p) => `<li>${icon("x")}<span>${p}</span></li>`).join("")}</ul></div></div>
        </section>`
      )
      .join("")}</div>
    <section id="koga"><h2>Кога да надградиш?</h2>
      <ul>
        <li>Сайтът се забавя при пикове на трафика, дори след като си включил кеша.</li>
        <li>Доставчикът те предупреждава, че превишаваш ресурсите (CPU, процеси, RAM).</li>
        <li>Онлайн магазинът ти расте и всяка секунда забавяне струва продажби.</li>
      </ul>
      <p>Тогава обикновено е време за управляван облак, например ${hl("cloudways")}, или по-висок план при сегашния ти доставчик.</p>
    </section>
    <section id="start"><h2>С какво да започна?</h2>
      <p>Почти винаги със <b>споделен хостинг</b>. Той е евтин, лесен и с него можеш да надградиш по-късно. Виж <a href="${u("/#klasaciya")}">нашата класация</a> или <a href="${u("/rakovodstvo/kak-da-izberem-hosting/")}">как да избереш</a>.</p>
    </section>`;
  return article({
    path,
    title: "Споделен, VPS или облачен хостинг: каква е разликата?",
    h1: "Споделен, VPS или облачен хостинг?",
    lead: "Трите основни вида хостинг, обяснени с прости думи: колко струват, за кого са и кога си струва да надградиш.",
    description: "Разликата между споделен хостинг, VPS и управляван облачен хостинг: цени, плюсове, минуси и кога да надградиш.",
    crumbLabel: "Видове хостинг",
    parent: { href: "/#rakovodstva", label: "Ръководства" },
    toc: [...types.map((t) => [t.id, t.name]), ["koga", "Кога да надградиш?"], ["start", "С какво да започна?"]],
    html,
  });
}

// ------------------------------------------------------------
export function aboutPage() {
  const path = "/za-nas/";
  const html = `
    <section id="misiya"><h2>Кои сме</h2>
      <p>${esc(site.name)} е независим сайт, който сравнява хостинг услуги за българския потребител. Целта ни е проста: да можеш да избереш хостинг за няколко минути, без да четеш десетки рекламни страници на английски.</p>
    </section>
    <section id="metodika"><h2>Как оценяваме</h2>
      <p>Всеки доставчик получава оценка от 1 до 10 по пет критерия:</p>
      <ul>${criteria.map((c) => `<li><b>${esc(c.label)}</b></li>`).join("")}</ul>
      <p>Общата оценка отразява и за кого е подходящ доставчикът и колко ще платиш реално за 3 години. Проверяваме цените и условията редовно. Датата на последната проверка е посочена на всяка страница.</p>
      <p>Забелязал си грешка или промяна в цена? Пиши ни на <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> и ще я поправим.</p>
    </section>
    <section id="prozrachnost" class="callout">${icon("info")}<div>
      <h2>Прозрачност: как печелим</h2>
      <p>Сайтът се издържа от партньорски (affiliate) програми. Когато кликнеш на бутон „Към офертата“ и поръчаш услуга, доставчикът може да ни плати комисионна. <b>Ти не плащаш нищо допълнително.</b> Понякога дори получаваш по-добра цена.</p>
      <p>Комисионните не определят класацията. Включваме и доставчици, с които нямаме партньорство, ако са добър избор за читателите. Партньорските линкове са отбелязани с атрибут <code>rel="sponsored"</code>, а на страниците има бележка за това.</p>
    </div></section>
    <section id="kontakt"><h2>Контакт</h2>
      <p>Въпроси, корекции, предложения за сътрудничество: <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>.</p>
    </section>`;
  return article({
    path, title: "За нас, методика и прозрачност", h1: "За нас",
    lead: "Кои сме, как оценяваме хостинг доставчиците и как се издържа сайтът.",
    description: `Кой стои зад ${site.name}, как оценяваме хостинг доставчиците и как работят партньорските линкове.`,
    crumbLabel: "За нас",
    toc: [["misiya", "Кои сме"], ["metodika", "Как оценяваме"], ["prozrachnost", "Прозрачност: как печелим"], ["kontakt", "Контакт"]],
    html, ldType: "AboutPage",
  });
}

// ------------------------------------------------------------
export function privacyPage() {
  const path = "/poveritelnost/";
  const html = `
    <p>Тази политика обяснява какви данни се обработват, когато посещаваш ${esc(site.name)}.</p>
    <h2>Какви данни събираме</h2>
    <p>Сайтът <b>не използва бисквитки за проследяване</b>, не изисква регистрация и не събира лични данни чрез формуляри. Запомняме само избора ти на светла или тъмна тема, локално в браузъра ти (localStorage). Тази информация не се изпраща към нас.</p>
    <h2>Хостинг и сървърни логове</h2>
    <p>Доставчикът, на който работи сайтът, може да записва технически данни (IP адрес, браузър, време на заявката) в сървърни логове за сигурност и стабилност, съгласно собствената си политика.</p>
    <h2>Шрифтове</h2>
    <p>Шрифтовете се зареждат от Google Fonts. При зареждането им браузърът ти изпраща IP адреса си към Google.</p>
    <h2>Партньорски линкове</h2>
    <p>Когато кликнеш на партньорски линк, преминаваш към сайта на съответния доставчик. Той може да постави свои бисквитки, за да отчете препращането. За тях важи политиката за поверителност на доставчика.</p>
    <h2>Твоите права</h2>
    <p>Съгласно Общия регламент за защита на данните (GDPR) имаш право на достъп, коригиране и изтриване на данни, както и право на жалба до Комисията за защита на личните данни (КЗЛД). За въпроси пиши на <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>.</p>`;
  return article({
    path, title: "Политика за поверителност", h1: "Политика за поверителност",
    description: `Политика за поверителност и бисквитки на ${site.name}.`,
    crumbLabel: "Поверителност", html, aside: false, ldType: "WebPage",
  });
}

// ------------------------------------------------------------
export function notFoundPage() {
  const body = `
<section class="pg-hero nf">
  <div class="hero-bg" aria-hidden="true"><div class="grid-bg"></div><div class="glow g1"></div><div class="glow g2"></div></div>
  <div class="wrap center">
    <p class="nf-code">404</p>
    <h1>Тази страница не отговаря</h1>
    <p class="lead">Изглежда линкът е грешен или страницата е преместена.</p>
    <p class="hero-cta center"><a class="btn btn-primary btn-lg" href="${u("/")}">Към началото ${icon("arrow")}</a> <a class="btn btn-ghost btn-lg" href="${u("/#klasaciya")}">Класацията</a></p>
  </div>
</section>`;
  return layout({ title: "Страницата не е намерена", description: "Страницата не е намерена.", path: "/404.html", body, noindex: true });
}

// ------------------------------------------------------------
//  /go/<slug>/ пренасочване към партньорския линк.
//  Едно място за смяна на линка и чисти URL адреси в съдържанието.
export function goPage(h) {
  const target = h.affiliateUrl || h.homepage;
  const t = esc(target);
  return `<!doctype html>
<html lang="bg"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow">
<meta name="referrer" content="no-referrer-when-downgrade">
<title>Пренасочване към ${esc(h.name)}…</title>
<meta http-equiv="refresh" content="0;url=${t}">
<link rel="canonical" href="${t}">
<style>body{font:16px system-ui,sans-serif;background:#070b14;color:#e6edf7;display:grid;place-items:center;min-height:100vh;margin:0}a{color:#22d3ee}</style>
</head><body><p>Пренасочваме те към <a href="${t}" rel="sponsored nofollow">${esc(h.name)}</a>…</p>
<script>location.replace(${JSON.stringify(target)})</script></body></html>`;
}
