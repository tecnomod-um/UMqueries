import React, { useState } from "react";
import ConstraintStyles from "./constraint.module.css";


const subtractLight = function (color, amount) {
    let cc = parseInt(color, 16) - amount;
    let c = (cc < 0) ? 0 : (cc);
    c = (c.toString(16).length > 1) ? c.toString(16) : `0${c.toString(16)}`;
    return c;
}
const darken = (color, amount) => {
    color = (color.indexOf("#") >= 0) ? color.substring(1, color.length) : color;
    amount = parseInt((255 * amount) / 100);
    return color = `#${subtractLight(color.substring(0, 2), amount)}${subtractLight(color.substring(2, 4), amount)}${subtractLight(color.substring(4, 6), amount)}`;
}

// Defines each element in the list
function Constraint({ id, data, type, color, addNode, isVar, graph }) {

    const [isHover, setIsHover] = useState(false);

    var boxStyle = {
        color: isHover ? darken(color, 65) : 'black',
    };

    const handleMouseEnter = () => {
        setIsHover(true);
    };
    const handleMouseLeave = () => {
        setIsHover(false);
    };

    const addElementNode = (e) => {
        e.preventDefault();
        addNode(id, data, type, isVar, graph);
    }

    return (
        <li style={boxStyle} onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave} className={ConstraintStyles.element} onClick={addElementNode}>
            <h2>{id}</h2>
            <p>{data}</p>
        </li>
    )
}

export default Constraint;