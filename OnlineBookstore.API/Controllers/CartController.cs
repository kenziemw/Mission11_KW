using Microsoft.AspNetCore.Mvc;
using OnlineBookstore.API.Models;
using OnlineBookstore.API.Data;
using OnlineBookstore.API.Extensions;

namespace OnlineBookstore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly BookstoreContext _context;
        private const string SessionKey = "Cart";

        public CartController(BookstoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetCart()
        {
            var cart = HttpContext.Session.GetObjectFromJson<List<CartItem>>(SessionKey) ?? new List<CartItem>();
            return Ok(cart);
        }

        [HttpPost("{bookId}")]
public IActionResult AddToCart(int bookId)
{
    var book = _context.Books.FirstOrDefault(b => b.BookID == bookId);
    if (book == null)
        return NotFound();

    // Load current cart
    var cart = HttpContext.Session.GetObjectFromJson<List<CartItem>>("Cart") ?? new List<CartItem>();

    // Check if book already exists in cart
    var existingItem = cart.FirstOrDefault(c => c.BookID == bookId);
    if (existingItem != null)
    {
        existingItem.Quantity++;
    }
    else
    {
        cart.Add(new CartItem
        {
            BookID = book.BookID,
            Title = book.Title,
            Price = book.Price,
            Quantity = 1
        });
    }

    // Save updated cart
    HttpContext.Session.SetObjectAsJson("Cart", cart);
        Console.WriteLine("🛒 Updated Cart:");
            foreach (var item in cart)
                 {
            Console.WriteLine($"- {item.Title} x {item.Quantity}");
         }

    return Ok(cart);
}
    }}
