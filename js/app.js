/* ============================================================
   PORTFOLIO APP — renders data, UI interactions & motion layer
   - Zero extra dependencies (jQuery + vanilla rAF / IO / WAAPI)
   - Every effect is rAF-throttled, pauses when off-screen,
     and is skipped for prefers-reduced-motion / touch devices
   ============================================================ */
(function ($, w, d) {
  "use strict";

  var DATA = null;
  var root = d.documentElement;
  var mq = function (q) { return !!(w.matchMedia && w.matchMedia(q).matches); };
  var RM = mq("(prefers-reduced-motion: reduce)");
  var FINE = mq("(hover: hover) and (pointer: fine)");
  var raf = w.requestAnimationFrame.bind(w);

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function get(obj, path) { return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, obj); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function toast(msg) {
    var $t = $("#toast").text(msg).addClass("show");
    clearTimeout($t.data("t"));
    $t.data("t", setTimeout(function () { $t.removeClass("show"); }, 3200));
  }
  function chips(list) {
    return $.map(list || [], function (t, i) { return '<span class="chip" style="--i:' + i + '">' + esc(t) + "</span>"; }).join("");
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

  /* ============================================================
     RENDERERS
     ============================================================ */
  function bindText(data) {
    $("[data-bind]").each(function () {
      var v = get(data, $(this).data("bind"));
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
    renderPhoto(p);
  }

  function renderPhoto(p) {
    var $imgs = $("#profilePhoto, #heroAvatar");
    function noPhoto() { $("#portraitWrap").addClass("hidden"); $("#aboutGrid").addClass("no-photo"); $(".badge-av img").remove(); $(".badge-av").addClass("no-img"); }
    if (p.photo === "") { noPhoto(); return; }
    if (p.photo) $imgs.attr("src", p.photo);
    $("#profilePhoto").attr("alt", "Portrait of " + (p.name || ""));
    $imgs.off("error.ph").on("error.ph", noPhoto);
    var img = d.getElementById("profilePhoto");
    if (img) {
      if (img.complete && img.naturalWidth) img.classList.add("loaded");
      else img.addEventListener("load", function () { img.classList.add("loaded"); }, { once: true });
    }
  }

  function renderStats(stats) {
    $("#stats").html($.map(stats || [], function (s) {
      return '<div class="stat spot reveal" data-r="scale"><b class="grad" data-count="' + (+s.value || 0) + '" data-suffix="' + esc(s.suffix) + '">0' + esc(s.suffix) +
        "</b><span>" + esc(s.label) + '</span><i class="bar"></i></div>';
    }).join(""));
  }

  function renderSoft(data) {
    $("#softSkills").html(chips(data.softSkills));
    var emoji = { chess: "♟️", cricket: "🏏" };
    $("#interests").html(data.interests && data.interests.length
      ? "<b>Interests:</b>" + $.map(data.interests, function (i) { return "<span>" + (emoji[String(i).toLowerCase()] || "•") + " " + esc(i) + "</span>"; }).join("")
      : "");
  }

  function renderSkills(skills) {
    skills = skills || [];
    $("#skillFilter").html('<button class="active" data-filter="all">All</button>' +
      $.map(skills, function (s, i) { return '<button data-filter="' + i + '">' + esc(s.category) + "</button>"; }).join(""));
    $("#skillsGrid").html($.map(skills, function (s, i) {
      return '<article class="skill-card spot reveal" data-idx="' + i + '"><h3><span class="sk-ic">' + icon(s.icon) + "</span>" + esc(s.category) +
        '</h3><div class="chips">' + chips(s.items) + "</div></article>";
    }).join(""));
  }

  function renderMarquee(skills) {
    var seen = {}, items = [];
    $.each(skills || [], function (_, s) { $.each(s.items || [], function (_, it) { if (!seen[it]) { seen[it] = 1; items.push(it); } }); });
    if (!items.length) return;
    var half = Math.ceil(items.length / 2);
    function row(list, cls) {
      var html = $.map(list, function (t) { return '<span class="mq-item">' + esc(t) + "</span>"; }).join("");
      return '<div class="mq-row ' + cls + '">' + html + html + "</div>"; // doubled for a seamless -50% loop
    }
    $("#marquee").html(row(items.slice(0, half), "") + row(items.slice(half).concat(items.slice(0, 3)), "rev"));
  }

  function renderExperience(exp) {
    $("#timeline").html($.map(exp || [], function (e) {
      return '<article class="tl-item spot reveal"><div class="tl-top"><div><h3>' + esc(e.role) + '</h3><span class="company">' + esc(e.company) + "</span>" +
        (e.location ? ' <span class="muted small">· ' + esc(e.location) + "</span>" : "") + '</div><span class="period">' + esc(e.period) + '</span></div><ul class="bullets">' +
        $.map(e.highlights || [], function (h, i) { return '<li style="--i:' + i + '">' + esc(h) + "</li>"; }).join("") + "</ul></article>";
    }).join(""));
  }

  function renderProjects(projects) {
    $("#projectsGrid").html($.map(projects || [], function (p, i) {
      return '<article class="project tilt spot reveal"><span class="p-num" aria-hidden="true">' + pad(i + 1) + '</span>' +
        '<div class="p-head"><div><small>' + esc(p.subtitle) + "</small><h3>" + esc(p.name) + '</h3></div><span class="p-icon">' + icon("signal") + "</span></div>" +
        (p.metric ? '<span class="metric">▲ ' + esc(p.metric) + "</span>" : "") +
        "<p>" + esc(p.description) + '</p><div class="chips">' + chips(p.tech) +
        '</div><div class="p-foot"><button class="link-btn" data-project="' + i + '">View details ' + icon("arrow") + "</button>" +
        (p.url ? '<a class="link-btn" href="' + esc(p.url) + '" target="_blank" rel="noopener">Live ↗</a>' : "") + "</div></article>";
    }).join(""));
  }

  function renderAchievements(data) {
    $("#achGrid").html($.map(data.achievements || [], function (a, i) {
      return '<article class="ach spot reveal"><div class="ach-top"><span class="sk-ic">' + icon("trophy") + '</span><span class="num">' + pad(i + 1) + "</span></div><h4>" +
        esc(a.title) + "</h4><p>" + esc(a.text) + "</p></article>";
    }).join(""));
    $("#eduGrid").html($.map(data.education || [], function (e) {
      return '<article class="edu spot reveal"><span class="sk-ic">' + icon("grad") + "</span><div><h4>" + esc(e.degree) + "</h4><p>" + esc(e.institution) + "</p>" +
        (e.period ? '<p class="small">' + esc(e.period) + "</p>" : "") + "</div></article>";
    }).join(""));
  }

  function renderAll(data) {
    DATA = data;
    bindText(data);
    renderProfile(data.profile || {});
    renderStats(data.stats);
    renderSoft(data);
    renderSkills(data.skills);
    renderMarquee(data.skills);
    renderExperience(data.experience);
    renderProjects(data.projects);
    renderAchievements(data);
    startTyping((data.profile && data.profile.roles) || [data.profile.title]);
    observeReveal();
  }

  /* ============================================================
     TEXT EFFECTS
     ============================================================ */
  var typeTimer;
  function startTyping(words) {
    clearTimeout(typeTimer);
    var el = d.getElementById("typed"), wi = 0, ci = 0, del = false;
    if (!el || !words || !words.length) return;
    if (RM) { el.textContent = words[0]; return; }
    (function tick() {
      var word = words[wi];
      ci += del ? -1 : 1;
      el.textContent = word.substring(0, ci);
      var delay = del ? 30 : 60 + Math.random() * 50; // human-ish rhythm
      if (!del && ci === word.length) { del = true; delay = 1700; }
      else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; delay = 380; }
      typeTimer = setTimeout(tick, delay);
    })();
  }

  // Split headings into masked words
  function splitHeadings() {
    $(".split").each(function () {
      var words = $.trim(this.textContent).split(/\s+/);
      this.setAttribute("aria-label", words.join(" "));
      this.innerHTML = $.map(words, function (wd, i) {
        return '<span class="w" aria-hidden="true"><i style="--i:' + i + '">' + esc(wd) + "</i></span>";
      }).join(" ");
    });
  }

  // Decode / scramble effect for eyebrow labels
  var GLYPHS = "!<>-_\\/[]{}=+*^?#01";
  function scramble(el) {
    if (RM || !el || el._scr) return;
    el._scr = true;
    var final = el.textContent, frame = 0, total = final.length * 2 + 14;
    (function tick() {
      var out = "";
      for (var i = 0; i < final.length; i++) {
        out += (frame > i * 1.6 + 8 || final[i] === " ") ? final[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (frame++ < total) raf(tick); else el.textContent = final;
    })();
  }

  /* ============================================================
     SCROLL REVEAL (IntersectionObserver, batch-staggered)
     ============================================================ */
  var io;
  function reveal(el, delayMs) {
    el.style.setProperty("--d", delayMs + "ms");
    el.classList.add("in");
    $(el).find("[data-count]").each(function () { countUp(this, delayMs); });
    var eb = el.querySelector(".eyebrow"); if (eb) setTimeout(function () { scramble(eb); }, delayMs);
    // Once settled, drop the reveal classes so hover/tilt transitions are no longer delayed
    setTimeout(function () { el.classList.remove("reveal", "in"); el.style.removeProperty("--d"); }, 1500 + delayMs);
  }
  function observeReveal() {
    var els = d.querySelectorAll(".reveal:not(.in)");
    if (RM || !("IntersectionObserver" in w)) { [].forEach.call(els, function (el) { reveal(el, 0); }); return; }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        var n = 0;
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          io.unobserve(en.target);
          reveal(en.target, Math.min(n++, 6) * 90); // items entering together cascade
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    }
    [].forEach.call(els, function (el) { io.observe(el); });
  }

  function countUp(el, delay) {
    if (el._done) return; el._done = true;
    var target = +el.getAttribute("data-count"), suffix = el.getAttribute("data-suffix") || "";
    var card = el.closest(".stat");
    if (RM) { el.textContent = target + suffix; if (card) card.classList.add("counted"); return; }
    setTimeout(function () {
      if (card) card.classList.add("counted");
      var start = null, dur = 1800;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1), eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p); // expo-out
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) raf(step);
      }
      raf(step);
    }, delay || 0);
  }

  /* ============================================================
     HERO PARTICLE NETWORK (canvas, paused when hidden)
     ============================================================ */
  var heroFx = { recolor: function () {} };
  var ptr = { x: -9999, y: -9999, target: null, active: false };

  function initHeroCanvas() {
    var c = d.getElementById("heroCanvas");
    if (!c || RM || !c.getContext) return;
    var ctx = c.getContext("2d"), W = 0, H = 0, pts = [], running = false, onScreen = true, rgbA = "99,102,241", rgbB = "34,211,238";
    var LINK = 130, MOUSE = 170;

    function toRgb(hex) {
      hex = hex.replace("#", "");
      if (hex.length === 3) hex = hex.replace(/./g, "$&$&");
      var n = parseInt(hex, 16);
      return isNaN(n) ? null : [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(",");
    }
    heroFx.recolor = function () {
      var cs = getComputedStyle(root);
      rgbA = toRgb(cs.getPropertyValue("--accent").trim()) || rgbA;
      rgbB = toRgb(cs.getPropertyValue("--accent-2").trim()) || rgbB;
    };
    function size() {
      var r = c.getBoundingClientRect(), dpr = Math.min(w.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(clamp((W * H) / 15000, 22, FINE ? 95 : 45));
      pts = [];
      for (var i = 0; i < n; i++) {
        pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.6 + 0.6 });
      }
    }
    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      var rect = c.getBoundingClientRect(), mx = ptr.x - rect.left, my = ptr.y - rect.top, i, j, p, q, dx, dy, dist;
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        dx = p.x - mx; dy = p.y - my; dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE && dist > 0.1) { var f = (1 - dist / MOUSE) * 0.9; p.x += (dx / dist) * f; p.y += (dy / dist) * f; } // gentle repel
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      ctx.lineWidth = 1;
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        for (j = i + 1; j < pts.length; j++) {
          q = pts[j]; dx = p.x - q.x; dy = p.y - q.y;
          if (dx > LINK || dx < -LINK || dy > LINK || dy < -LINK) continue;
          dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK) {
            ctx.strokeStyle = "rgba(" + rgbA + "," + ((1 - dist / LINK) * 0.32).toFixed(3) + ")";
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        dx = p.x - mx; dy = p.y - my; dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE * 1.2) {
          ctx.strokeStyle = "rgba(" + rgbB + "," + ((1 - dist / (MOUSE * 1.2)) * 0.5).toFixed(3) + ")";
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mx, my); ctx.stroke();
        }
        ctx.fillStyle = "rgba(" + rgbA + ",0.85)";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
      raf(frame);
    }
    function sync() {
      var should = onScreen && !d.hidden;
      if (should && !running) { running = true; raf(frame); }
      else if (!should) running = false;
    }
    heroFx.recolor(); size();
    var rt; $(w).on("resize", function () { clearTimeout(rt); rt = setTimeout(size, 180); });
    d.addEventListener("visibilitychange", sync);
    if ("IntersectionObserver" in w) {
      new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; sync(); }).observe(c);
    }
    sync();
  }

  /* ============================================================
     POINTER LAYER: cursor, spotlight, tilt, magnetic, hero parallax
     ============================================================ */
  function initPointer() {
    if (!FINE || RM) return;
    var hero = d.getElementById("home"), ring = d.getElementById("cursor");
    var rx = -100, ry = -100, pending = false, cursorLoop = false, lastMag = null, lastTilt = null, heroOn = true;

    if ("IntersectionObserver" in w) new IntersectionObserver(function (en) { heroOn = en[0].isIntersecting; }).observe(hero);

    function resetMag(el) { el.style.setProperty("--tx", "0px"); el.style.setProperty("--ty", "0px"); }
    function resetTilt(el) { el.classList.remove("tilting"); el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); }

    function frame() {
      pending = false;
      var t = ptr.target, x = ptr.x, y = ptr.y;
      if (!t || !t.closest) return;

      // spotlight + tilt
      var spot = t.closest(".spot");
      if (spot) {
        var r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", (x - r.left) + "px");
        spot.style.setProperty("--my", (y - r.top) + "px");
      }
      var tilt = t.closest(".tilt");
      if (lastTilt && lastTilt !== tilt) resetTilt(lastTilt);
      if (tilt && !tilt.classList.contains("reveal")) {
        var tr = tilt.getBoundingClientRect(), nx = (x - tr.left) / tr.width - 0.5, ny = (y - tr.top) / tr.height - 0.5;
        tilt.classList.add("tilting");
        tilt.style.setProperty("--ry", (nx * 9).toFixed(2) + "deg");
        tilt.style.setProperty("--rx", (-ny * 9).toFixed(2) + "deg");
      }
      lastTilt = tilt;

      // magnetic buttons
      var mag = t.closest(".magnetic");
      if (lastMag && lastMag !== mag) resetMag(lastMag);
      if (mag) {
        var mr = mag.getBoundingClientRect();
        mag.style.setProperty("--tx", ((x - (mr.left + mr.width / 2)) * 0.28).toFixed(1) + "px");
        mag.style.setProperty("--ty", ((y - (mr.top + mr.height / 2)) * 0.38).toFixed(1) + "px");
      }
      lastMag = mag;

      // hero parallax (-0.5 .. 0.5)
      if (heroOn) {
        hero.style.setProperty("--px", (x / w.innerWidth - 0.5).toFixed(3));
        hero.style.setProperty("--py", (y / w.innerHeight - 0.5).toFixed(3));
      }

      // cursor state
      if (ring) {
        ring.classList.toggle("text", !!t.closest("input, textarea"));
        ring.classList.toggle("hover", !t.closest("input, textarea") && !!t.closest("a, button, .chip, .mq-item, [data-cursor]"));
      }
    }

    function cursorFrame() {
      rx += (ptr.x - rx) * 0.2; ry += (ptr.y - ry) * 0.2;
      ring.style.transform = "translate3d(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px,0)";
      if (Math.abs(ptr.x - rx) > 0.1 || Math.abs(ptr.y - ry) > 0.1) raf(cursorFrame); else cursorLoop = false;
    }

    d.addEventListener("pointermove", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      ptr.x = e.clientX; ptr.y = e.clientY; ptr.target = e.target;
      if (!ptr.active) { ptr.active = true; if (ring) { rx = ptr.x; ry = ptr.y; ring.classList.add("on"); } }
      if (!pending) { pending = true; raf(frame); }
      if (ring && !cursorLoop) { cursorLoop = true; raf(cursorFrame); }
    }, { passive: true });
    d.addEventListener("pointerdown", function () { if (ring) ring.classList.add("down"); }, { passive: true });
    d.addEventListener("pointerup", function () { if (ring) ring.classList.remove("down"); }, { passive: true });
    d.documentElement.addEventListener("mouseleave", function () {
      ptr.active = false; ptr.x = ptr.y = -9999;
      if (ring) ring.classList.remove("on");
      if (lastMag) resetMag(lastMag); if (lastTilt) resetTilt(lastTilt);
      lastMag = lastTilt = null;
    });
  }

  // Button ripple (works on touch too)
  function initRipple() {
    if (RM) return;
    $(d).on("pointerdown", ".btn", function (e) {
      var r = this.getBoundingClientRect(), s = d.createElement("span");
      s.className = "ripple";
      s.style.left = (e.clientX - r.left) + "px"; s.style.top = (e.clientY - r.top) + "px";
      this.appendChild(s);
      s.addEventListener("animationend", function () { s.remove(); });
    });
  }

  /* ============================================================
     NAV: sliding pill, active section, hide-on-scroll
     ============================================================ */
  var nav = {};
  function initNav() {
    var ul = d.getElementById("navLinks"), pill = ul.querySelector(".nav-pill"), links = ul.querySelectorAll("a");
    nav.active = null;
    nav.move = function (a) {
      if (!a || w.innerWidth <= 960) { pill.style.opacity = 0; return; }
      pill.style.opacity = 1;
      pill.style.width = a.offsetWidth + "px";
      pill.style.height = a.offsetHeight + "px";
      pill.style.transform = "translate(" + a.offsetLeft + "px," + a.offsetTop + "px)";
    };
    nav.set = function (id) {
      var a = id ? ul.querySelector('a[href="#' + id + '"]') : null;
      [].forEach.call(links, function (l) { l.classList.toggle("active", l === a); });
      nav.active = a; nav.move(a);
    };
    $(ul).on("mouseenter", "a", function () { nav.move(this); }).on("mouseleave", function () { nav.move(nav.active); });

    if ("IntersectionObserver" in w) {
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) nav.set(en.target.id === "home" ? null : en.target.id); });
      }, { rootMargin: "-45% 0px -54% 0px" });
      $("main section[id]").each(function () { sio.observe(this); });
    }
    var rt; $(w).on("resize", function () { clearTimeout(rt); rt = setTimeout(function () { nav.move(nav.active); }, 120); });
  }

  /* ============================================================
     SCROLL LOOP (single rAF-throttled handler)
     ============================================================ */
  function initScroll() {
    var navbar = d.getElementById("navbar"), top = d.getElementById("toTop"), prog = d.getElementById("progress");
    var ringC = top.querySelector(".ring circle"), hero = d.getElementById("home");
    var tlWrap = d.getElementById("timelineWrap"), tlBar = d.getElementById("tlProgress");
    var lastY = w.scrollY || 0, ticking = false;

    function onScroll() {
      ticking = false;
      var y = w.scrollY || w.pageYOffset, vh = w.innerHeight, h = root.scrollHeight - vh, p = h > 0 ? y / h : 0;
      prog.style.transform = "scaleX(" + p.toFixed(4) + ")";
      ringC.style.strokeDashoffset = (100 - p * 100).toFixed(2);
      navbar.classList.toggle("scrolled", y > 20);
      var menuOpen = d.getElementById("navLinks").classList.contains("open");
      if (Math.abs(y - lastY) > 6) { navbar.classList.toggle("nav-hide", y > lastY && y > 400 && !menuOpen && !RM); lastY = y; }
      top.classList.toggle("show", y > 600);

      if (!RM && y < vh * 1.1) hero.style.setProperty("--sy", y.toFixed(0));

      // timeline draws itself as you scroll
      if (tlWrap) {
        var r = tlWrap.getBoundingClientRect(), mark = vh * 0.62;
        if (r.top < vh && r.bottom > 0) {
          tlBar.style.transform = "scaleY(" + clamp((mark - r.top) / r.height, 0, 1).toFixed(4) + ")";
          $(".tl-item").each(function () { this.classList.toggle("lit", this.getBoundingClientRect().top < mark); });
        }
      }
    }
    w.addEventListener("scroll", function () { if (!ticking) { ticking = true; raf(onScroll); } }, { passive: true });
    $(w).on("resize", onScroll);
    onScroll();
    nav.refreshScroll = onScroll;
  }

  /* ============================================================
     UI EVENTS
     ============================================================ */
  function bindUI() {
    // mobile menu
    function setMenu(open) {
      $("#menuToggle").toggleClass("open", open).attr("aria-expanded", open);
      $("#navLinks").toggleClass("open", open);
    }
    $("#menuToggle").on("click", function () { setMenu(!$(this).hasClass("open")); });
    $("#navLinks").on("click", "a", function () { setMenu(false); });

    // theme (circular view-transition reveal from the toggle)
    $("#themeToggle").on("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      function apply() {
        root.setAttribute("data-theme", next);
        $('meta[name="theme-color"]').attr("content", next === "dark" ? "#0b0f1a" : "#f7f8fc");
        try { localStorage.setItem("theme", next); } catch (e) {}
        heroFx.recolor();
      }
      if (!d.startViewTransition || RM) { apply(); return; }
      var r = this.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      var rad = Math.hypot(Math.max(x, w.innerWidth - x), Math.max(y, w.innerHeight - y));
      root.classList.add("vt");
      var t = d.startViewTransition(apply);
      t.ready.then(function () {
        root.animate({ clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + rad + "px at " + x + "px " + y + "px)"] },
          { duration: 700, easing: "cubic-bezier(.22,1,.36,1)", pseudoElement: "::view-transition-new(root)" });
      }).catch(function () {});
      t.finished.then(function () { root.classList.remove("vt"); }, function () { root.classList.remove("vt"); });
    });

    $("#toTop").on("click", function () { w.scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" }); });

    // skill filter with FLIP layout animation
    $("#skillFilter").on("click", "button", function () {
      var f = String($(this).data("filter"));
      $(this).addClass("active").siblings().removeClass("active");
      flipFilter(f);
    });

    // project modal
    $("#projectsGrid").on("click", "[data-project]", function (e) { openModal(DATA.projects[$(this).data("project")], e); });
    $("#projectModal").on("click", "[data-close]", closeModal);
    $(d).on("keydown", function (e) {
      if (!$("#projectModal").hasClass("open")) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "Tab") trapFocus(e);
    });

    // contact form
    $("#contactForm").on("submit", onSubmit);
    $("#contactForm").on("input", "input, textarea", function () { $(this).closest(".field").removeClass("error").find("em").text(""); });

    $("#year").text(new Date().getFullYear());
  }

  function flipFilter(f) {
    var cards = d.querySelectorAll(".skill-card"), first = [];
    [].forEach.call(cards, function (c, i) { first[i] = c.classList.contains("hidden") ? null : c.getBoundingClientRect(); });
    [].forEach.call(cards, function (c) { c.classList.toggle("hidden", !(f === "all" || c.getAttribute("data-idx") === f)); });
    if (RM || !cards.length || !cards[0].animate) return;
    var n = 0;
    [].forEach.call(cards, function (c, i) {
      if (c.classList.contains("hidden")) return;
      var last = c.getBoundingClientRect(), f0 = first[i];
      if (f0) {
        var dx = f0.left - last.left, dy = f0.top - last.top;
        if (dx || dy) c.animate([{ transform: "translate(" + dx + "px," + dy + "px)" }, { transform: "none" }], { duration: 600, easing: "cubic-bezier(.22,1,.36,1)" });
      } else {
        c.animate([{ opacity: 0, transform: "scale(.92) translateY(16px)" }, { opacity: 1, transform: "none" }],
          { duration: 550, delay: n++ * 50, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" });
      }
    });
  }

  var lastFocus = null;
  function openModal(p, e) {
    if (!p) return;
    lastFocus = d.activeElement;
    $("#mSub").text(p.subtitle); $("#mTitle").text(p.name); $("#mDesc").text(p.description);
    $("#mTech").html(chips(p.tech));
    $("#mList").html($.map(p.highlights || [], function (h, i) { return '<li style="--i:' + i + '">' + esc(h) + "</li>"; }).join(""));
    $("#mLink").toggleClass("hidden", !p.url).attr("href", p.url || "#");
    // scale out of the click point
    var box = d.querySelector(".modal-box");
    if (e && e.clientX) {
      var bw = box.offsetWidth, bh = box.offsetHeight;
      box.style.transformOrigin = (e.clientX - (w.innerWidth - bw) / 2) + "px " + (e.clientY - (w.innerHeight - bh) / 2) + "px";
    }
    box.scrollTop = 0;
    var sb = w.innerWidth - root.clientWidth; // prevent layout shift from the scrollbar
    $("body").css("padding-right", sb > 0 ? sb + "px" : "").addClass("no-scroll");
    $("#projectModal").addClass("open").attr("aria-hidden", "false");
    setTimeout(function () { $(".modal-close").trigger("focus"); }, 60);
  }
  function closeModal() {
    $("#projectModal").removeClass("open").attr("aria-hidden", "true");
    $("body").removeClass("no-scroll").css("padding-right", "");
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function trapFocus(e) {
    var f = $("#projectModal").find("a:visible, button:visible").get();
    if (!f.length) return;
    var a = f[0], z = f[f.length - 1];
    if (e.shiftKey && d.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && d.activeElement === z) { e.preventDefault(); a.focus(); }
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
    function err(id, msg) {
      ok = false;
      var $fl = $("#" + id).closest(".field").removeClass("error");
      void $fl[0].offsetWidth; // restart shake animation
      $fl.addClass("error").find("em").text(msg);
    }
    if (payload.name.length < 2) err("fName", "Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email)) err("fEmail", "Please enter a valid email.");
    if (payload.subject.length < 3) err("fSubject", "Please add a subject.");
    if (payload.message.length < 10) err("fMessage", "Message should be at least 10 characters.");
    if (!ok) { $f.find(".field.error").first().find("input, textarea").trigger("focus"); return; }

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

  /* ============================================================
     BOOT
     ============================================================ */
  function ready() {
    $("#loader").addClass("done");
    setTimeout(function () { root.classList.add("is-ready"); }, RM ? 0 : 250);
  }

  $(function () {
    splitHeadings();
    initNav();
    bindUI();
    initScroll();
    initPointer();
    initRipple();
    initHeroCanvas();

    var fontsReady = (d.fonts && d.fonts.ready) ? d.fonts.ready : $.Deferred().resolve().promise();
    var fontGate = new Promise(function (res) { Promise.resolve(fontsReady).then(res, res); setTimeout(res, 1200); });

    w.PortfolioApi.getPortfolio()
      .done(function (r) {
        renderAll(r.data);
        $("#dataSource").text(r.source === "api" ? "Live data · " + w.PortfolioApi.baseUrl() : "");
        if (r.error && w.PortfolioApi.hasApi()) toast("API unreachable — showing saved profile data.");
        if (nav.refreshScroll) nav.refreshScroll();
      })
      .fail(function () { toast("Unable to load portfolio data."); })
      .always(function () { fontGate.then(ready); });
  });
})(jQuery, window, document);
