// Models/LoginViewModel.cs - View model for the Login page
// Separates the authentication form data from the User domain model

using System.ComponentModel.DataAnnotations;

namespace SODV1255_A3_SrianFernando.Models
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
        [Display(Name = "Email")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string? Password { get; set; }
    }
}
