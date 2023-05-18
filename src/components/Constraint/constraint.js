import React, { useState } from "react";
import ConstraintStyles from "./constraint.module.css";

// Darkens the generated colors for each node so they are more legible
function darken(color, amount) {
    const hex = color.replace("#", "");
    const rgb = [0, 2, 4].map(idx => parseInt(hex.slice(idx, idx + 2), 16));
    const newRgb = rgb.map(c => Math.max(c - Math.round(amount * c / 100), 0));
    return `#${newRgb.map(c => c.toString(16).padStart(2, "0")).join("")}`;
}
// Defines each element and its functionality in the constraint list
function Constraint({ id, data, type, color, addNode, isVar, graph }) {

    const [isHovered, setIsHovered] = useState(false);

    const label = isVar ? id + ' variable' : id;

    const listItemStyle = {
        color: isHovered ? darken(color, 60) : "black",
    };
    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    const handleClick = (event) => {
        event.preventDefault();
        addNode(id, data, type, isVar, graph);
    };

    return (
        <li
            style={listItemStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={ConstraintStyles.element}
            onClick={handleClick}
        >
            <h2>{label}</h2>
            <p>{data}</p>
        </li>
    );
}

export default Constraint;