import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'; // TODO this is bad practice. Move css to each component
import Navbar from "./components/Navbar/navbar";
import ErrorBoundary from "./components/ErrorBoundary/errorBoundary";
import Main from "./pages/main";
import Queries from "./pages/queries";
import About from "./pages/about";

//TODO set in public
import favicon from "./resources/icons/favicon.png";

// Route definition
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <BrowserRouter>
      <Navbar />
      <link rel="icon" href={favicon} />
      <Routes>
        <Route
          path="/"
          element={<Main />}
        ></Route>
        <Route
          path="/queries"
          element={<Queries />}
        ></Route>
        <Route
          path="/about"
          element={<About />}
        ></Route>
      </Routes>
    </BrowserRouter>
  </ErrorBoundary>
);
