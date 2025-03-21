//Kenzie Whitman Section 3, Mission 11
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Book {
  bookID: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;    // Add this
  pageCount: number;
  price: number;
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Fetch books from the API
  const fetchBooks = async () => {
    try {
      const response = await axios.get<Book[]>('http://localhost:5272/api/Books', {
        params: {
          page,
          pageSize,
          sortBy: 'Title',
          sortOrder
        }
      });
      setBooks(response.data);

      // Read the total count from the response header
      const total = response.headers['x-total-count'];
      setTotalCount(Number(total));
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, sortOrder]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleSortByTitle = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Create an array [1..totalPages] for page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="container mt-4">
      <h2>Online Bookstore</h2>

      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ cursor: 'pointer' }} onClick={handleSortByTitle}>
              Title {sortOrder === 'asc' ? '▲' : '▼'}
            </th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Classification</th>
            <th>Category</th> {/* NEW COLUMN */}
            <th>Page Count</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.bookID}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{book.isbn}</td>
              <td>{book.classification}</td>
              <td>{book.category}</td> {/* RENDER CATEGORY */}
              <td>{book.pageCount}</td>
              <td>${book.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination with page numbers */}
      <div className="d-flex justify-content-center mt-3">
        <ul className="pagination">
          {pageNumbers.map(pg => (
            <li
              key={pg}
              className={`page-item ${page === pg ? 'active' : ''}`}
            >
              <button
                className="page-link"
                onClick={() => setPage(pg)}
              >
                {pg}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Change number of results per page */}
      <div className="mt-3">
        <label>Results per page: </label>
        <select
          className="ms-2"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1); // Reset to page 1
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
    </div>
  );
};

export default BookList;
