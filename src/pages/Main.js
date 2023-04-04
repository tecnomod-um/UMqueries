import React from "react";
import MainStyles from "./Main.module.css";
import StartButton from "../components/StartButton/StartButton";

// Main view
function Main() {
  return (
    <span>
      <h1>UMU - BIOQUERIES</h1>
      <div class="text"> This is where the landing page will go</div>

      <StartButton></StartButton>
      <div className={MainStyles.container}>
      </div>
    </span>
  );
}
export default Main;