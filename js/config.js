/* ============================================================
   PORTFOLIO CONFIG — the only file you need to edit.
   ------------------------------------------------------------
   API_BASE_URL:
     ""                          -> uses built-in data (js/data.js), no API needed
     "https://localhost:7001"    -> calls your ASP.NET Core API
     "/"                         -> same origin (site copied into the API's wwwroot)
   Endpoints expected (see README.md):
     GET  {API_BASE_URL}/api/portfolio   -> full portfolio JSON
     POST {API_BASE_URL}/api/contact     -> { name, email, subject, message }
   ============================================================ */
window.PORTFOLIO_CONFIG = {
  API_BASE_URL: "",
  PORTFOLIO_ENDPOINT: "/api/portfolio",
  CONTACT_ENDPOINT: "/api/contact",
  REQUEST_TIMEOUT_MS: 8000,
  // If the API is down, fall back to js/data.js so the site never breaks
  FALLBACK_TO_LOCAL_DATA: true
};
