using System;
using System.ComponentModel.DataAnnotations;

namespace LMS.Models
{
    public class Borrowing
    {
        public int Id { get; set; }

        [Required]
        public int ReaderId { get; set; }

        [Required]
        public int BookId { get; set; }

        [Required]
        public DateTime BorrowDate { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        public DateTime? ReturnDate { get; set; }
    }
}
