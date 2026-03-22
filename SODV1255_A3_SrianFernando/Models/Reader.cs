// Models/Reader.cs - Represents a library member (reader) in the LMS
// Carried forward from Assignment 2 with full data annotations

using System.ComponentModel.DataAnnotations;

namespace SODV1255_A3_SrianFernando.Models
{
    public class Reader
    {
        // Unique identifier for the reader (auto-assigned by repository)
        public int Id { get; set; }

        [Required(ErrorMessage = "Full name is required.")]
        [MaxLength(120, ErrorMessage = "Name cannot exceed 120 characters.")]
        [Display(Name = "Full Name")]
        public string? FullName { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [MaxLength(120, ErrorMessage = "Email cannot exceed 120 characters.")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
        [Display(Name = "Email")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Phone number is required.")]
        [MaxLength(15, ErrorMessage = "Phone cannot exceed 15 characters.")]
        [Phone(ErrorMessage = "Please enter a valid phone number.")]
        [Display(Name = "Phone")]
        public string? Phone { get; set; }

        // Date the reader registered with the library
        [Display(Name = "Registered Date")]
        [DataType(DataType.Date)]
        public DateTime RegisteredDate { get; set; } = DateTime.Today;
    }
}
