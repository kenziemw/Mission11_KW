using Microsoft.AspNetCore.Mvc;
using OnlineBookstore.API.Data;
using OnlineBookstore.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace OnlineBookstore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly BookstoreContext _context;

        public CartController(BookstoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetCart()
        {
            var cart = HttpContext.Session.GetObjectFromJson<List<CartItem>>("Cart") ?? new List<CartItem>();
            return Ok(cart);
        }

        [HttpPost("{bookID}")]
        public IActionResult AddToCart(int bookID)
        {
            var cart = HttpContext.Session.GetObjectFromJson<List<CartItem>>("Cart") ?? new List<CartItem>();
            var book = _context.Books.FirstOrDefault(b => b.BookID == bookID);
            if (book == null)
            {
                return NotFound();
            }

            var existingItem = cart.FirstOrDefault(ci => ci.BookID == bookID);

            if (existingItem != null)
            {
                existingItem.Quantity++;
                existingItem.Subtotal = existingItem.Quantity * existingItem.Price;
            }
            else
            {
                cart.Add(new CartItem
                {
                    BookID = book.BookID,
                    Title = book.Title,
                    Price = book.Price,
                    Quantity = 1,
                    Subtotal = book.Price
                });
            }

            HttpContext.Session.SetObjectAsJson("Cart", cart);
            return Ok(cart);
        }

        [HttpPost("clear")]
        public IActionResult ClearCart()
        {
            HttpContext.Session.Remove("Cart");
            return Ok();
        }
    }
}
