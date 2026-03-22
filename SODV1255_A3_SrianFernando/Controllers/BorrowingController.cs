// Controllers/BorrowingController.cs - Full CRUD for Borrowing records
// Borrowings link a Reader to a Book; the Create form shows dropdowns for both
// When a borrowing is created, the book's IsAvailable flag is set to false
// When a return date is recorded, the book becomes available again

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using SODV1255_A3_SrianFernando.Models;
using SODV1255_A3_SrianFernando.Repositories;

namespace SODV1255_A3_SrianFernando.Controllers
{
    public class BorrowingController : Controller
    {
        private bool IsLoggedIn() => HttpContext.Session.GetInt32("UserId") != null;

        // Helper: Build SelectList for books that are currently available
        // Used by Create and Edit forms so staff only see borrowable books
        private SelectList GetAvailableBooksSelectList(int? selectedId = null)
        {
            var availableBooks = BookRepository.GetAll()
                .Where(b => b.IsAvailable)
                .Select(b => new { b.Id, Display = $"{b.Title} ({b.Author})" })
                .ToList();

            return new SelectList(availableBooks, "Id", "Display", selectedId);
        }

        // Helper: Build SelectList for all readers
        private SelectList GetReadersSelectList(int? selectedId = null)
        {
            var readers = ReaderRepository.GetAll()
                .Select(r => new { r.Id, Display = $"{r.FullName} ({r.Email})" })
                .ToList();

            return new SelectList(readers, "Id", "Display", selectedId);
        }

        // ─── INDEX (LIST) ─────────────────────────────────────────────────────

        // GET: /Borrowing - Show all borrowing records with reader and book info
        public IActionResult Index()
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");

            // GetAll() in the repository populates Reader and Book navigation properties
            var borrowings = BorrowingRepository.GetAll();
            return View(borrowings);
        }

        // ─── DETAILS ──────────────────────────────────────────────────────────

        // GET: /Borrowing/Details/5 - Show read-only details for one borrowing
        public IActionResult Details(int id)
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");

            var borrowing = BorrowingRepository.GetById(id);
            if (borrowing == null) return NotFound();

            return View(borrowing);
        }

        // ─── CREATE ───────────────────────────────────────────────────────────

        // GET: /Borrowing/Create - Show form with reader and book dropdowns
        public IActionResult Create()
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");

            // Pass dropdown data to the view via ViewBag
            ViewBag.Books = GetAvailableBooksSelectList();
            ViewBag.Readers = GetReadersSelectList();

            // Default dates: borrow today, due in 2 weeks
            var model = new Borrowing
            {
                BorrowDate = DateTime.Today,
                DueDate = DateTime.Today.AddDays(14)
            };

            return View(model);
        }

        // POST: /Borrowing/Create - Save the new borrowing record
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Borrowing borrowing)
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");

            // Remove navigation properties from validation - they are loaded by the repo
            ModelState.Remove("Reader");
            ModelState.Remove("Book");

            if (!ModelState.IsValid)
            {
                // Re-populate dropdowns before returning the form
                ViewBag.Books = GetAvailableBooksSelectList(borrowing.BookId);
                ViewBag.Readers = GetReadersSelectList(borrowing.ReaderId);
                return View(borrowing);
            }

            // Verify the selected book is still available (race condition guard)
            var book = BookRepository.GetById(borrowing.BookId);
            if (book == null || !book.IsAvailable)
            {
                ModelState.AddModelError("BookId", "This book is no longer available.");
                ViewBag.Books = GetAvailableBooksSelectList();
                ViewBag.Readers = GetReadersSelectList(borrowing.ReaderId);
                return View(borrowing);
            }

            BorrowingRepository.Add(borrowing); // Repository handles marking book unavailable
            TempData["Success"] = "Borrowing record created successfully.";
            return RedirectToAction(nameof(Index));
        }

        // ─── EDIT ─────────────────────────────────────────────────────────────

        // GET: /Borrowing/Edit/5 - Show edit form (used mainly to record a return date)
        public IActionResult Edit(int id)
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");

            var borrowing = BorrowingRepository.GetById(id);
            if (borrowing == null) return NotFound();

            // For the edit form, show all books (not just available ones)
            // because the currently borrowed book is not available but must remain selectable
            var allBooks = BookRepository.GetAll()
                .Select(b => new { b.Id, Display = $"{b.Title} ({b.Author})" })
                .ToList();
            ViewBag.Books = new SelectList(allBooks, "Id", "Display", borrowing.BookId);
            ViewBag.Readers = GetReadersSelectList(borrowing.ReaderId);

            return View(borrowing);
        }

        // POST: /Borrowing/Edit/5 - Save updated borrowing (handles return date changes)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Borrowing borrowing)
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");

            if (id != borrowing.Id) return BadRequest();

            ModelState.Remove("Reader");
            ModelState.Remove("Book");

            if (!ModelState.IsValid)
            {
                var allBooks = BookRepository.GetAll()
                    .Select(b => new { b.Id, Display = $"{b.Title} ({b.Author})" })
                    .ToList();
                ViewBag.Books = new SelectList(allBooks, "Id", "Display", borrowing.BookId);
                ViewBag.Readers = GetReadersSelectList(borrowing.ReaderId);
                return View(borrowing);
            }

            var updated = BorrowingRepository.Update(borrowing); // Handles availability toggle
            if (!updated) return NotFound();

            TempData["Success"] = "Borrowing record updated successfully.";
            return RedirectToAction(nameof(Index));
        }

        // ─── DELETE ───────────────────────────────────────────────────────────

        // GET: /Borrowing/Delete/5 - Show confirmation page before deleting
        public IActionResult Delete(int id)
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");

            var borrowing = BorrowingRepository.GetById(id);
            if (borrowing == null) return NotFound();

            return View(borrowing);
        }

        // POST: /Borrowing/Delete/5 - Remove the borrowing record
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");

            BorrowingRepository.Delete(id); // Repository handles restoring book availability
            TempData["Success"] = "Borrowing record deleted.";
            return RedirectToAction(nameof(Index));
        }
    }
}
