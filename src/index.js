import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from "react-router-dom";
import './index.css'; // TODO this is bad practice. Move css to each component
import Navbar from "./components/Navbar/navbar";
import ErrorBoundary from "./components/ErrorBoundary/errorBoundary";
import Main from "./pages/main";
import Queries from "./pages/queries";
import About from "./pages/about";
// Context to load predefined use cases
import { QueryProvider } from './contexts/queryContext';

//TODO set in public
import favicon from "./resources/icons/favicon.png";

// Route definition
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ErrorBoundary>
        <div id="modal"></div>
        <HashRouter>
            <Navbar />
            <link rel="icon" href={favicon} />
            <QueryProvider>
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
            </QueryProvider>
        </HashRouter>
    </ErrorBoundary>
);
