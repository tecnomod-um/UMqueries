import React from 'react';

function Constraint({ element }) {
    return (
        <div>
            <div>
                <h2>{element.name}</h2>
                <p>({element.type}) {element.code}</p>
            </div>
        </div>
    )
}

export default Constraint;