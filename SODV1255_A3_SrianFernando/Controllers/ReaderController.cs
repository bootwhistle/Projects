// Controllers/ReaderController.cs - Full CRUD for Reader (library member) entities
// All actions require an active login session

using Microsoft.AspNetCore.Mvc;
using SODV1255_A3_SrianFernando.Models;
using SODV1255_A3_SrianFernando.Repositories;

namespace SODV1255_A3_SrianFernando.Controllers
{
    public class ReaderController : Controller
    {
        private bool IsLoggedIn() => HttpContext.Session.GetInt32("UserId") != null;

        // ─── INDEX (LIST) ─────────────────────────────────────────────────────

        // GET: /Reader - Show all registered readers
        public IActionResult Index()
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");

            var readers = ReaderRepository.GetAll();
            return View(readers);
        }

        // ─── DETAILS ──────────────────────────────────────────────────────────

        // GET: /Reader/Details/5 - Show read-only details for one reader
        public IActionResult Details(int id)
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");

            var reader = ReaderRepository.GetById(id);
            if (reader == null) return NotFound();

            return View(reader);
        }

        // ─── CREATE ───────────────────────────────────────────────────────────

        // GET: /Reader/Create - Show blank registration form for a new reader
        public IActionResult Create()
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");
            return View();
        }

        // POST: /Reader/Create - Validate and save the new reader
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Reader reader)
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");

            if (!ModelState.IsValid)
                return View(reader);

            // Set the registration date to today when a new reader is added
            reader.RegisteredDate = DateTime.Today;
            ReaderRepository.Add(reader);

            TempData["Success"] = $"Reader \"{reader.FullName}\" was added successfully.";
            return RedirectToAction(nameof(Index));
        }

        // ─── EDIT ─────────────────────────────────────────────────────────────

        // GET: /Reader/Edit/5 - Show edit form pre-filled with existing reader data
        public IActionResult Edit(int id)
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");

            var reader = ReaderRepository.GetById(id);
            if (reader == null) return NotFound();

            return View(reader);
        }

        // POST: /Reader/Edit/5 - Validate and save the updated reader
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Reader reader)
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");

            if (id != reader.Id) return BadRequest();

            if (!ModelState.IsValid)
                return View(reader);

            var updated = ReaderRepository.Update(reader);
            if (!updated) return NotFound();

            TempData["Success"] = $"Reader \"{reader.FullName}\" was updated successfully.";
            return RedirectToAction(nameof(Index));
        }

        // ─── DELETE ───────────────────────────────────────────────────────────

        // GET: /Reader/Delete/5 - Show confirmation page before deleting
        public IActionResult Delete(int id)
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");

            var reader = ReaderRepository.GetById(id);
            if (reader == null) return NotFound();

            return View(reader);
        }

        // POST: /Reader/Delete/5 - Perform the deletion after confirmation
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");

            var reader = ReaderRepository.GetById(id);
            var name = reader?.FullName ?? "Reader";

            ReaderRepository.Delete(id);
            TempData["Success"] = $"\"{name}\" was removed.";
            return RedirectToAction(nameof(Index));
        }
    }
}
