import React from 'react';
import ConstraintStyles from "./constraint.module.css";

function Constraint({ element, onElementClick }) {

    const addElementNode = (e) => {
        e.preventDefault();
        onElementClick(element.id, element.prefix);
        console.log(element.id + ' node was added to graph.');
      }


      
    return (
        <li className={ConstraintStyles.li} onClick={addElementNode}>
                <h2>{element.id}</h2>
                <p>{element.prefix}</p>
        </li>
    )
}

export default Constraint;