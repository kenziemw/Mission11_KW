public class CartItem
{
    public int BookID { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public decimal Subtotal { get; set; }  // 👈 This must be here!
}
