//Kenzie Whitman Section 3, Mission 11
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineBookstore.API.Data;
using OnlineBookstore.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;


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

        // GET: api/Books/category/Biography
        [HttpGet("category/{category}")]
        public IActionResult GetBooksByCategory(string category)
        {
            var books = _context.Books
                .Where(b => b.Category.ToLower() == category.ToLower())
                .ToList();

            return Ok(books);
        }

        // GET: api/Books?page=1&pageSize=5&sortBy=Title&sortOrder=asc
        [HttpGet("GetBooks")]
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

            var books = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            Response.Headers["X-Total-Count"] = totalBooks.ToString();

            return books;
        }

        // GET: api/Books/all
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Book>>> GetAllBooks()
        {
            var books = await _context.Books.ToListAsync();
            return Ok(books);
        }

        // POST: api/Books/add
        [HttpPost("add")]
        public async Task<IActionResult> AddBook([FromBody] Book book)
        {
            if (ModelState.IsValid)
            {
                _context.Books.Add(book);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Book added successfully" });
            }
            return BadRequest(ModelState);
        }

        // POST: api/Books/update
        [HttpPost("update")]
        public async Task<IActionResult> UpdateBook([FromBody] Book book)
        {
            if (ModelState.IsValid)
            {
                _context.Books.Update(book);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Book updated successfully" });
            }
            return BadRequest(ModelState);
        }

        // POST: api/Books/delete/{id}
        [HttpPost("delete/{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound(new { message = "Book not found" });
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Book deleted successfully" });
        }
    }
}
