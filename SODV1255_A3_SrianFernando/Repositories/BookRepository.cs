// Repositories/BookRepository.cs - In-memory data store for Book entities
// Implements full CRUD operations using a static List<Book>
// Static storage means data persists for the lifetime of the application process

using SODV1255_A3_SrianFernando.Models;

namespace SODV1255_A3_SrianFernando.Repositories
{
    public static class BookRepository
    {
        // Static list acts as our in-memory "database table" for books
        // Pre-seeded with sample data so the app is useful on first run
        private static List<Book> _books = new List<Book>
        {
            new Book
            {
                Id = 1,
                Title = "Clean Code",
                Author = "Robert C. Martin",
                YearPublished = 2008,
                IsAvailable = true,
                ISBN = "9780132350884"
            },
            new Book
            {
                Id = 2,
                Title = "The Pragmatic Programmer",
                Author = "Andrew Hunt & David Thomas",
                YearPublished = 1999,
                IsAvailable = true,
                ISBN = "9780201616224"
            },
            new Book
            {
                Id = 3,
                Title = "Design Patterns",
                Author = "Gang of Four",
                YearPublished = 1994,
                IsAvailable = false,  // Currently borrowed
                ISBN = "9780201633610"
            }
        };

        // Auto-incrementing ID counter - starts above seed data
        private static int _nextId = 4;

        // READ - Get all books
        public static List<Book> GetAll()
        {
            return _books.ToList(); // Return a copy to prevent external mutation
        }

        // READ - Get a single book by its ID; returns null if not found
        public static Book? GetById(int id)
        {
            return _books.FirstOrDefault(b => b.Id == id);
        }

        // CREATE - Add a new book and assign it an ID
        public static void Add(Book book)
        {
            book.Id = _nextId++;
            _books.Add(book);
        }

        // UPDATE - Replace an existing book's data with the updated version
        // Finds by ID and updates all fields
        public static bool Update(Book updatedBook)
        {
            var index = _books.FindIndex(b => b.Id == updatedBook.Id);
            if (index == -1) return false; // Book not found

            _books[index] = updatedBook;
            return true;
        }

        // DELETE - Remove a book by ID; returns false if not found
        public static bool Delete(int id)
        {
            var book = _books.FirstOrDefault(b => b.Id == id);
            if (book == null) return false;

            _books.Remove(book);
            return true;
        }
    }
}
