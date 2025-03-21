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

        // GET: api/Books?page=1&pageSize=5&sortBy=Title&sortOrder=asc
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks(
            int page = 1, int pageSize = 5, string sortBy = "Title", string sortOrder = "asc")
        {
            IQueryable<Book> query = _context.Books;

            // Sorting (currently supports sorting by Title)
            if (sortBy.Equals("Title", StringComparison.OrdinalIgnoreCase))
            {
                query = sortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase)
                    ? query.OrderBy(b => b.Title)
                    : query.OrderByDescending(b => b.Title);
            }

            // Get total count for pagination metadata.
            var totalBooks = await query.CountAsync();

            // Pagination logic
            var books = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Optionally, send total count in the response header.
            Response.Headers["X-Total-Count"] = totalBooks.ToString();

            return books;
        }
    }
}
