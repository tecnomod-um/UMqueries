import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import Main from "./pages/Main";

import querydataJson from "./data/querydata.json";
const querydata = querydataJson.querydata;

const root = ReactDOM.createRoot(document.getElementById('root'));
// Route definition
root.render(
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={<Main/>}
      ></Route>
      <Route>
        path="/queries"
        element={<Main querydata={querydata}/>}
      </Route>
    </Routes>
  </BrowserRouter>
);
