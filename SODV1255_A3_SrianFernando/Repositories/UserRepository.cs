// Repositories/UserRepository.cs - In-memory data store for User accounts
// Handles registration and credential validation for login

using SODV1255_A3_SrianFernando.Models;

namespace SODV1255_A3_SrianFernando.Repositories
{
    public static class UserRepository
    {
        // Pre-seeded admin account for easy demo access
        // Credentials: admin@lms.com / admin123
        private static List<User> _users = new List<User>
        {
            new User
            {
                Id = 1,
                FullName = "Admin User",
                Email = "admin@lms.com",
                Password = "admin123"
            }
        };

        private static int _nextId = 2;

        // AUTHENTICATE - Validate email/password for login
        // Returns the matching User if credentials are correct, null otherwise
        public static User? Authenticate(string email, string password)
        {
            return _users.FirstOrDefault(u =>
                u.Email != null && u.Email.Equals(email, StringComparison.OrdinalIgnoreCase)
                && u.Password == password);
        }

        // CHECK - Verify if an email is already registered (prevent duplicate accounts)
        public static bool EmailExists(string email)
        {
            return _users.Any(u =>
                u.Email != null && u.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
        }

        // CREATE - Register a new user account
        public static void Add(User user)
        {
            user.Id = _nextId++;
            _users.Add(user);
        }

        // READ - Get a user by ID (used to reload user info from session)
        public static User? GetById(int id)
        {
            return _users.FirstOrDefault(u => u.Id == id);
        }
    }
}
