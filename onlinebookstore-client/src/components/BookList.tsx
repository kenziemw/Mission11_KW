//kenzie whitman
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Container } from "react-bootstrap";


// Configure axios to include credentials (cookies) in all requests.
axios.defaults.withCredentials = true;

interface Book {
  bookID: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

interface CartItem {
  bookID: number;
  title: string;
  price: number;
  quantity: number;
  subtotal: number;
}

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [category, setCategory] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [booksPerPage, setBooksPerPage] = useState<number>(5);

  const apiUrl = category
    ? `http://localhost:5272/api/books/category/${category}`
    : `http://localhost:5272/api/books/all`;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(apiUrl);
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    const fetchCart = async () => {
      try {
        const response = await axios.get('http://localhost:5272/api/cart');
        setCart(response.data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchBooks();
    fetchCart();
  }, [apiUrl, booksPerPage]);

  const addToCart = async (bookID: number) => {
    try {
      const response = await axios.post(`http://localhost:5272/api/cart/${bookID}`);
      setCart(response.data);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  const navigate = useNavigate();

  const paginatedBooks = books.slice((page - 1) * booksPerPage, page * booksPerPage);
  const pageCount = Math.ceil(books.length / booksPerPage);
  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const progress = Math.min(100, totalQuantity * 20);

  const BookList: React.FC = () => {
    const navigate = useNavigate();
  
    return (
      <Container className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Book List</h2>
          <Button variant="dark" onClick={() => navigate("/Admin")}>
            Admin Page
          </Button>
        </div>
  
        {/* Your book list content below */}
      </Container>
    );
  };


  return (
    <div className="container mt-4">
      {/* Header + Filters */}
      <div className="sticky-top bg-white p-2">
      <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Online Bookstore</h2>
          <Button variant="dark" onClick={() => navigate("/Admin")}>
            Admin Page
          </Button>
              </div>



        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="categorySelect">Filter by Category:</label>
            <select
              id="categorySelect"
              className="form-select"
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All</option>
              <option value="Biography">Biography</option>
              <option value="Self-Help">Self-Help</option>
              <option value="Classic">Classic</option>
              <option value="Health">Health</option>
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="perPage">Results per page:</label>
            <select
              id="perPage"
              className="form-select"
              value={booksPerPage}
              onChange={(e) => {
                setBooksPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </div>

      {/* Book list and cart side-by-side */}
      <div className="row">
        {/* Book Table */}
        <div className="col-md-8">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th><th>Author</th><th>Publisher</th><th>ISBN</th>
                <th>Classification</th><th>Category</th><th>Page Count</th><th>Price</th><th></th>
              </tr>
            </thead>
            <tbody>
              {paginatedBooks.map((book) => (
                <tr key={book.bookID}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publisher}</td>
                  <td>{book.isbn}</td>
                  <td>{book.classification}</td>
                  <td>{book.category}</td>
                  <td>{book.pageCount}</td>
                  <td>${book.price.toFixed(2)}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => addToCart(book.bookID)}>
                      Add to Cart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-center">
            <nav>
              <ul className="pagination">
                {Array.from({ length: pageCount }, (_, i) => (
                  <li key={i + 1} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="col-md-4 border rounded p-3 shadow-sm">
          <h4>
            🛒 Cart Summary <span className="badge bg-primary">{totalQuantity}</span>
          </h4>

          <ul className="list-group mb-2">
            {cart.map((item) => (
              <li key={item.bookID} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{item.title} x {item.quantity}</span>
                <span>${item.subtotal.toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="d-flex justify-content-between mt-2 mb-3">
            <strong>Total:</strong>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <div className="progress mb-3">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {progress}%
            </div>
          </div>

            <button
              className="btn btn-success w-100"
              onClick={() => alert('🛍️ Checkout feature coming soon!')}
            >
              Proceed to Checkout
            </button>

        </div>
      </div>
    </div>
  );
};

export default BookList;
