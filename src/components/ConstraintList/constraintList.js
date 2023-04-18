import React from 'react';
import ConstraintListStyles from "./constraintList.module.css";
import Constraint from '../Constraint/constraint';

// List that stores both all the elements and their type variables
function ConstraintList({ keyList, filteredLists, addNode }) {
    function getCodeFromURI(uri) {
        return uri.substring(uri.lastIndexOf('/') + 1);
    }
    function listContent() {
        var result = [];
        keyList.forEach(key => {
            if (filteredLists[key].length !== 0) {
                result.push(<Constraint key={getCodeFromURI(filteredLists["VAR_" + key])} id={key.toUpperCase() + " variable"} data={filteredLists["VAR_" + key]} type={key} addNode={addNode} />);
                result.push(filteredLists[key].map(constraint => {
                    return <Constraint key={getCodeFromURI(constraint.uri)} id={getCodeFromURI(constraint.uri)} data={constraint.uri} type={key} addNode={addNode} />

                }));
            }
        });
        return result;
    }
    return (
        <ul className={ConstraintListStyles.constraintList}>
            {listContent()}
        </ul>
    );
}

export default ConstraintList;
