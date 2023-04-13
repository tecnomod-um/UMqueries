import React from 'react';
import ConstraintStyles from "./constraint.module.css";

function Constraint({ element, addNode }) {

    const addElementNode = (e) => {
        e.preventDefault();
        addNode(element.id, element.uri);
    }

    return (
        <li className={ConstraintStyles.li} onClick={addElementNode}>
            <h2>{element.id}</h2>
            <p>{element.uri}</p>
        </li>
    )
}

export default Constraint;