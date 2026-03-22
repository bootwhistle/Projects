// Controllers/BookController.cs - Full CRUD for Book entities
// All actions require an active login session
// Built on the stub controller from Assignment 2, now connected to BookRepository and Views

using Microsoft.AspNetCore.Mvc;
using SODV1255_A3_SrianFernando.Models;
using SODV1255_A3_SrianFernando.Repositories;

namespace SODV1255_A3_SrianFernando.Controllers
{
    public class BookController : Controller
    {
        // Helper: return true if a user is logged in, false otherwise
        private bool IsLoggedIn() => HttpContext.Session.GetInt32("UserId") != null;

        // ─── INDEX (LIST) ─────────────────────────────────────────────────────

        // GET: /Book - Show all books in a table
        public IActionResult Index()
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");

            var books = BookRepository.GetAll();
            return View(books);
        }

        // ─── DETAILS ──────────────────────────────────────────────────────────

        // GET: /Book/Details/5 - Show read-only details for one book
        public IActionResult Details(int id)
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");

            var book = BookRepository.GetById(id);
            if (book == null) return NotFound();

            return View(book);
        }

        // ─── CREATE ───────────────────────────────────────────────────────────

        // GET: /Book/Create - Show the blank creation form
        public IActionResult Create()
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");
            return View();
        }

        // POST: /Book/Create - Validate and save the new book
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Book book)
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");

            if (!ModelState.IsValid)
                return View(book); // Re-show form with validation errors

            BookRepository.Add(book);
            TempData["Success"] = $"Book \"{book.Title}\" was added successfully.";
            return RedirectToAction(nameof(Index));
        }

        // ─── EDIT ─────────────────────────────────────────────────────────────

        // GET: /Book/Edit/5 - Show the edit form pre-filled with existing data
        public IActionResult Edit(int id)
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");

            var book = BookRepository.GetById(id);
            if (book == null) return NotFound();

            return View(book);
        }

        // POST: /Book/Edit/5 - Validate and save the updated book
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Book book)
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");

            // Ensure the ID in the URL matches the form data to prevent tampering
            if (id != book.Id) return BadRequest();

            if (!ModelState.IsValid)
                return View(book);

            var updated = BookRepository.Update(book);
            if (!updated) return NotFound();

            TempData["Success"] = $"Book \"{book.Title}\" was updated successfully.";
            return RedirectToAction(nameof(Index));
        }

        // ─── DELETE ───────────────────────────────────────────────────────────

        // GET: /Book/Delete/5 - Show confirmation page before deleting
        public IActionResult Delete(int id)
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");

            var book = BookRepository.GetById(id);
            if (book == null) return NotFound();

            return View(book);
        }

        // POST: /Book/Delete/5 - Perform the actual deletion after confirmation
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");

            var book = BookRepository.GetById(id);
            var title = book?.Title ?? "Book";

            BookRepository.Delete(id);
            TempData["Success"] = $"\"{title}\" was deleted.";
            return RedirectToAction(nameof(Index));
        }
    }
}
