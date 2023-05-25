import React from "react";
import AboutStyles from "./about.module.css";

// Contact page citing the creators of the tool.
function About() {
    return (
        <span>
            <h1>UM - ABOUT</h1>
            <div className={AboutStyles.container}>
                Contact info
            </div>
        </span>
    );
}
export default About;
