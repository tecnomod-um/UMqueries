import React from "react";
import MainStyles from "./Main.module.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

// Main view
function Main() {
    return (
      <span>
        <h1>UMU - BIOQUERIES</h1>
        <div className={MainStyles.container}>
        </div>
      </span>
    );
  }
  export default Main;