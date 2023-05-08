import React from 'react';
import ConstraintListStyles from "./constraintList.module.css";
import Constraint from '../Constraint/constraint';

// Displays both all the elements and their variables
function ConstraintList({ varData, filteredLists, colorList, addNode }) {
    // TODO elements without URI need a valid ID
    function getCodeFromURI(uri) {
        return uri.substring(uri.lastIndexOf('/') + 1);
    }
    function listContent() {
        let result = [];
        Object.keys(varData).forEach(key => {
            if ("VAR_" + key in filteredLists)
                result.push(<Constraint key={getCodeFromURI(filteredLists["VAR_" + key])} id={key.toUpperCase() + " variable"} data={filteredLists["VAR_" + key]} type={key} color={colorList[key]} addNode={addNode} isVar={true} graph={varData[key].uri_graph} />);
            if (filteredLists[key].length !== 0) {
                result.push(filteredLists[key].map(constraint => {
                    return <Constraint key={getCodeFromURI(constraint.uri)} id={constraint.label} data={constraint.uri} type={key} color={colorList[key]} addNode={addNode} isVar={false} />
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
