import React from 'react';
import ConstraintListStyles from "./constraintList.module.css";
import Constraint from '../Constraint/constraint';

function ConstraintList({ filteredElements }) {
    const filtered = filteredElements.map(element => <Constraint key={element.id} element={element} />);
    return (
        <div>
            {filtered
            }
        </div>
    );
}

export default ConstraintList;