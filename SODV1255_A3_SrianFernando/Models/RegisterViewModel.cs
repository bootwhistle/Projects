// Models/RegisterViewModel.cs - View model for the Register page
// Includes ConfirmPassword field for client-side validation

using System.ComponentModel.DataAnnotations;

namespace SODV1255_A3_SrianFernando.Models
{
    public class RegisterViewModel
    {
        [Required(ErrorMessage = "Full name is required.")]
        [MaxLength(120)]
        [Display(Name = "Full Name")]
        public string? FullName { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
        [MaxLength(120)]
        [Display(Name = "Email")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string? Password { get; set; }

        // Must match Password - validated with [Compare] attribute
        [Required(ErrorMessage = "Please confirm your password.")]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Passwords do not match.")]
        [Display(Name = "Confirm Password")]
        public string? ConfirmPassword { get; set; }
    }
}
