import React from 'react';
import ConstraintStyles from "./constraint.module.css";

function Constraint({ id, data, type, addNode }) {

    const addElementNode = (e) => {
        e.preventDefault();
        addNode(id, data, type);
    }
    return (
        <li className={`${ConstraintStyles.element} ${ConstraintStyles[type]}`} onClick={addElementNode}>
            <h2>{id}</h2>
            <p>{data}</p>
        </li>
    )
}

export default Constraint;