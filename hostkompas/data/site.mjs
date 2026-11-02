// ============================================================
//  ОСНОВНИ НАСТРОЙКИ НА САЙТА
//  Промени тези стойности и пусни:  node build.mjs
// ============================================================

export const site = {
  name: "ХостКомпас",
  // Кратко описание под логото и в meta description на началната страница
  tagline: "Независимо сравнение на хостинг услуги за България",

  // Адресът, на който ще живее сайтът (без наклонена черта накрая).
  // Използва се за canonical линкове, sitemap.xml и Open Graph.
  url: "https://www.hostkompas.bg",

  // Ако сайтът е в подпапка (напр. GitHub Pages: https://user.github.io/repo),
  // напиши "/repo". За собствен домейн остави празно "".
  base: "",

  // Дата на последната проверка на цените и офертите (показва се на сайта)
  updated: "2026-11-02",
  updatedLabel: "ноември 2026",

  // Контакт за читатели и за партньори
  email: "kontakt@hostkompas.bg",

  // Автор / редакция (показва се в ревютата и в schema.org)
  author: "Редакция ХостКомпас",

  locale: "bg_BG",
  currency: "€",
};

export const nav = [
  { href: "/#klasaciya", label: "Класация" },
  { href: "/#sravnenie", label: "Сравнение" },
  { href: "/#izbor", label: "Кой е за мен?" },
  { href: "/rakovodstvo/kak-da-izberem-hosting/", label: "Ръководства" },
  { href: "/za-nas/", label: "За нас" },
];
