/* ============================================================
   PORTFOLIO APP — renders data & handles UI interactions
   ============================================================ */
(function ($, w) {
  "use strict";

  var DATA = null;

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function get(obj, path) {
    return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, obj);
  }
  function toast(msg) {
    var $t = $("#toast").text(msg).addClass("show");
    clearTimeout($t.data("t"));
    $t.data("t", setTimeout(function () { $t.removeClass("show"); }, 3200));
  }

  var ICONS = {
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    server: '<rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 7h.01M6 17h.01"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7l10-5z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    cloud: '<path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.8A6 6 0 1 0 6 17.7"/><path d="M6 19h11.5"/>',
    check: '<path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><path d="m22 4-10 10-3-3"/>',
    refresh: '<path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/>',
    grad: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    signal: '<path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16"/>',
    arrow: '<path d="M5 12h14M13 5l7 7-7 7"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>'
  };
  function icon(name) { return '<svg viewBox="0 0 24 24">' + (ICONS[name] || ICONS.code) + "</svg>"; }

  /* ---------- renderers ---------- */
  function bindText(d) {
    $("[data-bind]").each(function () {
      var v = get(d, $(this).data("bind"));
      if (v != null) $(this).text(v);
    });
  }

  function renderProfile(p) {
    document.title = p.name + " | " + p.title;
    $("#heroEmail, #cEmail").attr("href", "mailto:" + p.email);
    $("#cPhone").attr("href", "tel:" + String(p.phone || "").replace(/[^\d+]/g, ""));
    $("#heroLinkedin, #cLinkedin").attr("href", p.linkedin);
    $("#cLinkedinText").text(String(p.linkedin || "").replace(/^https?:\/\/(www\.)?/, ""));
    $("#availBadge").toggle(p.available !== false);
    if (p.resumeUrl) $("#resumeBtn").attr("href", p.resumeUrl).removeClass("hidden");
    if (!p.phone) $("#cPhone").addClass("hidden");
  }

  function renderStats(stats) {
    $("#stats").html($.map(stats || [], function (s) {
      return '<div class="stat"><b class="grad" data-count="' + (+s.value || 0) + '" data-suffix="' + esc(s.suffix) + '">0' + esc(s.suffix) + "</b><span>" + esc(s.label) + "</span></div>";
    }).join(""));
  }

  function renderSoft(d) {
    $("#softSkills").html($.map(d.softSkills || [], function (s) { return '<span class="chip">' + esc(s) + "</span>"; }).join(""));
    var emoji = { chess: "♟️", cricket: "🏏" };
    $("#interests").html(d.interests && d.interests.length
      ? "<b>Interests:</b>" + $.map(d.interests, function (i) { return "<span>" + (emoji[String(i).toLowerCase()] || "•") + " " + esc(i) + "</span>"; }).join("")
      : "");
  }

  function renderSkills(skills) {
    skills = skills || [];
    var filters = '<button class="active" data-filter="all">All</button>' +
      $.map(skills, function (s, i) { return '<button data-filter="' + i + '">' + esc(s.category) + "</button>"; }).join("");
    $("#skillFilter").html(filters);
    $("#skillsGrid").html($.map(skills, function (s, i) {
      return '<article class="skill-card reveal" data-idx="' + i + '"><h3><span class="sk-ic">' + icon(s.icon) + "</span>" + esc(s.category) + '</h3><div class="chips">' +
        $.map(s.items || [], function (it) { return '<span class="chip">' + esc(it) + "</span>"; }).join("") + "</div></article>";
    }).join(""));
  }

  function renderExperience(exp) {
    $("#timeline").html($.map(exp || [], function (e) {
      return '<article class="tl-item reveal"><div class="tl-top"><div><h3>' + esc(e.role) + '</h3><span class="company">' + esc(e.company) + "</span>" +
        (e.location ? ' <span class="muted small">· ' + esc(e.location) + "</span>" : "") + '</div><span class="period">' + esc(e.period) + '</span></div><ul class="bullets">' +
        $.map(e.highlights || [], function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul></article>";
    }).join(""));
  }

  function renderProjects(projects) {
    $("#projectsGrid").html($.map(projects || [], function (p, i) {
      return '<article class="project reveal"><div class="p-head"><div><small>' + esc(p.subtitle) + "</small><h3>" + esc(p.name) + '</h3></div><span class="p-icon">' + icon("signal") + "</span></div>" +
        (p.metric ? '<span class="metric">▲ ' + esc(p.metric) + "</span>" : "") +
        "<p>" + esc(p.description) + '</p><div class="chips">' +
        $.map(p.tech || [], function (t) { return '<span class="chip">' + esc(t) + "</span>"; }).join("") +
        '</div><div class="p-foot"><button class="link-btn" data-project="' + i + '">View details ' + icon("arrow") + "</button>" +
        (p.url ? '<a class="link-btn" href="' + esc(p.url) + '" target="_blank" rel="noopener">Live ↗</a>' : "") + "</div></article>";
    }).join(""));
  }

  function renderAchievements(d) {
    $("#achGrid").html($.map(d.achievements || [], function (a, i) {
      return '<article class="ach reveal"><span class="sk-ic">' + icon("trophy") + '</span><h4>' + esc(a.title) + "</h4><p>" + esc(a.text) + "</p></article>";
    }).join(""));
    $("#eduGrid").html($.map(d.education || [], function (e) {
      return '<article class="edu reveal"><span class="sk-ic">' + icon("grad") + "</span><div><h4>" + esc(e.degree) + "</h4><p>" + esc(e.institution) + "</p>" +
        (e.period ? '<p class="small">' + esc(e.period) + "</p>" : "") + "</div></article>";
    }).join(""));
  }

  function renderAll(d) {
    DATA = d;
    bindText(d);
    renderProfile(d.profile || {});
    renderStats(d.stats);
    renderSoft(d);
    renderSkills(d.skills);
    renderExperience(d.experience);
    renderProjects(d.projects);
    renderAchievements(d);
    startTyping((d.profile && d.profile.roles) || [d.profile.title]);
    observeReveal();
  }

  /* ---------- typing effect ---------- */
  var typeTimer;
  function startTyping(words) {
    clearTimeout(typeTimer);
    var $el = $("#typed"), wi = 0, ci = 0, del = false;
    if (!words.length) return;
    (function tick() {
      var word = words[wi];
      ci += del ? -1 : 1;
      $el.text(word.substring(0, ci));
      var delay = del ? 35 : 75;
      if (!del && ci === word.length) { del = true; delay = 1600; }
      else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; delay = 350; }
      typeTimer = setTimeout(tick, delay);
    })();
  }

  /* ---------- reveal + counters (IntersectionObserver = fast) ---------- */
  var io;
  function observeReveal() {
    var $els = $(".reveal:not(.in)");
    if (!("IntersectionObserver" in w)) { $els.addClass("in"); $("[data-count]").each(function () { countUp(this); }); return; }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var $t = $(en.target).addClass("in");
          $t.find("[data-count]").addBack("[data-count]").each(function () { countUp(this); });
          io.unobserve(en.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    }
    $els.each(function (i) {
      // small stagger for grid items
      this.style.transitionDelay = ((i % 3) * 70) + "ms";
      io.observe(this);
    });
  }
  function countUp(el) {
    if (el._done) return; el._done = true;
    var target = +el.getAttribute("data-count"), suffix = el.getAttribute("data-suffix") || "";
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) w.requestAnimationFrame(step);
    }
    w.requestAnimationFrame(step);
  }

  /* ---------- UI events ---------- */
  function bindUI() {
    var $nav = $("#navbar"), $top = $("#toTop"), $prog = $("#progress");
    var $sections = $("main section[id]"), $links = $(".nav-links a");
    var ticking = false;

    function onScroll() {
      var y = w.scrollY || w.pageYOffset, h = document.documentElement.scrollHeight - w.innerHeight;
      $nav.toggleClass("scrolled", y > 20);
      $top.toggleClass("show", y > 600);
      $prog.css("width", (h > 0 ? (y / h) * 100 : 0) + "%");
      var current = "";
      $sections.each(function () { if (y >= this.offsetTop - 120) current = this.id; });
      $links.removeClass("active").filter('[href="#' + current + '"]').addClass("active");
      ticking = false;
    }
    $(w).on("scroll", function () { if (!ticking) { w.requestAnimationFrame(onScroll); ticking = true; } });
    onScroll();

    // mobile menu
    $("#menuToggle").on("click", function () { $(this).toggleClass("open"); $("#navLinks").toggleClass("open"); });
    $links.on("click", function () { $("#menuToggle").removeClass("open"); $("#navLinks").removeClass("open"); });

    // theme
    $("#themeToggle").on("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      $('meta[name="theme-color"]').attr("content", next === "dark" ? "#0b0f1a" : "#f7f8fc");
      try { localStorage.setItem("theme", next); } catch (e) {}
    });

    $top.on("click", function () { w.scrollTo({ top: 0, behavior: "smooth" }); });

    // skill filter
    $("#skillFilter").on("click", "button", function () {
      var f = $(this).data("filter");
      $(this).addClass("active").siblings().removeClass("active");
      $(".skill-card").each(function () {
        var show = f === "all" || String($(this).data("idx")) === String(f);
        $(this).toggleClass("hidden", !show);
      });
    });

    // project modal
    $("#projectsGrid").on("click", "[data-project]", function () { openModal(DATA.projects[$(this).data("project")]); });
    $("#projectModal").on("click", "[data-close]", closeModal);
    $(document).on("keydown", function (e) { if (e.key === "Escape") closeModal(); });

    // contact form
    $("#contactForm").on("submit", onSubmit);
    $("#contactForm").on("input", "input, textarea", function () { $(this).closest(".field").removeClass("error").find("em").text(""); });

    $("#year").text(new Date().getFullYear());
  }

  function openModal(p) {
    if (!p) return;
    $("#mSub").text(p.subtitle); $("#mTitle").text(p.name); $("#mDesc").text(p.description);
    $("#mTech").html($.map(p.tech || [], function (t) { return '<span class="chip">' + esc(t) + "</span>"; }).join(""));
    $("#mList").html($.map(p.highlights || [], function (h) { return "<li>" + esc(h) + "</li>"; }).join(""));
    $("#mLink").toggleClass("hidden", !p.url).attr("href", p.url || "#");
    $("#projectModal").addClass("open").attr("aria-hidden", "false");
    $("body").addClass("no-scroll");
  }
  function closeModal() {
    $("#projectModal").removeClass("open").attr("aria-hidden", "true");
    $("body").removeClass("no-scroll");
  }

  function onSubmit(e) {
    e.preventDefault();
    var $f = $(this), ok = true;
    var payload = {
      name: $.trim($("#fName").val()),
      email: $.trim($("#fEmail").val()),
      subject: $.trim($("#fSubject").val()),
      message: $.trim($("#fMessage").val())
    };
    function err(id, msg) { ok = false; $("#" + id).closest(".field").addClass("error").find("em").text(msg); }
    if (payload.name.length < 2) err("fName", "Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email)) err("fEmail", "Please enter a valid email.");
    if (payload.subject.length < 3) err("fSubject", "Please add a subject.");
    if (payload.message.length < 10) err("fMessage", "Message should be at least 10 characters.");
    if (!ok) return;

    var $btn = $("#sendBtn").addClass("loading").prop("disabled", true);
    var $st = $("#formStatus").removeClass("ok err").text("");
    w.PortfolioApi.sendContact(payload, DATA && DATA.profile && DATA.profile.email)
      .done(function (r) {
        $st.addClass("ok").text(r.mode === "mailto" ? "Opening your email app…" : "Thanks! Your message has been sent.");
        if (r.mode === "api") $f[0].reset();
      })
      .fail(function (msg) { $st.addClass("err").text(msg); })
      .always(function () { $btn.removeClass("loading").prop("disabled", false); });
  }

  /* ---------- boot ---------- */
  $(function () {
    bindUI();
    w.PortfolioApi.getPortfolio()
      .done(function (r) {
        renderAll(r.data);
        $("#dataSource").text(r.source === "api" ? "Live data · " + w.PortfolioApi.baseUrl() : "");
        if (r.error && w.PortfolioApi.hasApi()) toast("API unreachable — showing saved profile data.");
      })
      .fail(function () { toast("Unable to load portfolio data."); })
      .always(function () { $("#loader").addClass("done"); });
  });
})(jQuery, window);
