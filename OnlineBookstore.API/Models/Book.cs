using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineBookstore.API.Models
{
    [Table("Books")]
    public class Book
    {
        [Key]
        [Column("BookID")]
        public int BookID { get; set; }

        [Required]
        [Column("Title")]
        public string Title { get; set; } = null!;

        [Required]
        [Column("Author")]
        public string Author { get; set; } = null!;

        [Required]
        [Column("Publisher")]
        public string Publisher { get; set; } = null!;

        [Required]
        [Column("ISBN")]
        public string ISBN { get; set; } = null!;

        [Column("Classification")]
        public string Classification { get; set; } = null!;

        [Column("Category")]
        public string Category { get; set; } = null!;

        [Required]
        [Column("PageCount")]
        public int PageCount { get; set; }

        [Required]
        [Column("Price")]
        public decimal Price { get; set; }
    }
}
