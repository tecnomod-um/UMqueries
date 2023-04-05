import React from "react";
import AboutStyles from "./about.module.css";

// Main view
function About() {
    return (
        <span>
            <h1>UMU - ABOUT</h1>
            <div className={AboutStyles.container}>
                Contact info
            </div>
        </span>
    );
}
export default About;