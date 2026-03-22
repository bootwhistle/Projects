// Repositories/ReaderRepository.cs - In-memory data store for Reader entities
// Implements full CRUD operations using a static List<Reader>

using SODV1255_A3_SrianFernando.Models;

namespace SODV1255_A3_SrianFernando.Repositories
{
    public static class ReaderRepository
    {
        // Static list acts as our in-memory "database table" for readers
        // Pre-seeded with sample data
        private static List<Reader> _readers = new List<Reader>
        {
            new Reader
            {
                Id = 1,
                FullName = "Alice Johnson",
                Email = "alice@example.com",
                Phone = "403-555-0101",
                RegisteredDate = new DateTime(2024, 1, 15)
            },
            new Reader
            {
                Id = 2,
                FullName = "Bob Smith",
                Email = "bob@example.com",
                Phone = "403-555-0202",
                RegisteredDate = new DateTime(2024, 3, 22)
            }
        };

        // Auto-incrementing ID counter - starts above seed data
        private static int _nextId = 3;

        // READ - Get all readers
        public static List<Reader> GetAll()
        {
            return _readers.ToList();
        }

        // READ - Get a single reader by ID; returns null if not found
        public static Reader? GetById(int id)
        {
            return _readers.FirstOrDefault(r => r.Id == id);
        }

        // CREATE - Add a new reader and assign it an ID
        public static void Add(Reader reader)
        {
            reader.Id = _nextId++;
            _readers.Add(reader);
        }

        // UPDATE - Replace an existing reader's data
        public static bool Update(Reader updatedReader)
        {
            var index = _readers.FindIndex(r => r.Id == updatedReader.Id);
            if (index == -1) return false;

            _readers[index] = updatedReader;
            return true;
        }

        // DELETE - Remove a reader by ID
        public static bool Delete(int id)
        {
            var reader = _readers.FirstOrDefault(r => r.Id == id);
            if (reader == null) return false;

            _readers.Remove(reader);
            return true;
        }
    }
}
