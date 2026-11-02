/* ХостКомпас: интерактивност (без външни библиотеки) */
(function () {
  "use strict";
  var doc = document.documentElement;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- тема ---------- */
  $$("[data-theme-toggle]").forEach(function (b) {
    b.addEventListener("click", function () {
      var next = doc.dataset.theme === "light" ? "dark" : "light";
      doc.dataset.theme = next;
      try { localStorage.setItem("hk-theme", next); } catch (e) {}
      var m = $('meta[name="theme-color"]');
      if (m) m.setAttribute("content", next === "light" ? "#f5f7fc" : "#070b14");
    });
  });

  /* ---------- мобилно меню ---------- */
  var menuBtn = $("[data-menu]");
  var nav = $("#nav");
  if (menuBtn && nav) {
    var setMenu = function (open) {
      nav.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
    };
    menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  /* ---------- header при скрол + мобилна лента ---------- */
  var hdr = $("[data-hdr]");
  var mcta = $("[data-mobile-cta]");
  var onScroll = function () {
    var y = window.scrollY;
    if (hdr) hdr.classList.toggle("is-stuck", y > 8);
    if (mcta) {
      var nearEnd = window.innerHeight + y > document.body.scrollHeight - 420;
      mcta.classList.toggle("is-on", y > 520 && !nearEnd);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- появяване при скрол ---------- */
  var rev = $$("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    rev.forEach(function (el) { io.observe(el); });
  } else {
    rev.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- тест „Кой хостинг е за мен?“ ---------- */
  var quiz = $("[data-quiz]");
  var dataEl = $("#quiz-data");
  if (quiz && dataEl) {
    var hosts = JSON.parse(dataEl.textContent);
    var form = $("[data-quiz-form]", quiz);
    var steps = $$(".q-step", quiz);
    var bar = $("[data-quiz-bar]", quiz);
    var back = $("[data-quiz-back]", quiz);
    var hint = $(".q-hint", quiz);
    var result = $("[data-quiz-result]", quiz);
    var cur = 0;

    var esc = function (s) {
      return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
    };
    var fmt = function (n) { return Number(n).toFixed(2).replace(".", ",") + " €"; };
    var fmtS = function (n) { return Number(n).toFixed(1).replace(".", ","); };

    var show = function (i) {
      cur = i;
      steps.forEach(function (s, k) { s.classList.toggle("is-on", k === i); });
      back.hidden = i === 0;
      hint.hidden = false;
      bar.style.width = (8 + (i / steps.length) * 92) + "%";
      var first = $("input", steps[i]);
      if (first && document.activeElement && quiz.contains(document.activeElement)) first.focus({ preventScroll: true });
    };

    var why = {
      type: { blog: "е подходящ за блогове и сайтове визитки", shop: "се справя добре с онлайн магазини", wordpress: "е отличен за WordPress", scale: "издържа на голям трафик и расте с проекта" },
      budget: { low: "цената му е ниска", mid: "дава добра стойност за парите", high: "предлага висока производителност" },
      prio: { bg: "има поддръжка на български", speed: "е сред най-бързите в класацията", beginner: "управлението му е лесно и за начинаещи" },
    };
    var joinBg = function (arr) { return arr.length > 1 ? arr.slice(0, -1).join(", ") + " и " + arr[arr.length - 1] : arr[0]; };

    var score = function (h, a) {
      var t = h.tags, s = h.score * 0.6;
      if (a.type === "blog") s += t.beginner + t.price * 0.6;
      if (a.type === "shop") s += t.shop * 1.6;
      if (a.type === "wordpress") s += t.wordpress * 1.6;
      if (a.type === "scale") s += t.scale * 2.2;
      if (a.budget === "low") s += t.price * 1.6 - (h.priceFrom > 8 ? 5 : 0);
      if (a.budget === "mid") s += t.price * 0.5 - (h.priceFrom > 20 ? 2 : 0);
      if (a.budget === "high") s += t.speed + t.scale * 0.6;
      if (a.prio === "bg") s += t.bg * 2.2;
      if (a.prio === "speed") s += t.speed * 1.6;
      if (a.prio === "beginner") s += t.beginner * 1.6;
      return s;
    };

    var finish = function () {
      var fd = new FormData(form);
      var a = { type: fd.get("type"), budget: fd.get("budget"), prio: fd.get("prio") };
      var ranked = hosts.map(function (h) { return { h: h, s: score(h, a) }; }).sort(function (x, y) { return y.s - x.s; });
      var best = ranked[0].h, alt = ranked[1].h;
      var reasons = [why.type[a.type], why.budget[a.budget], why.prio[a.prio]];
      if (a.prio === "bg" && !best.tags.bg) reasons[2] = "е най-добрият компромис, въпреки че поддръжката не е на български";
      if (a.budget === "low" && best.tags.price < 2) reasons[1] = "е по-скъп, но най-добре отговаря на нуждите ти";

      form.hidden = true;
      bar.style.width = "100%";
      result.hidden = false;
      result.innerHTML =
        '<p class="kicker">Твоят най-добър избор</p>' +
        '<div class="q-res-top" style="--h:' + best.hue + '"><span class="mono mono-lg" aria-hidden="true">' + esc(best.monogram) + "</span>" +
        "<div><h3>" + esc(best.name) + "</h3><p>" + esc(best.badge) + " · оценка " + fmtS(best.score) + " · от ~" + fmt(best.priceFrom) + "/мес.</p></div></div>" +
        '<p class="q-res-why">Препоръчваме ' + esc(best.name) + ", защото " + esc(joinBg(reasons)) + ". " + esc(best.verdict) + "</p>" +
        '<div class="q-res-cta"><a class="btn btn-primary btn-lg" href="' + esc(best.go) + '" target="_blank" rel="sponsored nofollow noopener" data-track="' + esc(best.slug) + '">Виж офертата на ' + esc(best.name) + "</a>" +
        '<a class="btn btn-ghost btn-lg" href="' + esc(best.review) + '">Прочети ревюто</a></div>' +
        '<div class="q-alt" style="--h:' + alt.hue + '"><span class="mono mono-sm" aria-hidden="true">' + esc(alt.monogram) + "</span><span>Алтернатива: <a href=\"" + esc(alt.review) + '">' + esc(alt.name) + "</a>. Подходящ за: " + esc(alt.bestFor.charAt(0).toLowerCase() + alt.bestFor.slice(1)) + ".</span></div>" +
        '<button type="button" class="q-restart" data-quiz-restart>Започни отначало</button>';
      $("[data-quiz-restart]", result).addEventListener("click", function () {
        form.reset();
        form.hidden = false;
        result.hidden = true;
        show(0);
      });
      result.setAttribute("tabindex", "-1");
      result.focus({ preventScroll: true });
      var top = quiz.getBoundingClientRect().top + window.scrollY - 90;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: "smooth" });
    };

    form.addEventListener("change", function (e) {
      if (e.target.type !== "radio") return;
      setTimeout(function () {
        if (cur < steps.length - 1) show(cur + 1);
        else finish();
      }, 260);
    });
    back.addEventListener("click", function () { if (cur > 0) show(cur - 1); });
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    show(0);
  }
})();
