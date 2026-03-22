// Models/User.cs - Represents a staff/admin user who can log into the LMS
// Used for session-based authentication (login/register)

using System.ComponentModel.DataAnnotations;

namespace SODV1255_A3_SrianFernando.Models
{
    public class User
    {
        // Unique identifier (auto-assigned by UserRepository)
        public int Id { get; set; }

        [Required]
        [MaxLength(120)]
        [Display(Name = "Full Name")]
        public string? FullName { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(120)]
        [Display(Name = "Email")]
        public string? Email { get; set; }

        // Plain-text password stored in memory for this demo project
        // In production this would be a salted hash (e.g., BCrypt)
        [Required]
        public string? Password { get; set; }
    }
}
