import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookList from './components/BookList';
import AdminBooks from './components/AdminBooks';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/adminbooks" element={<AdminBooks />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
