// Kenzie Whitman Section 3, Mission 11 assignment
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BookList from './components/BookList';
import AdminPage from './components/AdminPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}

export default App;
