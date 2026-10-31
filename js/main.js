(function () {
  "use strict";
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  function store(key, val) {
    try { if (val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); } catch (e) { return null; }
  }

  /* ---------- Theme ---------- */
  var saved = store("theme");
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", saved || (prefersDark ? "dark" : "light"));
  $("#themeToggle").addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    store("theme", next);
  });

  /* ---------- Font size (accessibility) ---------- */
  var sizes = [14, 16, 18, 20];
  var idx = parseInt(store("fontIdx"), 10);
  if (isNaN(idx)) idx = 1;
  function applyFont() { root.style.setProperty("--fs", sizes[idx] + "px"); store("fontIdx", String(idx)); }
  applyFont();
  $$("[data-font]").forEach(function (b) {
    b.addEventListener("click", function () {
      var d = parseInt(b.getAttribute("data-font"), 10);
      idx = d === 0 ? 1 : Math.max(0, Math.min(sizes.length - 1, idx + d));
      applyFont();
    });
  });

  /* ---------- Header / mobile nav ---------- */
  var header = $("#header"), nav = $("#nav"), burger = $("#burger"), toTop = $("#toTop");
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 10);
    toTop.classList.toggle("is-visible", y > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  function closeNav() { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); }
  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
  });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", closeNav); });
  document.addEventListener("click", function (e) {
    if (!nav.contains(e.target) && !burger.contains(e.target)) closeNav();
  });

  /* Active nav link on scroll */
  var links = $$(".nav a");
  var sections = links.map(function (a) { return $(a.getAttribute("href")); }).filter(Boolean);
  if ("IntersectionObserver" in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id); });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navIO.observe(s); });
  }

  /* ---------- Reveal on scroll + counters ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var start = performance.now(), dur = 1600;
    (function step(now) {
      var p = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("bg-BG") + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }
  var reveals = $$(".reveal");
  var counters = $$("[data-count]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        if (el.hasAttribute("data-count")) countUp(el);
        else {
          var siblings = $$(".reveal", el.parentNode);
          el.style.transitionDelay = Math.min(siblings.indexOf(el), 6) * 70 + "ms";
          el.classList.add("is-in");
        }
        io.unobserve(el);
      });
    }, { threshold: 0.12 });
    reveals.concat(counters).forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
    counters.forEach(countUp);
  }

  /* ---------- Clock & date ---------- */
  var DAYS = ["неделя", "понеделник", "вторник", "сряда", "четвъртък", "петък", "събота"];
  var MON = ["януари", "февруари", "март", "април", "май", "юни", "юли", "август", "септември", "октомври", "ноември", "декември"];
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function tick() {
    var t = new Date();
    $("#clock").textContent = pad(t.getHours()) + ":" + pad(t.getMinutes());
    $("#today").textContent = DAYS[t.getDay()] + ", " + t.getDate() + " " + MON[t.getMonth()];
  }
  tick(); setInterval(tick, 15000);
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Service card spotlight ---------- */
  $$(".service").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* ---------- News filters ---------- */
  $$(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.getAttribute("data-filter");
      $$(".chip").forEach(function (c) { c.classList.toggle("is-active", c === chip); c.setAttribute("aria-selected", String(c === chip)); });
      $$(".news-card").forEach(function (card) {
        card.classList.toggle("is-hidden", f !== "all" && card.getAttribute("data-cat") !== f);
      });
    });
  });

  /* ---------- Tabs ---------- */
  var tabs = $$(".tab");
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { select(tab); });
    tab.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      select(next); next.focus();
    });
  });
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      panel.hidden = !on;
      panel.classList.toggle("is-active", on);
    });
  }

  /* ---------- Events carousel ---------- */
  var track = $("#eventsTrack");
  $$("[data-scroll]").forEach(function (b) {
    b.addEventListener("click", function () {
      var dir = parseInt(b.getAttribute("data-scroll"), 10);
      track.scrollBy({ left: dir * (track.clientWidth * 0.8), behavior: "smooth" });
    });
  });

  /* ---------- Search ---------- */
  var INDEX = [
    { t: "Плащане на местни данъци и такси", c: "Услуга", h: "#services" },
    { t: "Удостоверение за наследници", c: "Услуга", h: "#services" },
    { t: "Удостоверение за раждане (дубликат)", c: "Услуга", h: "#services" },
    { t: "Удостоверение за постоянен адрес", c: "Услуга", h: "#services" },
    { t: "Разрешение за строеж", c: "Услуга", h: "#services" },
    { t: "Скица на поземлен имот", c: "Услуга", h: "#services" },
    { t: "Подай сигнал за нередност", c: "Услуга", h: "#services" },
    { t: "Реконструкция на централния площад", c: "Новина", h: "#news" },
    { t: "Хелоуин парти за децата", c: "Новина", h: "#news" },
    { t: "Заседание на Общинския съвет", c: "Новина", h: "#news" },
    { t: "Проектобюджет 2027 — обществено обсъждане", c: "Обявление", h: "#notices" },
    { t: "Обществени поръчки — зимно поддържане", c: "Поръчка", h: "#notices" },
    { t: "Търг за земеделски земи", c: "Търг", h: "#notices" },
    { t: "График за сметосъбиране", c: "Обявление", h: "#notices" },
    { t: "Културен календар", c: "Събития", h: "#events" },
    { t: "Населени места в общината", c: "Общината", h: "#about" },
    { t: "Контакти и работно време", c: "Контакти", h: "#contacts" },
    { t: "Среща с кмета", c: "Контакти", h: "#contacts" }
  ];
  var overlay = $("#searchOverlay"), sInput = $("#searchInput"), sResults = $("#searchResults");
  var lastFocus = null;
  function norm(s) { return s.toLowerCase().replace(/[„“"]/g, ""); }
  function render(q) {
    q = norm(q.trim());
    var hits = q ? INDEX.filter(function (x) { return norm(x.t).indexOf(q) !== -1 || norm(x.c).indexOf(q) !== -1; }) : INDEX.slice(0, 7);
    sResults.innerHTML = "";
    if (!hits.length) {
      var li = document.createElement("li"); li.className = "empty"; li.textContent = "Няма намерени резултати.";
      sResults.appendChild(li); return;
    }
    hits.forEach(function (x) {
      var li = document.createElement("li"), a = document.createElement("a"), s = document.createElement("span"), sm = document.createElement("small");
      a.href = x.h; s.textContent = x.t; sm.textContent = x.c;
      a.appendChild(s); a.appendChild(sm); li.appendChild(a); sResults.appendChild(li);
      a.addEventListener("click", closeSearch);
    });
  }
  function openSearch(initial) {
    lastFocus = document.activeElement;
    overlay.hidden = false; document.body.style.overflow = "hidden";
    sInput.value = initial || ""; render(sInput.value);
    setTimeout(function () { sInput.focus(); }, 30);
  }
  function closeSearch() {
    overlay.hidden = true; document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  $("#searchOpen").addEventListener("click", function () { openSearch(); });
  $$("[data-search-trigger]").forEach(function (el) {
    var heroInput = $(".hero__search input");
    if (el.tagName === "INPUT") el.addEventListener("focus", function () { openSearch(el.value); el.blur(); });
    else el.addEventListener("click", function () { openSearch(heroInput.value); });
  });
  sInput.addEventListener("input", function () { render(sInput.value); });
  overlay.addEventListener("click", function (e) { if (e.target === overlay) closeSearch(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !overlay.hidden) closeSearch();
    if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))) {
      e.preventDefault(); openSearch();
    }
  });

  /* ---------- Contact form ---------- */
  var form = $("#contactForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    $$(".field", form).forEach(function (f) {
      var input = $("input, select, textarea", f);
      var valid = input.checkValidity();
      f.classList.toggle("is-invalid", !valid);
      if (!valid) ok = false;
    });
    var consent = $(".check input", form);
    var msg = $(".form__msg", form);
    if (!consent.checked) ok = false;
    msg.className = "form__msg " + (ok ? "ok" : "err");
    if (ok) {
      msg.textContent = "Благодарим! Запитването е изпратено. Ще получите отговор до 3 работни дни.";
      form.reset();
    } else {
      msg.textContent = "Моля, попълнете всички полета и дайте съгласие.";
    }
  });
})();
