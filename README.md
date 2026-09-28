# Vikas Kumar Mishra — Portfolio

HTML + CSS + jQuery. No build step, no framework. Open `index.html` and it runs.

```
portfolio/
├── index.html
├── css/style.css
├── js/
│   ├── config.js          <- ONLY file you edit (API URL)
│   ├── api.js             <- AJAX service layer
│   ├── app.js             <- rendering + UI
│   ├── data.js            <- built-in data (used when no API)
│   └── jquery-3.7.1.min.js  (offline fallback if CDN fails)
└── data/portfolio.json    <- same data, use it to seed your API/DB
```

## Run

- **No API:** double-click `index.html`. Everything works from `js/data.js`. The contact form opens the visitor's email app.
- **With API:** set the URL in `js/config.js`:

```js
API_BASE_URL: "https://localhost:7001"
```

- **Without editing any file:** add `?api=` to the address bar:
  `index.html?api=https://localhost:7001`

If the API is down, the site automatically falls back to local data (`FALLBACK_TO_LOCAL_DATA: true`).

## API contract (ASP.NET Core)

| Method | Route            | Body / Response |
|--------|------------------|-----------------|
| GET    | `/api/portfolio` | Returns the object in `data/portfolio.json` (camelCase — ASP.NET Core default). A wrapper `{ "data": {...} }` also works. |
| POST   | `/api/contact`   | Body `{ name, email, subject, message }` → return `200 OK`. On error return `{ "message": "..." }`. |

### Minimal starting point

```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddCors(o => o.AddPolicy("site", p => p
    .WithOrigins("http://127.0.0.1:5500", "https://your-portfolio-domain.com")
    .AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
app.UseCors("site");
app.UseDefaultFiles();   // optional: serve this portfolio from wwwroot/
app.UseStaticFiles();
app.MapControllers();
app.Run();
```

```csharp
[ApiController]
[Route("api")]
public class PortfolioController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    public PortfolioController(IWebHostEnvironment env) => _env = env;

    [HttpGet("portfolio")]
    public IActionResult Get()
    {
        // Swap this for EF Core / a service later
        var json = System.IO.File.ReadAllText(Path.Combine(_env.ContentRootPath, "portfolio.json"));
        return Content(json, "application/json");
    }

    [HttpPost("contact")]
    public IActionResult Contact([FromBody] ContactRequest req)
    {
        if (!ModelState.IsValid) return BadRequest(new { message = "Invalid input." });
        // TODO: save to SQL Server / send email
        return Ok(new { message = "Sent" });
    }
}

public record ContactRequest(
    [property: Required, StringLength(100, MinimumLength = 2)] string Name,
    [property: Required, EmailAddress] string Email,
    [property: Required, StringLength(150)] string Subject,
    [property: Required, StringLength(2000, MinimumLength = 10)] string Message);
```

**Same-origin hosting:** copy this folder's contents into the API project's `wwwroot/` and set `API_BASE_URL: "/"`. No CORS needed.

## Editing content

Change `data/portfolio.json` (for the API) or `js/data.js` (for offline mode). Optional fields: `profile.resumeUrl` (shows a "Download CV" button), `projects[].url` (shows a "Live" link), `education[].period`.
