import React from "react";
import MainStyles from "./main.module.css";
import StartButton from "../components/StartButton/startButton";

// Main view
function Main() {
  return (
    <span>
      <h1>UMU - BIOQUERIES</h1>
      <div className={MainStyles.container}>
        <div className={MainStyles.text}>(This is where the landing page will go)</div>
        <StartButton></StartButton>
      </div>
    </span>
  );
}
export default Main;