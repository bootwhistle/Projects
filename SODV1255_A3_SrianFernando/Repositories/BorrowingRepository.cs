// Repositories/BorrowingRepository.cs - In-memory data store for Borrowing records
// Borrowing links a Reader to a Book; this repository also manages book availability
// when a borrow is created or a return is recorded

using SODV1255_A3_SrianFernando.Models;

namespace SODV1255_A3_SrianFernando.Repositories
{
    public static class BorrowingRepository
    {
        // Static list holds all borrowing transactions
        // Seeded with one active borrowing (book ID 3 is marked unavailable)
        private static List<Borrowing> _borrowings = new List<Borrowing>
        {
            new Borrowing
            {
                Id = 1,
                ReaderId = 1,
                BookId = 3,
                BorrowDate = DateTime.Today.AddDays(-7),
                DueDate = DateTime.Today.AddDays(7),
                ReturnDate = null  // Still borrowed
            }
        };

        private static int _nextId = 2;

        // READ - Get all borrowings with their associated Reader and Book populated
        // This is the "joined" view used by the Index page
        public static List<Borrowing> GetAll()
        {
            var borrowings = _borrowings.ToList();

            // Populate navigation properties by loading related entities
            foreach (var b in borrowings)
            {
                b.Reader = ReaderRepository.GetById(b.ReaderId);
                b.Book = BookRepository.GetById(b.BookId);
            }

            return borrowings;
        }

        // READ - Get a single borrowing by ID with navigation properties populated
        public static Borrowing? GetById(int id)
        {
            var borrowing = _borrowings.FirstOrDefault(b => b.Id == id);
            if (borrowing == null) return null;

            // Populate navigation properties
            borrowing.Reader = ReaderRepository.GetById(borrowing.ReaderId);
            borrowing.Book = BookRepository.GetById(borrowing.BookId);

            return borrowing;
        }

        // CREATE - Record a new borrowing and mark the book as unavailable
        public static void Add(Borrowing borrowing)
        {
            borrowing.Id = _nextId++;
            _borrowings.Add(borrowing);

            // Mark the borrowed book as no longer available
            var book = BookRepository.GetById(borrowing.BookId);
            if (book != null)
            {
                book.IsAvailable = false;
                BookRepository.Update(book);
            }
        }

        // UPDATE - Update borrowing details; handles return date being set
        // When a return date is recorded, the book is marked available again
        public static bool Update(Borrowing updatedBorrowing)
        {
            var index = _borrowings.FindIndex(b => b.Id == updatedBorrowing.Id);
            if (index == -1) return false;

            var existing = _borrowings[index];

            // If a return date is being recorded for the first time, free the book
            if (existing.ReturnDate == null && updatedBorrowing.ReturnDate != null)
            {
                var book = BookRepository.GetById(updatedBorrowing.BookId);
                if (book != null)
                {
                    book.IsAvailable = true;
                    BookRepository.Update(book);
                }
            }

            // If a return is being un-recorded (cleared), mark book unavailable again
            if (existing.ReturnDate != null && updatedBorrowing.ReturnDate == null)
            {
                var book = BookRepository.GetById(updatedBorrowing.BookId);
                if (book != null)
                {
                    book.IsAvailable = false;
                    BookRepository.Update(book);
                }
            }

            _borrowings[index] = updatedBorrowing;
            return true;
        }

        // DELETE - Remove a borrowing record and restore the book's availability
        public static bool Delete(int id)
        {
            var borrowing = _borrowings.FirstOrDefault(b => b.Id == id);
            if (borrowing == null) return false;

            // Restore book availability if the book was still borrowed (no return date)
            if (borrowing.ReturnDate == null)
            {
                var book = BookRepository.GetById(borrowing.BookId);
                if (book != null)
                {
                    book.IsAvailable = true;
                    BookRepository.Update(book);
                }
            }

            _borrowings.Remove(borrowing);
            return true;
        }
    }
}
