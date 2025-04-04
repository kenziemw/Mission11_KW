//Kenzie Whitman Section 3, Mission 11
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineBookstore.API.Data;
using OnlineBookstore.API.Models;

namespace OnlineBookstore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly BookstoreContext _context;
        public BooksController(BookstoreContext context)
        {
            _context = context;
        }

        [HttpGet("category/{category}")]
        public IActionResult GetBooksByCategory(string category)
        {
            var books = _context.Books
                .Where(b => b.Category.ToLower() == category.ToLower())
                .ToList();

            return Ok(books);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks(
            int page = 1, int pageSize = 5, string sortBy = "Title", string sortOrder = "asc")
        {
            IQueryable<Book> query = _context.Books;

            if (sortBy.Equals("Title", StringComparison.OrdinalIgnoreCase))
            {
                query = sortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase)
                    ? query.OrderBy(b => b.Title)
                    : query.OrderByDescending(b => b.Title);
            }

            var totalBooks = await query.CountAsync();
            var books = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            Response.Headers["X-Total-Count"] = totalBooks.ToString();

            return books;
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Book>>> GetAllBooks()
        {
            var books = await _context.Books.ToListAsync();
            return Ok(books);
        }

        [HttpPost]
        public async Task<IActionResult> AddBook([FromBody] Book book)
        {
            if (book == null)
                return BadRequest("Book is null.");

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return Ok(book);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] Book book)
        {
            if (id != book.BookID)
                return BadRequest();

            _context.Entry(book).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound();

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
