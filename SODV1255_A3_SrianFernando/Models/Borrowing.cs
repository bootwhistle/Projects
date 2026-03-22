// Models/Borrowing.cs - Represents a book borrowing transaction in the LMS
// Links a Reader to a Book with borrow/due/return dates
// BookId and ReaderId are foreign keys connecting to their respective models

using System.ComponentModel.DataAnnotations;

namespace SODV1255_A3_SrianFernando.Models
{
    public class Borrowing
    {
        // Unique identifier for this borrowing record
        public int Id { get; set; }

        // Foreign key - references Reader.Id
        [Required(ErrorMessage = "A reader must be selected.")]
        [Display(Name = "Reader")]
        public int ReaderId { get; set; }

        // Navigation property - populated when we join with reader data
        public Reader? Reader { get; set; }

        // Foreign key - references Book.Id
        [Required(ErrorMessage = "A book must be selected.")]
        [Display(Name = "Book")]
        public int BookId { get; set; }

        // Navigation property - populated when we join with book data
        public Book? Book { get; set; }

        // Date the book was borrowed
        [Required(ErrorMessage = "Borrow date is required.")]
        [DataType(DataType.Date)]
        [Display(Name = "Borrow Date")]
        public DateTime BorrowDate { get; set; } = DateTime.Today;

        // Expected return date (typically 2 weeks from borrow date)
        [Required(ErrorMessage = "Due date is required.")]
        [DataType(DataType.Date)]
        [Display(Name = "Due Date")]
        public DateTime DueDate { get; set; } = DateTime.Today.AddDays(14);

        // Actual return date - null means the book has not been returned yet
        [DataType(DataType.Date)]
        [Display(Name = "Return Date")]
        public DateTime? ReturnDate { get; set; }

        // Computed property: true if the book is past due and not yet returned
        public bool IsOverdue => ReturnDate == null && DateTime.Today > DueDate;
    }
}
