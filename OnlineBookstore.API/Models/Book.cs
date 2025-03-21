//Kenzie Whitman Section 3, Mission 11
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
        public string Title { get; set; }

        [Required]
        [Column("Author")]
        public string Author { get; set; }

        [Required]
        [Column("Publisher")]
        public string Publisher { get; set; }

        [Required]
        [Column("ISBN")]
        public string ISBN { get; set; }

        // If your DB column is called "Classification"
        [Column("Classification")]
        public string Classification { get; set; }

        // If your DB column is called "Category"
        [Column("Category")]
        public string Category { get; set; }

        [Required]
        [Column("PageCount")]
        public int PageCount { get; set; }

        [Required]
        [Column("Price")]
        public decimal Price { get; set; }
    }
}
