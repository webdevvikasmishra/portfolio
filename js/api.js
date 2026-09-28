/* ============================================================
   API SERVICE — talks to your ASP.NET Core backend.
   Falls back to window.PORTFOLIO_DATA when no API is configured
   or the API call fails (if FALLBACK_TO_LOCAL_DATA is true).
   ============================================================ */
(function ($, w) {
  "use strict";

  var cfg = w.PORTFOLIO_CONFIG || {};
  var raw = cfg.API_BASE_URL || "";
  // Allow ?api=https://my-api.com in the URL to override config without editing files
  try {
    var q = new URLSearchParams(w.location.search).get("api");
    if (q) raw = q;
  } catch (e) {}
  // "/" = same origin (portfolio hosted inside the API's wwwroot)
  var useApi = !!raw;
  var base = raw.replace(/\/+$/, "");

  function url(path) { return base + path; }

  function request(method, path, body) {
    return $.ajax({
      url: url(path),
      method: method,
      timeout: cfg.REQUEST_TIMEOUT_MS || 8000,
      dataType: "json",
      contentType: body ? "application/json; charset=utf-8" : undefined,
      data: body ? JSON.stringify(body) : undefined,
      headers: { Accept: "application/json" }
    });
  }

  // Accepts either the raw object or a wrapped { data: {...} } / { result: {...} } response
  function unwrap(res) {
    if (res && typeof res === "object") {
      if (res.data && res.data.profile) return res.data;
      if (res.result && res.result.profile) return res.result;
    }
    return res;
  }

  w.PortfolioApi = {
    hasApi: function () { return useApi; },
    baseUrl: function () { return base || w.location.origin; },

    /** Returns a jQuery promise resolving to { data, source: "api" | "local" } */
    getPortfolio: function () {
      var d = $.Deferred();
      var local = w.PORTFOLIO_DATA;

      if (!useApi) { d.resolve({ data: local, source: "local" }); return d.promise(); }

      request("GET", cfg.PORTFOLIO_ENDPOINT || "/api/portfolio")
        .done(function (res) {
          var data = unwrap(res);
          if (data && data.profile) d.resolve({ data: data, source: "api" });
          else if (cfg.FALLBACK_TO_LOCAL_DATA) d.resolve({ data: local, source: "local", error: "Invalid API response" });
          else d.reject("Invalid API response");
        })
        .fail(function (xhr, status) {
          console.warn("[Portfolio] API unavailable (" + status + "), using local data.");
          if (cfg.FALLBACK_TO_LOCAL_DATA && local) d.resolve({ data: local, source: "local", error: status });
          else d.reject(status);
        });
      return d.promise();
    },

    /** POST contact message. Without an API, opens the user's mail client instead. */
    sendContact: function (payload, fallbackEmail) {
      var d = $.Deferred();
      if (!useApi) {
        var mail = "mailto:" + encodeURIComponent(fallbackEmail || "") +
          "?subject=" + encodeURIComponent(payload.subject) +
          "&body=" + encodeURIComponent(payload.message + "\n\n— " + payload.name + " (" + payload.email + ")");
        w.location.href = mail;
        d.resolve({ mode: "mailto" });
        return d.promise();
      }
      request("POST", cfg.CONTACT_ENDPOINT || "/api/contact", payload)
        .done(function (res) { d.resolve({ mode: "api", res: res }); })
        .fail(function (xhr) {
          var msg = (xhr.responseJSON && (xhr.responseJSON.message || xhr.responseJSON.title)) || "Could not send message. Please try again.";
          d.reject(msg);
        });
      return d.promise();
    }
  };
})(jQuery, window);
