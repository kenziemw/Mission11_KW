import React, { useEffect, useState } from "react";
import { Book } from "../models/Book";
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} from "../services/bookService";

const AdminBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState<Partial<Book>>({
    title: "",
    author: "",
    publisher: "",
    isbn: "",
    classification: "",
    category: "",
    numberOfPages: 0,
    price: 0,
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchBooks = async () => {
    const data = await getBooks(1, 100, "TitleAsc");
    setBooks(data.books);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "numberOfPages"
          ? parseInt(value)
          : name === "price"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateBook({ ...form, bookID: editingId } as Book);
    } else {
      await addBook(form as Book);
    }
    setForm({
      title: "",
      author: "",
      publisher: "",
      isbn: "",
      classification: "",
      category: "",
      numberOfPages: 0,
      price: 0,
    });
    setEditingId(null);
    fetchBooks();
  };

  const handleEdit = (book: Book) => {
    setForm(book);
    setEditingId(book.bookID);
  };

  const handleDelete = async (id: number) => {
    await deleteBook(id);
    fetchBooks();
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">📚 Admin Book Manager</h2>

      <form onSubmit={handleSubmit} className="mb-4 row g-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="title"
            name="title"
            value={form.title || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="author"
            name="author"
            value={form.author || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="publisher"
            name="publisher"
            value={form.publisher || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="isbn"
            name="isbn"
            value={form.isbn || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="classification"
            name="classification"
            value={form.classification || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="category"
            name="category"
            value={form.category || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="number"
            className="form-control"
            placeholder="numberOfPages"
            name="numberOfPages"
            value={form.numberOfPages || 0}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="number"
            step="0.01"
            className="form-control"
            placeholder="price"
            name="price"
            value={form.price || 0}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-12">
          <button className="btn btn-success">
            {editingId ? "Update Book" : "Add Book"}
          </button>
        </div>
      </form>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.bookID}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>${b.price.toFixed(2)}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(b)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(b.bookID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBooks;
