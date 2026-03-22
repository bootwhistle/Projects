// Controllers/AccountController.cs - Handles user authentication
// Actions: Login (GET/POST), Register (GET/POST), Logout
// Uses session to store the logged-in user's ID and name

using Microsoft.AspNetCore.Mvc;
using SODV1255_A3_SrianFernando.Models;
using SODV1255_A3_SrianFernando.Repositories;

namespace SODV1255_A3_SrianFernando.Controllers
{
    public class AccountController : Controller
    {
        // ─── LOGIN ────────────────────────────────────────────────────────────

        // GET: /Account/Login - Show the login form
        [HttpGet]
        public IActionResult Login()
        {
            // If already logged in, redirect straight to the dashboard
            if (HttpContext.Session.GetInt32("UserId") != null)
                return RedirectToAction("Index", "Dashboard");

            return View();
        }

        // POST: /Account/Login - Validate credentials and start a session
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Login(LoginViewModel model)
        {
            if (!ModelState.IsValid)
                return View(model); // Re-display form with validation errors

            // Check credentials against the user repository
            var user = UserRepository.Authenticate(model.Email!, model.Password!);

            if (user == null)
            {
                // Invalid credentials - add a model-level error and redisplay
                ModelState.AddModelError(string.Empty, "Invalid email or password.");
                return View(model);
            }

            // Store user ID and name in session to track who is logged in
            HttpContext.Session.SetInt32("UserId", user.Id);
            HttpContext.Session.SetString("UserName", user.FullName ?? "User");

            return RedirectToAction("Index", "Dashboard");
        }

        // ─── REGISTER ─────────────────────────────────────────────────────────

        // GET: /Account/Register - Show the registration form
        [HttpGet]
        public IActionResult Register()
        {
            // Already logged in users don't need to register again
            if (HttpContext.Session.GetInt32("UserId") != null)
                return RedirectToAction("Index", "Dashboard");

            return View();
        }

        // POST: /Account/Register - Create a new user account
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Register(RegisterViewModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            // Prevent duplicate email registrations
            if (UserRepository.EmailExists(model.Email!))
            {
                ModelState.AddModelError("Email", "An account with this email already exists.");
                return View(model);
            }

            // Create the new user and store in repository
            var newUser = new User
            {
                FullName = model.FullName,
                Email = model.Email,
                Password = model.Password  // Plain-text for demo; hash in production
            };

            UserRepository.Add(newUser);

            // Automatically log in after successful registration
            HttpContext.Session.SetInt32("UserId", newUser.Id);
            HttpContext.Session.SetString("UserName", newUser.FullName ?? "User");

            return RedirectToAction("Index", "Dashboard");
        }

        // ─── LOGOUT ───────────────────────────────────────────────────────────

        // POST: /Account/Logout - Clear session and redirect to login
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear(); // Remove all session data
            return RedirectToAction("Login", "Account");
        }
    }
}
