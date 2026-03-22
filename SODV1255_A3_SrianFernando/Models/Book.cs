// Models/Book.cs - Represents a book in the Library Management System
// Carried forward from Assignment 2 with full data annotations

using System.ComponentModel.DataAnnotations;

namespace SODV1255_A3_SrianFernando.Models
{
    public class Book
    {
        // Unique identifier for the book (auto-assigned by repository)
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        [MaxLength(150, ErrorMessage = "Title cannot exceed 150 characters.")]
        [Display(Name = "Title")]
        public string? Title { get; set; }

        [Required(ErrorMessage = "Author is required.")]
        [MaxLength(120, ErrorMessage = "Author name cannot exceed 120 characters.")]
        [Display(Name = "Author")]
        public string? Author { get; set; }

        [Required(ErrorMessage = "Year Published is required.")]
        [Range(1, 9999, ErrorMessage = "Please enter a valid publication year.")]
        [Display(Name = "Year Published")]
        public int YearPublished { get; set; }

        // Tracks whether the book is currently available for borrowing
        [Display(Name = "Available")]
        public bool IsAvailable { get; set; } = true;

        [MaxLength(13, ErrorMessage = "ISBN cannot exceed 13 characters.")]
        [Display(Name = "ISBN")]
        public string? ISBN { get; set; }
    }
}
