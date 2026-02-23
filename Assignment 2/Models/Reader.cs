using System;
using System.ComponentModel.DataAnnotations;

namespace LMS.Models
{
    public class Reader
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(120)]
        public string? FullName { get; set; }

        [Required]
        [MaxLength(120)]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        [MaxLength(15)]
        public string? Phone { get; set; }

        [Required]
        public DateTime RegisteredDate { get; set; }
    }
}
