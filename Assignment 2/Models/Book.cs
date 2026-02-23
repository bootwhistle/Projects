using System.ComponentModel.DataAnnotations;

namespace LMS.Models
{
    public class Book
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string? Title { get; set; }

        [Required]
        [MaxLength(120)]
        public string? Author { get; set; }

        [Required]
        [Range(1, 9999)]
        public int YearPublished { get; set; }

        [Required]
        public bool IsAvailable { get; set; }

        [MaxLength(13)]
        public string? ISBN { get; set; }
    }
}
