import React from "react";
import { Link } from "react-router-dom";
import MainStyles from "./main.module.css";

// Landing page. Brief instructions on how to use the tool will be shown here.
function Main() {
  return (
    <span>
      <h1>UMU - BIOQUERIES</h1>
      <div className={MainStyles.container}>
        <div className={MainStyles.text}>(This is where the landing page will go)</div>
        <Link to={'/queries'}>
          <button className={MainStyles.big_button}>Get started</button>
        </Link>
      </div>
    </span>
  );
}
export default Main;