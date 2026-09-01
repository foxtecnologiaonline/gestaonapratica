(function () {
  "use strict";

  /* Theme: respect saved choice, else system preference */
  var root = document.documentElement;
  var saved = null;
  try {
    saved = localStorage.getItem("gnp-theme");
  } catch (e) {}
  if (saved === "dark" || saved === "light") {
    root.setAttribute("data-theme", saved);
  }

  function currentTheme() {
    var attr = root.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  document.addEventListener("click", function (e) {
    var toggle = e.target.closest(".theme-toggle");
    if (!toggle) return;
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("gnp-theme", next);
    } catch (err) {}
  });

  /* Mobile nav toggle */
  document.addEventListener("click", function (e) {
    var toggle = e.target.closest(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (toggle && links) {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      return;
    }
    var isNavLink = e.target.closest(".nav-links a");
    if (isNavLink && links && links.classList.contains("open")) {
      links.classList.remove("open");
    }
  });

  /* Mark current page's nav link */
  var path = window.location.pathname;
  document.querySelectorAll(".nav-links a[href]").forEach(function (a) {
    var href = a.getAttribute("href");
    if (!href || href.startsWith("#") || href.includes("#")) return;
    if (href === path || (href !== "/" && path.startsWith(href))) {
      a.setAttribute("aria-current", "page");
    }
  });

  /* Reading progress bar (article pages only) */
  var article = document.querySelector("article.article-body");
  if (article) {
    var bar = document.createElement("div");
    bar.className = "reading-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);

    var updateProgress = function () {
      var rect = article.getBoundingClientRect();
      var articleTop = rect.top + window.scrollY;
      var articleHeight = article.offsetHeight;
      var viewport = window.innerHeight;
      var scrolled = window.scrollY - articleTop + viewport * 0.3;
      var pct = Math.min(100, Math.max(0, (scrolled / articleHeight) * 100));
      bar.style.width = pct + "%";
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();

    /* Estimated reading time */
    var timeEl = document.querySelector("[data-reading-time]");
    if (timeEl) {
      var words = article.innerText.trim().split(/\s+/).length;
      var minutes = Math.max(1, Math.round(words / 200));
      timeEl.textContent = minutes + " min de leitura";
    }
  }

  /* Back to top */
  var backToTop = document.createElement("button");
  backToTop.className = "back-to-top icon-btn";
  backToTop.type = "button";
  backToTop.setAttribute("aria-label", "Voltar ao topo");
  backToTop.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(backToTop);
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  window.addEventListener(
    "scroll",
    function () {
      backToTop.classList.toggle("visible", window.scrollY > 480);
    },
    { passive: true }
  );

  /* Blog filter chips */
  var filterBar = document.querySelector(".filter-bar");
  if (filterBar) {
    var chips = filterBar.querySelectorAll(".chip");
    var cards = document.querySelectorAll("[data-pillar-card]");
    filterBar.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      chips.forEach(function (c) {
        c.classList.remove("active");
      });
      chip.classList.add("active");
      var value = chip.getAttribute("data-filter");
      cards.forEach(function (card) {
        var match = value === "all" || card.getAttribute("data-pillar-card") === value;
        card.style.display = match ? "" : "none";
      });
    });
  }

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
