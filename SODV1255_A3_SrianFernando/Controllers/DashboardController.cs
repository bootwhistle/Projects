// Controllers/DashboardController.cs - Landing page after login
// Shows summary statistics: total books, readers, active borrowings, overdue items

using Microsoft.AspNetCore.Mvc;
using SODV1255_A3_SrianFernando.Repositories;

namespace SODV1255_A3_SrianFernando.Controllers
{
    public class DashboardController : Controller
    {
        // GET: /Dashboard/Index (also the app's default route)
        public IActionResult Index()
        {
            // Require login - redirect to login page if no active session
            if (HttpContext.Session.GetInt32("UserId") == null)
                return RedirectToAction("Login", "Account");

            // Pass summary counts to the view via ViewBag for the stat cards
            var allBorrowings = BorrowingRepository.GetAll();

            ViewBag.TotalBooks = BookRepository.GetAll().Count;
            ViewBag.TotalReaders = ReaderRepository.GetAll().Count;
            ViewBag.ActiveBorrowings = allBorrowings.Count(b => b.ReturnDate == null);
            ViewBag.OverdueBorrowings = allBorrowings.Count(b => b.IsOverdue);
            ViewBag.AvailableBooks = BookRepository.GetAll().Count(b => b.IsAvailable);
            ViewBag.TotalFines = allBorrowings.Sum(b => b.OverdueFine);

            return View();
        }
    }
}
