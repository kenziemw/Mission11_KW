import axios from "axios";
import { Book } from "../models/Book";

const API_URL = "https://onlinebookstore-kenz-backend-h7axfjgmgcgkexaa.westus3-01.azurewebsites.net/api";

export const getBooks = async (
  page: number,
  pageSize: number,
  sortBy: string,
  categories: string[] = []
): Promise<{ books: Book[]; totalCount: number }> => {
  try {
    const categoryParam = categories.length
      ? `&categories=${categories.join(",")}`
      : "";

    const response = await axios.get(
      `${API_URL}/books?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}${categoryParam}`
    );

    const books = response.data;

    return {
      books: books || [],
      totalCount: books.length,
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    return { books: [], totalCount: 0 };
  }
};

export const addBook = async (newBook: Book) => {
  try {
    const response = await axios.post(API_URL, newBook);
    return response.data;
  } catch (error) {
    console.error("Error adding book:", error);
    throw error;
  }
};

export const updateBook = async (book: Book) => {
  try {
    await axios.put(`${API_URL}/${book.bookID}`, book);
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

export const deleteBook = async (bookID: number) => {
  try {
    await axios.delete(`${API_URL}/${bookID}`);
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};
