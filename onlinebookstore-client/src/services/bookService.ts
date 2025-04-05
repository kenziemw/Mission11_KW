import axios from "axios";
import { Book } from "../models/Book";

const API_URL = window.location.hostname === "localhost"
  ? "https://localhost:5001/api/books"
  : "https://onlinebookstore-kenz-backend-h7axfjgmgcgkexaa.westus3-01.azurewebsites.net/api/books";

// 📚 Get all books
export const getBooks = async (
  page: number,
  pageSize: number,
  sortBy: string,
  categories: string[] = []
) => {
  try {
    const categoryParam = categories.length
      ? `&categories=${categories.join(",")}`
      : "";

    const response = await axios.get(
      `${API_URL}?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}${categoryParam}`
    );

    return {
      ...response.data,
      books: response.data.books.map((book: any) => ({
        bookID: book.BookID,
        title: book.Title,
        author: book.Author,
        publisher: book.Publisher,
        isbn: book.ISBN,
        classification: book.Classification,
        category: book.Category ?? "Uncategorized",
        numberOfPages: book.NumberOfPages ?? 0,
        price:
          book.Price !== undefined && !isNaN(book.Price)
            ? parseFloat(book.Price)
            : 0.0,
      })),
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    return { books: [], totalCount: 0 };
  }
};


// ➕ Add new book
export const addBook = async (book: Partial<Book>) => {
  try {
    if (
      !book.title ||
      !book.author ||
      !book.publisher ||
      !book.isbn ||
      !book.classification ||
      !book.category ||
      !book.numberOfPages ||
      book.price === undefined
    ) {
      throw new Error("Missing required fields. Please fill in all fields.");
    }

    const newBook = {
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      isbn: book.isbn,
      classification: book.classification,
      category: book.category,
      numberOfPages: book.numberOfPages || 0,
      price: book.price || 0.0,
    };

    const response = await axios.post(API_URL, newBook, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error adding book:", error);
    throw error;
  }
};

// ✏️ Update book
export const updateBook = async (book: Book) => {
  await axios.put(`${API_URL}/${book.bookID}`, book, {
    withCredentials: true,
  });
};

// ❌ Delete book
export const deleteBook = async (bookID: number) => {
  await axios.delete(`${API_URL}/${bookID}`, {
    withCredentials: true,
  });
};
