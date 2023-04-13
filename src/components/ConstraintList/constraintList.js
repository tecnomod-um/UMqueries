import React from 'react';
import ConstraintListStyles from "./constraintList.module.css";
import Constraint from '../Constraint/constraint';

function ConstraintList({ filteredElements, addNode }) {
    const filtered = filteredElements.map(element => <Constraint key={element.id} element={element} addNode={addNode} />);
    return (
        <ul>
            {filtered
            }
        </ul>
    );
}

export default ConstraintList;
