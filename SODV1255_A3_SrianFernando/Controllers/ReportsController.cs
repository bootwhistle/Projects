// Controllers/ReportsController.cs - Generates reports on borrowing activity
// Staff can filter by date range, status, and reader
// Results show matching borrowings + summary stats including outstanding fines

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using SODV1255_A3_SrianFernando.Models;
using SODV1255_A3_SrianFernando.Repositories;

namespace SODV1255_A3_SrianFernando.Controllers
{
    public class ReportsController : Controller
    {
        private bool IsLoggedIn() => HttpContext.Session.GetInt32("UserId") != null;

        // GET: /Reports - Show filter form and results
        // Filters are passed as query string params so the URL is shareable/bookmarkable
        public IActionResult Index(
            DateTime? fromDate,
            DateTime? toDate,
            string? status,       // "active", "returned", "overdue", or null = all
            int? readerId)
        {
            if (!IsLoggedIn()) return RedirectToAction("Login", "Account");

            // Populate reader dropdown for the filter form
            var readers = ReaderRepository.GetAll()
                .Select(r => new { r.Id, Display = $"{r.FullName}" })
                .ToList();
            ViewBag.Readers = new SelectList(readers, "Id", "Display", readerId);

            // Start with all borrowings (navigation properties loaded by GetAll)
            var results = BorrowingRepository.GetAll();

            // Apply date range filter on BorrowDate
            if (fromDate.HasValue)
                results = results.Where(b => b.BorrowDate.Date >= fromDate.Value.Date).ToList();
            if (toDate.HasValue)
                results = results.Where(b => b.BorrowDate.Date <= toDate.Value.Date).ToList();

            // Apply status filter
            if (!string.IsNullOrEmpty(status))
            {
                results = status switch
                {
                    "active"   => results.Where(b => b.ReturnDate == null && !b.IsOverdue).ToList(),
                    "returned" => results.Where(b => b.ReturnDate != null).ToList(),
                    "overdue"  => results.Where(b => b.IsOverdue).ToList(),
                    _          => results
                };
            }

            // Apply reader filter
            if (readerId.HasValue)
                results = results.Where(b => b.ReaderId == readerId.Value).ToList();

            // Pass filter values back to the view so form fields stay populated
            ViewBag.FromDate = fromDate?.ToString("yyyy-MM-dd");
            ViewBag.ToDate   = toDate?.ToString("yyyy-MM-dd");
            ViewBag.Status   = status;
            ViewBag.ReaderId = readerId;

            // Summary statistics for the filtered result set
            ViewBag.TotalRecords    = results.Count;
            ViewBag.TotalActive     = results.Count(b => b.ReturnDate == null && !b.IsOverdue);
            ViewBag.TotalReturned   = results.Count(b => b.ReturnDate != null);
            ViewBag.TotalOverdue    = results.Count(b => b.IsOverdue);
            ViewBag.TotalFines      = results.Sum(b => b.OverdueFine);

            return View(results);
        }
    }
}
