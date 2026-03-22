// Program.cs - Application entry point and service configuration
// Configures MVC, session-based authentication, and routing for the LMS

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Add MVC services with Views support
builder.Services.AddControllersWithViews();

// Add session services for simple authentication
// Sessions expire after 30 minutes of inactivity
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;   // Prevent JavaScript access to session cookie
    options.Cookie.IsEssential = true; // Required even without cookie consent
});

// Add HttpContextAccessor so we can access session in views via ViewImports
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

// Configure the HTTP request pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Dashboard/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles(); // Serve wwwroot files (CSS, JS, images)

app.UseRouting();

// Enable session middleware - must be before MapControllerRoute
app.UseSession();

// Default route: Dashboard/Index requires login; Account/Login is the fallback
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Dashboard}/{action=Index}/{id?}");

app.Run();
