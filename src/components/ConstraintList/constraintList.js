import React from 'react';
import ConstraintListStyles from "./constraintList.module.css";
import Constraint from '../Constraint/constraint';

function ConstraintList({ filteredElements, onElementClick}) {
    const filtered = filteredElements.map(element => <Constraint key={element.id} element={element} onElementClick={onElementClick} />);
    return (
        <ul>
            {filtered
            }
        </ul>
    );
}

export default ConstraintList;
